import { CreateUserParams, SignInParams } from "@/type"
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.fawad.fooddelivery",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "69512df20010abb2a1b2",
  userCollectionId: "user",
}

export const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const databases = new Databases(client)
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
    if (!currentAccount) throw new Error("No account found")

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser.documents.length) {
      throw new Error("User document not found")
    }

    return currentUser.documents[0]

  } catch (e) {
    console.error(e)
    throw e
  }
}
