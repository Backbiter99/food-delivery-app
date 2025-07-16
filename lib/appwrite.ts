export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.personal.fooddeliveryapp",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
};
