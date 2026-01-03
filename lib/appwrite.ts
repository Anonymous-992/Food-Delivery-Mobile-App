import { CreateUserParams, GetMenuParams, SignInParams, User } from "@/type"
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.fawad.fooddelivery",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "69512df20010abb2a1b2",
  userCollectionId: "user",
  bucketId: "6953e7280023a0219c42",
  categoriesCollectionId: "categories",
  menuCollectionId: "menu",
  customizationCollectionId: "customizations",
  menuCustomizationCollectionId: "menu_customizations",
}

export const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

const avatars = new Avatars(client)

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
    )

    if (!newAccount) throw new Error("Account creation failed")

    await signIn({ email, password })

    const avatarUrl = avatars.getInitialsURL(name)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    )

    return newUser
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(
      email,
      password
    )
    return session
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get()

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    return currentUser.documents[0] ?? null
  } catch {
    return null
  }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = []

    if (category) queries.push(Query.equal("categories", category))
    if (query) queries.push(Query.search("name", query))

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    )

    return menus.documents
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const getMenuItem = async ({ id }: { id: string }) => {
  try {
    const menu = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      id
    )
    return menu
  } catch (e: any) {
    throw new Error(e.message)
  }
}


export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    )

    return categories.documents
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export const updateUser = async (userId: string, data: Partial<User>) => {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      data
    );
    return updatedUser;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
