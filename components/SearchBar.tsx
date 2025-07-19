import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = () => {
    const params = useLocalSearchParams<{ query: string }>();
    const [query, setQuery] = useState(params.query || "");

    const handleSearch = (text: string) => {
        setQuery(text);
        // Only clear URL param when text becomes completely empty
        if (text.length === 0) {
            router.setParams({ query: undefined });
        }
    };

    const handleSubmit = () => {
        if (query.trim()) {
            router.setParams({ query: query.trim() });
        }
    };

    return (
        <View className="searchbar flex-row items-center">
            <TextInput
                className="flex-1 p-5"
                placeholder="Search for pizzas, burgers and more"
                value={query}
                onChangeText={handleSearch}
                onSubmitEditing={handleSubmit}
                placeholderTextColor="#a0a0a0"
                returnKeyType="search"
            />
            <TouchableOpacity className="pr-5" onPress={handleSubmit}>
                <Image
                    source={images.search}
                    className="size-6"
                    resizeMode="contain"
                    tintColor="#5d5f6d"
                />
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;
