import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

Sentry.init({
    dsn: "https://4da168185854bb8ac923fdc59b60311a@o4509680435331072.ingest.de.sentry.io/4509680463315024",

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
    ],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
    const { isLoading, fetchAuthenticatedUser } = useAuthStore();

    const [fontsLoaded, error] = useFonts({
        "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
        "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
        "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
        "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
        "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    });

    useEffect(() => {
        if (error) {
            console.error("Error loading fonts: ", error);
            throw error;
        }

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    useEffect(() => {
        fetchAuthenticatedUser();
    }, []);

    if (!fontsLoaded || isLoading) {
        return null;
    }

    return (
        <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
        />
    );
});
