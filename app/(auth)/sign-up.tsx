import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'

const SignUp = () => {

		const [isSubmitting, setIsSubmitting] = useState(false)
		const [form, setForm] = useState({name : '',email : '', password: ''})	

		const submit = async () => {
			if(!form.name ||form.email || !form.password) return Alert.alert('Error', 'Please enter valid email or password')

			setIsSubmitting(true)

			try{
				Alert.alert('Success', 'Signed up sucessfully')
				router.replace('/')
			}catch(error : any){
				Alert.alert('Error', 'error.message')
			}


		}	

	
  return (
	<View className=' gap-10 bg-white rounded-lg p-5 mt-5'>
	  

		<CustomInput 
		   placeholder='Enter Your Name'
		   value={form.name}
		   onChangeText={(text) => setForm((prev) => ({...prev, name : text}))}
		   label='Name'
		   
		/>

		<CustomInput 
		   placeholder='Enter Your E-mail'
		   value={form.email}
		   onChangeText={(text) => setForm((prev) => ({...prev, email : text}))}
		   label='Email'
		   keyboardType='email-address'
		/>

		<CustomInput 
		   placeholder='Enter Your Password'
		   value={form.password}
		   onChangeText={(text) => setForm((prev) => ({...prev, password : text}))}
		   label='Password'
		   secureTextEntry={true}
		/>

		<CustomButton 
		title='Sign Up'
		isLoading={isSubmitting}
		onPress={submit}
		/>

		<View className=' flex flex-row gap-2 justify-center'>
			<Text className=' base-regular text-gray-100'>Already have account?</Text>
			<Link href="/sign-in" className=' base-bold text-primary'>
				Sign In
			</Link>
		</View>

	</View>
  )
}

export default SignUp