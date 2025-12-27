import "./globals.css"
import { Text, View } from "react-native";
 
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center  bg-green-100">
      <Text className="text-5xl text-primary text-center font-bold font-quicksand-bold text-blue-500">
        Welcome to My ReactNative APP!
      </Text>
    </View>
  );
}