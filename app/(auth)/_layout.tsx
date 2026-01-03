import { images } from '@/constants'
import useAuthStore from '@/store/auth.store'
import { Redirect, Slot } from 'expo-router'
import React from 'react'
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'

export default function AuthLayout() {

	const { isAuthenticated } = useAuthStore()

	if (isAuthenticated) return <Redirect href="/" />

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScrollView className=' bg-white h-full' keyboardShouldPersistTaps="handled">
				<View className=' w-full relative' style={{ height: Dimensions.get('screen').height / 2.25 }}>
					<ImageBackground source={images.loginGraphic} className=' size-full rounded-b-lg' resizeMode='stretch' />
					<Image source={images.logo} className=' self-center size-48 absolute -bottom-16 z-10' />
				</View>
				<Slot />

				{/* Developed By Fawad Badge */}
				<View className="items-center justify-center mt-8 mb-8">
					<View className="bg-white/90 px-6 py-2 rounded-full shadow-sm border border-gray-100">
						<Text className="text-xs text-gray-500 font-quicksand-medium">
							Developed By <Text className="text-primary font-quicksand-bold">Fawad</Text>
						</Text>
					</View>
				</View>
			</ScrollView>

		</KeyboardAvoidingView>
	)
}