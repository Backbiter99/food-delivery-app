import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function TabLayout() {
    const { isAuthenticated } = useAuthStore();
    console.log("isAuthenticated:", isAuthenticated);

    if (!isAuthenticated) {
        console.log("Redirecting to SignIn");
        return <Redirect href="/SignIn" />;
    }

    console.log("Rendering tabs content");
    return <Slot />;
}
