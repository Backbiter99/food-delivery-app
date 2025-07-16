import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { SignIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form, setForm] = useState<{ email: string; password: string }>({
        email: "",
        password: "",
    });

    const submit = async () => {
        if (form.email === "" || form.password === "") {
            Alert.alert("Error", "Please enter valid email and password");
            return;
        }

        setIsSubmitting(true);
        try {
            // Call appwrite API to sign in user
            await SignIn({ email: form.email, password: form.password });

            Alert.alert("Success", "You have successfully signed in!");
            router.push("/");
        } catch (error) {
            console.error("Error submitting form at /SignIn: ", error);
            Alert.alert("Error", "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter Your Email"
                value={form.email}
                onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, email: text }));
                }}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter Your Password"
                value={form.password}
                onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, password: text }));
                }}
                label="Password"
                secureTextEntry={true}
            />
            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don't have an account?
                </Text>
                <Link href={"/SignUp"} className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    );
};

export default SignInPage;
