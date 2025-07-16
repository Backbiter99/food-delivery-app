import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUpPage = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form, setForm] = useState<{
        email: string;
        password: string;
        name: string;
    }>({
        email: "",
        password: "",
        name: "",
    });

    const submit = async () => {
        if (form.email === "" || form.password === "" || form.name === "") {
            Alert.alert("Error", "Please enter valid name, email and password");
            return;
        }

        setIsSubmitting(true);
        try {
            // Call appwrite API to sign up user
            await createUser({
                email: form.email,
                password: form.password,
                name: form.name,
            });

            Alert.alert("Success", "You have successfully signed up!");
            router.push("/");
        } catch (error: any) {
            console.error("Error submitting form at /SignUp: ", error);
            if (error.message) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Error", "Something went wrong");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter Your Full Name"
                value={form.name}
                onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, name: text }));
                }}
                label="Full Name"
            />
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
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href={"/SignIn"} className="base-bold text-primary">
                    Sign In
                </Link>
            </View>
        </View>
    );
};

export default SignUpPage;
