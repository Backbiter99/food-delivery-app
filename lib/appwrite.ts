import { CreateUserParams, SignInParams } from "@/types";
import {
    Account,
    AppwriteException,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.personal.fooddeliveryapp",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
};

// Validate appwriteConfig
const validateConfig = () => {
    const keyVals = [
        { key: "endpoint", value: appwriteConfig.endpoint },
        { key: "platform", value: appwriteConfig.platform },
        { key: "projectId", value: appwriteConfig.projectId },
        { key: "databaseId", value: appwriteConfig.databaseId },
        { key: "userCollectionId", value: appwriteConfig.userCollectionId },
    ];

    for (const keyVal of keyVals) {
        if (!keyVal.value) {
            console.error(`Appwrite ${keyVal.key} not found`);
            throw new Error(`Appwrite ${keyVal.key} not found`);
        }
    }
};

validateConfig();

export const client = new Client();

if (!appwriteConfig.endpoint) {
    console.error("Appwrite endpoint not found");

    throw new Error("Appwrite endpoint not found");
}
if (!appwriteConfig.projectId) {
    console.error("Appwrite project ID not found");
    throw new Error("Appwrite project ID not found");
}

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
    email,
    password,
    name,
}: CreateUserParams) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) {
            throw new Error("Error creating user");
        }

        await SignIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await database.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.userCollectionId!,
            ID.unique(),
            { email, name, avatar: avatarUrl, accountId: newAccount.$id }
        );
    } catch (error) {
        console.error("Error creating user at appwrite.ts: ", error);
        if (error instanceof AppwriteException) {
            throw new Error(error.message);
        } else if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error");
        }
    }
};

export const SignIn = async ({ email, password }: SignInParams) => {
    try {
        await account.createEmailPasswordSession(email, password);
    } catch (error: unknown) {
        console.error("Error signing in at appwrite.ts: ", error);
        if (error instanceof AppwriteException) {
            throw new Error(error.message);
        } else if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error");
        }
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) {
            console.error("Account not found");
            throw new Error("Account not found");
        }

        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.userCollectionId!,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser.documents[0]) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return currentUser.documents[0];
    } catch (error: any) {
        console.error("Error getting current user at appwrite.ts: ", error);
        if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error getting current user");
        }
    }
};
