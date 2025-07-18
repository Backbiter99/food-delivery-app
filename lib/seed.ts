import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, database, storage } from "./appwrite";
import dummyData from "./data";

// Add delay function to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Batch processing with delays
async function processBatch<T>(
    items: T[],
    processor: (item: T) => Promise<any>,
    batchSize: number = 3,
    delayMs: number = 1000
) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        console.log(
            `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`
        );

        try {
            const batchResults = await Promise.all(
                batch.map((item) => processor(item))
            );
            results.push(...batchResults);

            // Add delay between batches
            if (i + batchSize < items.length) {
                console.log(`Waiting ${delayMs}ms before next batch...`);
                await delay(delayMs);
            }
        } catch (error) {
            console.error(
                `Batch ${Math.floor(i / batchSize) + 1} failed:`,
                error
            );

            // Try processing items individually in this batch
            console.log("Retrying batch items individually...");
            for (const item of batch) {
                try {
                    const result = await processor(item);
                    results.push(result);
                    await delay(500); // Small delay between individual items
                } catch (itemError) {
                    console.error("Individual item failed:", itemError);
                    throw itemError;
                }
            }
        }
    }

    return results;
}

async function clearAll(collectionId: string): Promise<void> {
    try {
        console.log(`Clearing collection: ${collectionId}`);

        // Get all documents in smaller batches
        let allDocuments = [];
        let offset = 0;
        const limit = 25; // Smaller batch size

        while (true) {
            const list = await database.listDocuments(
                appwriteConfig.databaseId!,
                collectionId,
                [Query.limit(limit), Query.offset(offset)]
            );

            allDocuments.push(...list.documents);

            if (list.documents.length < limit) {
                break; // No more documents
            }

            offset += limit;
            await delay(200); // Small delay between fetches
        }

        console.log(`Found ${allDocuments.length} documents to delete`);

        // Delete in batches with delays
        await processBatch(
            allDocuments,
            async (doc) => {
                return database.deleteDocument(
                    appwriteConfig.databaseId!,
                    collectionId,
                    doc.$id
                );
            },
            5, // Delete 5 at a time
            500 // 500ms delay between batches
        );

        console.log(
            `✅ Cleared ${allDocuments.length} documents from ${collectionId}`
        );
    } catch (error) {
        console.error(`❌ Error clearing collection ${collectionId}:`, error);
        throw error;
    }
}

async function clearStorage(): Promise<void> {
    try {
        console.log("Clearing storage...");

        // Get all files in smaller batches
        let allFiles = [];
        let offset = 0;
        const limit = 25;

        while (true) {
            const list = await storage.listFiles(
                appwriteConfig.assetsBucketId!,
                [Query.limit(limit), Query.offset(offset)]
            );

            allFiles.push(...list.files);

            if (list.files.length < limit) {
                break;
            }

            offset += limit;
            await delay(200);
        }

        console.log(`Found ${allFiles.length} files to delete`);

        // Delete files in batches
        await processBatch(
            allFiles,
            async (file) => {
                return storage.deleteFile(
                    appwriteConfig.assetsBucketId!,
                    file.$id
                );
            },
            3, // Delete 3 files at a time
            800 // 800ms delay between batches
        );

        console.log(`✅ Cleared ${allFiles.length} files from storage`);
    } catch (error) {
        console.error("❌ Error clearing storage:", error);
        throw error;
    }
}

async function uploadImageToStorage(
    imageUrl: string,
    retries = 3
): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(
                `📤 Uploading image (attempt ${attempt}/${retries}): ${imageUrl.substring(0, 50)}...`
            );

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

            const response = await fetch(imageUrl, {
                signal: controller.signal,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (compatible; FoodDeliveryApp/1.0)",
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            // Add delay before upload to avoid overwhelming the server
            await delay(500);

            const fileName =
                imageUrl.split("/").pop()?.split("?")[0] ||
                `file-${Date.now()}.png`;
            const fileObj = {
                name: fileName,
                type: blob.type || "image/png",
                size: blob.size,
                uri: imageUrl,
            };

            const file = await storage.createFile(
                appwriteConfig.assetsBucketId!,
                ID.unique(),
                fileObj
            );

            const viewUrl = storage.getFileViewURL(
                appwriteConfig.assetsBucketId!,
                file.$id
            );
            console.log(`✅ Image uploaded successfully: ${file.$id}`);

            // Small delay after successful upload
            await delay(300);

            return viewUrl.toString();
        } catch (error) {
            console.error(`❌ Upload attempt ${attempt} failed:`, error);

            if (attempt === retries) {
                console.log(
                    `⚠️  Using original URL as fallback for: ${imageUrl}`
                );
                return imageUrl;
            }

            // Progressive backoff - wait longer between retries
            await delay(2000 * attempt);
        }
    }

    return imageUrl;
}

