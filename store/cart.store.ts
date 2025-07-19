import { CartCustomization, CartStore } from "@/types";
import { create } from "zustand";

const areCustomizationsEqual = (
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
) => {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, index) => item.id === bSorted[index].id);
};

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (item) => {
        const customizations = item.customizations ?? [];

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        if (existing) {
            set({
                items: get().items.map((i) => {
                    return i.id === item.id &&
                        areCustomizationsEqual(
                            i.customizations ?? [],
                            customizations
                        )
                        ? { ...i, quantity: i.quantity + 1 }
                        : i;
                }),
            });
        } else {
            set({
                items: [
                    ...get().items,
                    { ...item, customizations, quantity: 1 },
                ],
            });
        }
    },

    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter((i) => {
                return !(
                    i.id === id &&
                    areCustomizationsEqual(
                        i.customizations ?? [],
                        customizations
                    )
                );
            }),
        });
    },
    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) => {
                return i.id === id &&
                    areCustomizationsEqual(
                        i.customizations ?? [],
                        customizations
                    )
                    ? { ...i, quantity: i.quantity + 1 }
                    : i;
            }),
        });
    },
    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) => {
                    return i.id === id &&
                        areCustomizationsEqual(
                            i.customizations ?? [],
                            customizations
                        )
                        ? { ...i, quantity: i.quantity - 1 }
                        : i;
                })
                .filter((i) => {
                    i.quantity > 0;
                }),
        });
    },
    clearCart: () => set({ items: [] }),
    getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
    },
    getTotalPrice: () => {
        return get().items.reduce((total, item) => {
            const basePrice = item.price;
            const customPrice =
                item.customizations?.reduce(
                    (n: number, c: CartCustomization) => n + c.price,
                    0
                ) ?? 0;

            return total + item.quantity * (basePrice + customPrice);
        }, 0);
    },
}));
