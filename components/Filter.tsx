import { Category } from "@/types";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity } from "react-native";
import { Models } from "react-native-appwrite";

const Filter = ({ categories }: { categories: Models.Document[] }) => {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = useState(searchParams.category || "");

    const handlePress = (id: string) => {
        setActive(id);

        if (id === "all") {
            router.setParams({ category: undefined });
        } else router.setParams({ category: id });
    };

    const filterData: (Category | { $id: string; name: string })[] = categories
        ? [{ $id: "all", name: "All" }, ...(categories as Category[])]
        : [{ $id: "all", name: "All" }];

    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-3"
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        key={item.$id}
                        className={cn(
                            "filter",
                            active === item.$id ? "bg-amber-500" : "bg-white"
                        )}
                        style={
                            Platform.OS === "android"
                                ? { elevation: 5, shadowColor: "#878787" }
                                : {}
                        }
                        onPress={() => handlePress(item.$id)}
                    >
                        <Text
                            key={item.$id}
                            className={cn(
                                "body-medium",
                                active === item.$id
                                    ? "bg-amber-500"
                                    : "text-gray-200"
                            )}
                            style={
                                Platform.OS === "android" && {
                                    elevation: 5,
                                    shadowColor: "#878787",
                                }
                            }
                            onPress={() => handlePress(item.$id)}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

export default Filter;
