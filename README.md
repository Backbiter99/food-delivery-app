# 🍔 Food Delivery App

A sleek and modern mobile food delivery application built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and a powerful modern tech stack. This project provides a clean UI/UX and essential features for a real-world food ordering experience.

> Inspired and guided by this [YouTube tutorial](https://www.youtube.com/watch?v=LKrX390fJMw).

---

## 🚀 Features

- Browse food menus and categories
- Add items to cart and manage orders
- Responsive and intuitive mobile UI
- State management with Zustand
- Backend handled by Appwrite
- Error monitoring with Sentry
- Built using modern styling tools like TailwindCSS and Nativewind

---

## 🧑‍💻 Tech Stack

| Layer      | Technology                                                                          |
| ---------- | ----------------------------------------------------------------------------------- |
| Framework  | [React Native](https://reactnative.dev)                                             |
| Build Tool | [Expo](https://expo.dev)                                                            |
| Compiler   | [React Compiler](https://react.dev/blog/2024/05/02/react-compiler-preview)          |
| Styling    | [Nativewind](https://www.nativewind.dev/) + [Tailwind CSS](https://tailwindcss.com) |
| Language   | TypeScript                                                                          |
| State Mgmt | [Zustand](https://zustand-demo.pmnd.rs/)                                            |
| Backend    | [Appwrite](https://appwrite.io)                                                     |
| Monitoring | [Sentry](https://sentry.io/)                                                        |

---

## 📦 Getting Started

Follow these steps to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Backbiter99/food-delivery-app.git
cd food-delivery-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Environment Variables

1. Create an Appwrite account and set up a project. Refer to the .env.example file for more details.

2. Update the .env file with your Appwrite project details:

```bash
EXPO_PUBLIC_APPWRITE_PROJECT_ID=<your-project-id>
EXPO_PUBLIC_APPWRITE_ENDPOINT=<your-endpoint>
EXPO_PUBLIC_APPWRITE_DB_ID=<your-database-id>
EXPO_PUBLIC_APPWRITE_ASSETS_BUCKET_ID=<your-assets-bucket-id>
EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID=<your-user-collection-id>
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=<your-categories-collection-id>
EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID=<your-menu-collection-id>
EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID=<your-customizations-collection-id>
EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID=<your-customizations-collection-id>
```

3. Update the .env.local file with your Sentry authentication token:

```bash
SENTRY_AUTH_TOKEN=<your-sentry-auth-token>
```

### 4. Start the App

```bash
npx expo start --clear
```

This will start the development server. Use the Expo Go app or a simulator to preview it.

---

## 🧠 Learning Resources

This app was built with guidance from this excellent [YouTube tutorial](https://www.youtube.com/watch?v=LKrX390fJMw) by [JS Mastery](https://www.youtube.com/@javascriptmastery), which covers the entire development process in-depth.

---

## 📸 Screenshots

---

## 🛠️ TODOs

- [ ] Add payment integration
- [ ] Add profile tab
- [ ] Add product view

---

## 🧾 License

This project is open-source and available under the MIT License.

---

## 🙌 Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Appwrite](https://appwrite.io/)
- [Sentry](https://sentry.io/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tutorial by JS Mastery](https://www.youtube.com/watch?v=LKrX390fJMw)

---
