import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { images } from '@/constants'
import { logout, updateUser } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileField = ({ label, value, icon, onEdit }: { label: string, value: string, icon: any, onEdit?: () => void }) => (
	<View className="flex-row items-center bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
		<View className="bg-orange-50 p-3 rounded-full mr-4">
			<Image source={icon} className="size-6" tintColor="#FE8C00" resizeMode="contain" />
		</View>
		<View className="flex-1">
			<Text className="text-gray-400 text-xs font-quicksand-medium">{label}</Text>
			<Text className="text-dark-100 text-base font-quicksand-bold">{value || 'Not set'}</Text>
		</View>
	</View>
)

const Profile = () => {
	const { user, setUser, fetchAuthenticatedUser } = useAuthStore()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	// Form state
	const [formData, setFormData] = useState({
		name: user?.name || '',
		phone: user?.phone || '',
		address1: user?.address1 || '',
		address2: user?.address2 || '',
	})

	const handleLogout = async () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Logout',
				style: 'destructive',
				onPress: async () => {
					try {
						await logout()
						setUser(null)
						router.replace('/sign-in')
					} catch (error) {
						Alert.alert('Error', 'Failed to logout')
					}
				}
			}
		])
	}

	const handleUpdateProfile = async () => {
		if (!user?.$id) return;
		setLoading(true)
		try {
			await updateUser(user.$id, formData);
			await fetchAuthenticatedUser();
			setIsEditModalOpen(false);
			Alert.alert('Success', 'Profile updated successfully')
		} catch (error) {
			Alert.alert('Error', 'Failed to update profile')
		} finally {
			setLoading(false)
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
				{/* Header */}
				<View className="flex-row items-center justify-between px-6 py-4">
					<TouchableOpacity onPress={() => router.back()}>
						<Image source={images.arrowBack} className="size-6" />
					</TouchableOpacity>
					<Text className="text-xl font-quicksand-bold text-dark-100">Profile</Text>
					<TouchableOpacity>
						<Image source={images.search} className="size-6" />
					</TouchableOpacity>
				</View>

				{/* Profile Picture */}
				<View className="items-center mt-6">
					<View className="relative">
						<Image
							source={user?.avatar ? { uri: user.avatar } : images.avatar}
							className="size-32 rounded-full border-4 border-orange-100"
						/>
						<TouchableOpacity
							className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white"
							onPress={() => setIsEditModalOpen(true)}
						>
							<Image source={images.pencil} className="size-4" tintColor="white" />
						</TouchableOpacity>
					</View>
				</View>

				{/* Profile Details */}
				<View className="px-6 mt-10">
					<ProfileField
						label="Full Name"
						value={user?.name || ''}
						icon={images.user}
					/>
					<ProfileField
						label="Email"
						value={user?.email || ''}
						icon={images.envelope}
					/>
					<ProfileField
						label="Phone number"
						value={user?.phone || ''}
						icon={images.phone}
					/>
					<ProfileField
						label="Address 1 - (Home)"
						value={user?.address1 || ''}
						icon={images.location}
					/>
					<ProfileField
						label="Address 2 - (Work)"
						value={user?.address2 || ''}
						icon={images.location}
					/>
				</View>

				{/* Action Buttons */}
				<View className="px-6 mt-6 space-y-4">
					<TouchableOpacity
						className="w-full py-4 rounded-full border border-primary items-center"
						onPress={() => setIsEditModalOpen(true)}
					>
						<Text className="text-primary font-quicksand-bold text-lg">Edit Profile</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="w-full py-4 rounded-full border border-red-500 items-center flex-row justify-center space-x-2"
						onPress={handleLogout}
					>
						<Image source={images.logout} className="size-5" tintColor="#EF4444" />
						<Text className="text-red-500 font-quicksand-bold text-lg">Logout</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Edit Profile Modal */}
			<Modal
				visible={isEditModalOpen}
				animationType="slide"
				transparent={true}
			>
				<View className="flex-1 bg-black/50 justify-end">
					<View className="bg-white rounded-t-[40px] p-8 pb-12">
						<View className="flex-row justify-between items-center mb-6">
							<Text className="text-2xl font-quicksand-bold text-dark-100">Edit Profile</Text>
							<TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
								<Text className="text-gray-400 font-quicksand-bold">Close</Text>
							</TouchableOpacity>
						</View>

						<ScrollView showsVerticalScrollIndicator={false}>
							<CustomInput
								label="Full Name"
								value={formData.name}
								onChangeText={(text) => setFormData({ ...formData, name: text })}
								placeholder="Enter your name"
							/>
							<CustomInput
								label="Phone Number"
								value={formData.phone}
								onChangeText={(text) => setFormData({ ...formData, phone: text })}
								placeholder="Enter your phone number"
								keyboardType="phone-pad"
							/>
							<CustomInput
								label="Address 1"
								value={formData.address1}
								onChangeText={(text) => setFormData({ ...formData, address1: text })}
								placeholder="Enter home address"
							/>
							<CustomInput
								label="Address 2"
								value={formData.address2}
								onChangeText={(text) => setFormData({ ...formData, address2: text })}
								placeholder="Enter work address"
							/>

							<View className="mt-8">
								<CustomButton
									title="Save Changes"
									onPress={handleUpdateProfile}
									isLoading={loading}
								/>
							</View>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

export default Profile
