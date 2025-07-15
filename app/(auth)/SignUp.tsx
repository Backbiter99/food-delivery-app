import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const SignUp = () => {
    return (
        <View>
            <Text>SignUp</Text>
            <Button
                title="SignIn"
                onPress={() => {
                    router.push("/SignIn");
                }}
            />
        </View>
    );
};

export default SignUp;
