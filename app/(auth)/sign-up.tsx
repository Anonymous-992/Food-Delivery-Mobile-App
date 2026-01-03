import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { Link, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
  const { isAuthenticated, fetchAuthenticatedUser } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated])

  const submit = async () => {
    const { name, email, password } = form

    if (!name || !email || !password) {
      return Alert.alert('Error', 'All fields are required')
    }

    setIsSubmitting(true)

    try {
      await createUser({
        email,
        password,
        name,
      })
      // Update auth state before redirecting
      await fetchAuthenticatedUser()
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <View className="gap-10 bg-white rounded-lg p-5 mt-5">
        <CustomInput
          placeholder="Enter Your Name"
          value={form.name}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, name: text }))
          }
          label="Name"
        />

        <CustomInput
          placeholder="Enter Your E-mail"
          value={form.email}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, email: text }))
          }
          label="Email"
          keyboardType="email-address"
        />

        <CustomInput
          placeholder="Enter Your Password"
          value={form.password}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, password: text }))
          }
          label="Password"
          secureTextEntry
        />

        <CustomButton
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
        />

        <View className="flex flex-row gap-2 justify-center">
          <Text className="base-regular text-gray-100">
            Already have account?
          </Text>
          <Link href="/sign-in" className="base-bold text-primary">
            Sign In
          </Link>
        </View>
      </View>
    </>
  )
}

export default SignUp
