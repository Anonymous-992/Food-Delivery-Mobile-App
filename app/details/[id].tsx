import { images, sides, toppings } from '@/constants'
import { appwriteConfig, getMenuItem } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { useCartStore } from '@/store/cart.store'
import { MenuItem } from '@/type'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Details = () => {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { data: item, loading } = useAppwrite({
		fn: getMenuItem,
		params: { id: id! }
	})
	const { addItem } = useCartStore()
	const [quantity, setQuantity] = useState(1)

	// To prevent 'item is possibly null' errors effectively
	const menuItem = item as unknown as MenuItem

	if (loading) {
		return (
			<SafeAreaView className='bg-white h-full flex-center'>
				<ActivityIndicator size="large" color="#FF9C01" />
			</SafeAreaView>
		)
	}

	if (!item) {
		return (
			<SafeAreaView className='bg-white h-full flex-center'>
				<Text>Item not found</Text>
			</SafeAreaView>
		)
	}

	const imageUrl = `${menuItem.image_url}?project=${appwriteConfig.projectId}`

	const handleAddToCart = () => {
		for (let i = 0; i < quantity; i++) {
			addItem({
				id: menuItem.$id,
				name: menuItem.name,
				price: menuItem.price,
				image_url: imageUrl,
			})
		}
		router.back()
	}

	return (
		<SafeAreaView className='bg-white h-full relative'>
			<ScrollView contentContainerClassName='pb-32'>
				{/* Header */}
				<View className='flex-row justify-between items-center px-5 py-3 z-10'>
					<TouchableOpacity onPress={() => router.back()}>
						<Image source={images.arrowBack} className='size-8' resizeMode='contain' />
					</TouchableOpacity>
					<Image source={images.search} className='size-8' resizeMode='contain' />
				</View>

				{/* Main Content */}
				<View className='px-5 mt-5 flex-row justify-between'>
					{/* Left: Details */}
					<View className='flex-1 pr-2'>
						<Text className='h2-bold text-dark-100'>{menuItem.name}</Text>
						<Text className='paragraph-regular text-gray-200 mt-1 capitalize'>{menuItem.type || 'Delicious Food'}</Text>

						<View className='flex-row items-center gap-2 mt-2'>
							{[1, 2, 3, 4, 5].map((_, i) => (
								<Image key={i} source={images.star} className='size-4' tintColor='#FF9C01' />
							))}
							<Text className='paragraph-bold text-dark-100 ml-1'>{menuItem.rating || 4.5}/5</Text>
						</View>

						<Text className='h2-bold text-primary mt-4'>${menuItem.price.toFixed(2)}</Text>

						<View className='flex-wrap flex-row mt-6 gap-x-6 gap-y-4'>
							<View>
								<Text className='paragraph-regular text-gray-200'>Calories</Text>
								<Text className='base-bold text-dark-100 mt-1'>{menuItem.calories || 350} Cal</Text>
							</View>
							<View>
								<Text className='paragraph-regular text-gray-200'>Protein</Text>
								<Text className='base-bold text-dark-100 mt-1'>{menuItem.protein || 30}g</Text>
							</View>
							<View>
								<Text className='paragraph-regular text-gray-200'>Bun Type</Text>
								<Text className='base-bold text-dark-100 mt-1'>Whole Wheat</Text>
							</View>
						</View>
					</View>

					{/* Right: Circle Image */}
					<View className='w-[180px] h-[180px] rounded-full shadow-lg shadow-black/20 bg-white items-center justify-center ml-[-20px] z-20 mt-4'>
						<Image
							source={{ uri: imageUrl }}
							className='w-[200px] h-[200px] rounded-full'
							resizeMode='cover'
						/>
					</View>
				</View>

				{/* Spacing */}
				<View className='h-6' />

				{/* Delivery Info Strip */}
				<View className='mx-5 bg-orange-50 rounded-full p-4 flex-row justify-between items-center mt-5'>
					<View className='flex-row items-center gap-2'>
						<Image source={images.dollar} className='size-5' tintColor='#FF9C01' resizeMode='contain' />
						<Text className='paragraph-bold text-dark-100'>Free Delivery</Text>
					</View>
					<View className='flex-row items-center gap-2'>
						<Image source={images.clock} className='size-5' tintColor='#FF9C01' resizeMode='contain' />
						<Text className='paragraph-bold text-dark-100'>20 - 30 mins</Text>
					</View>
					<View className='flex-row items-center gap-2'>
						<Image source={images.star} className='size-5' tintColor='#FF9C01' resizeMode='contain' />
						<Text className='paragraph-bold text-dark-100'>4.5</Text>
					</View>
				</View>

				{/* Description */}
				<View className='px-5 mt-6'>
					<Text className='paragraph-regular text-gray-200 leading-6'>
						{menuItem.description}
					</Text>
				</View>

				{/* Toppings */}
				<View className='pl-5 mt-6'>
					<Text className='h3-bold text-dark-100 mb-4'>Toppings</Text>
					<FlatList
						horizontal
						data={toppings}
						keyExtractor={(item) => item.name}
						showsHorizontalScrollIndicator={false}
						contentContainerClassName='gap-4 pr-5'
						renderItem={({ item }) => (
							<View className='bg-white border border-gray-100 rounded-3xl p-3 w-[110px] h-[140px] justify-between shadow-sm'>
								<View className='flex-1 items-center justify-center'>
									<Image source={item.image} className='size-16' resizeMode='contain' />
								</View>
								<View className='flex-row items-center justify-between w-full mt-2'>
									<Text className='small-bold text-dark-100 flex-1 mr-1' numberOfLines={1}>{item.name}</Text>
									<TouchableOpacity className='bg-red-500 rounded-full size-7 flex-center'>
										<Image source={images.plus} className='size-4' tintColor='white' />
									</TouchableOpacity>
								</View>
							</View>
						)}
					/>
				</View>

				{/* Sides */}
				<View className='pl-5 mt-6'>
					<Text className='h3-bold text-dark-100 mb-4'>Side options</Text>
					<FlatList
						horizontal
						data={sides}
						keyExtractor={(item) => item.name}
						showsHorizontalScrollIndicator={false}
						contentContainerClassName='gap-4 pr-5'
						renderItem={({ item }) => (
							<View className='bg-white border border-gray-100 rounded-3xl p-3 w-[110px] h-[140px] justify-between shadow-sm'>
								<View className='flex-1 items-center justify-center'>
									<Image source={item.image} className='size-16' resizeMode='contain' />
								</View>
								<View className='flex-row items-center justify-between w-full mt-2'>
									<Text className='small-bold text-dark-100 flex-1 mr-1' numberOfLines={1}>{item.name}</Text>
									<TouchableOpacity className='bg-red-500 rounded-full size-7 flex-center'>
										<Image source={images.plus} className='size-4' tintColor='white' />
									</TouchableOpacity>
								</View>
							</View>
						)}
					/>
				</View>

			</ScrollView>

			{/* Bottom Bar */}
			<View className='absolute bottom-0 w-full bg-white rounded-t-3xl shadow-lg px-5 py-6 flex-row items-center justify-between'>
				<View className='flex-row items-center bg-gray-50 rounded-full px-4 py-2 gap-4'>
					<TouchableOpacity onPress={() => quantity > 1 && setQuantity(q => q - 1)}>
						<Text className='h3-bold text-gray-200'>-</Text>
					</TouchableOpacity>
					<Text className='h3-bold text-dark-100'>{quantity}</Text>
					<TouchableOpacity onPress={() => setQuantity(q => q + 1)}>
						<Text className='h3-bold text-primary'>+</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					className='bg-primary flex-1 ml-5 rounded-full py-4 flex-row justify-center items-center gap-2'
					onPress={handleAddToCart}
				>
					<Image source={images.bag} className='size-5' tintColor='white' />
					<Text className='paragraph-bold text-white'>
						Add to cart (${(menuItem.price * quantity).toFixed(0)})
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

export default Details