async function seed(): Promise<void> {
    try {
        console.log("🌱 Starting rate-limited seeding process...");

        // 1. Clear all collections and storage
        console.log("🧹 Clearing existing data...");
        await clearAll(appwriteConfig.categoriesCollectionId!);
        await delay(1000);
        await clearAll(appwriteConfig.customizationsCollectionId!);
        await delay(1000);
        await clearAll(appwriteConfig.menuCollectionId!);
        await delay(1000);
        await clearAll(appwriteConfig.menuCustomizationsCollectionId!);
        await delay(1000);
        await clearStorage();
        await delay(2000); // Longer delay after clearing

        // 2. Create Categories with delays
        console.log("📂 Creating categories...");
        const categoryMap: Record<string, string> = {};

        for (let i = 0; i < dummyData.categories.length; i++) {
            const cat = dummyData.categories[i];
            try {
                const doc = await database.createDocument(
                    appwriteConfig.databaseId!,
                    appwriteConfig.categoriesCollectionId!,
                    ID.unique(),
                    cat
                );
                categoryMap[cat.name] = doc.$id;
                console.log(
                    `✅ Created category ${i + 1}/${dummyData.categories.length}: ${cat.name}`
                );

                // Delay between each category creation
                await delay(300);
            } catch (error) {
                console.error(`❌ Error creating category ${cat.name}:`, error);
                throw error;
            }
        }

        // 3. Create Customizations with delays
        console.log("🎨 Creating customizations...");
        const customizationMap: Record<string, string> = {};

        for (let i = 0; i < dummyData.customizations.length; i++) {
            const cus = dummyData.customizations[i];
            try {
                const doc = await database.createDocument(
                    appwriteConfig.databaseId!,
                    appwriteConfig.customizationsCollectionId!,
                    ID.unique(),
                    {
                        name: cus.name,
                        price: cus.price,
                        type: cus.type,
                    }
                );
                customizationMap[cus.name] = doc.$id;
                console.log(
                    `✅ Created customization ${i + 1}/${dummyData.customizations.length}: ${cus.name}`
                );

                // Delay between each customization creation
                await delay(300);
            } catch (error) {
                console.error(
                    `❌ Error creating customization ${cus.name}:`,
                    error
                );
                throw error;
            }
        }

        // 4. Create Menu Items with significant delays
        console.log("🍔 Creating menu items...");
        const menuMap: Record<string, string> = {};

        for (let i = 0; i < dummyData.menu.length; i++) {
            const item = dummyData.menu[i];
            try {
                console.log(
                    `Processing menu item ${i + 1}/${dummyData.menu.length}: ${item.name}`
                );

                // Upload image first
                const uploadedImage = await uploadImageToStorage(
                    item.image_url
                );

                // Additional delay before creating document
                await delay(1000);

                const doc = await database.createDocument(
                    appwriteConfig.databaseId!,
                    appwriteConfig.menuCollectionId!,
                    ID.unique(),
                    {
                        name: item.name,
                        description: item.description,
                        image_url: uploadedImage,
                        price: item.price,
                        rating: item.rating,
                        calories: item.calories,
                        protein: item.protein,
                        categories: categoryMap[item.category_name],
                    }
                );

                menuMap[item.name] = doc.$id;
                console.log(`✅ Created menu item: ${item.name}`);

                // Delay before creating customization links
                await delay(500);

                // 5. Create menu_customizations with delays
                for (let j = 0; j < item.customizations.length; j++) {
                    const cusName = item.customizations[j];
                    try {
                        if (customizationMap[cusName]) {
                            await database.createDocument(
                                appwriteConfig.databaseId!,
                                appwriteConfig.menuCustomizationsCollectionId!,
                                ID.unique(),
                                {
                                    menu: doc.$id,
                                    customizations: customizationMap[cusName],
                                }
                            );

                            // Small delay between customization links
                            await delay(200);
                        } else {
                            console.warn(
                                `⚠️  Customization not found: ${cusName}`
                            );
                        }
                    } catch (error) {
                        console.error(
                            `❌ Error linking customization ${cusName} to ${item.name}:`,
                            error
                        );
                        // Don't throw here, continue with other customizations
                    }
                }

                // Longer delay between menu items
                await delay(1500);
            } catch (error) {
                console.error(
                    `❌ Error creating menu item ${item.name}:`,
                    error
                );
                throw error;
            }
        }

        console.log("🎉 Rate-limited seeding completed successfully!");
    } catch (error) {
        console.error("💥 Seeding failed:", error);
        throw error;
    }
}

export default seed;
