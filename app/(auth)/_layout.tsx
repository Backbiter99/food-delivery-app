import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Redirect href={"/"} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                className="bg-white h-full"
                keyboardShouldPersistTaps="handled"
            >
                <View className="w-full relative" style={styles.dimensions}>
                    <ImageBackground
                        source={images.loginGraphic}
                        className="size-full rounded-b-lg"
                    />

                    <Image
                        source={images.logo}
                        className="self-center size-48 absolute bottom-16 z-10"
                    />
                </View>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    dimensions: {
        height: Dimensions.get("screen").height / 2.25,
    },
});
