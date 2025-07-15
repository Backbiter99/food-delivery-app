import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const SignIn = () => {
    return (
        <View>
            <Text>SignIn</Text>
            <Button
                title="SignUp"
                onPress={() => {
                    router.push("/SignUp");
                }}
            />
        </View>
    );
};

export default SignIn;
