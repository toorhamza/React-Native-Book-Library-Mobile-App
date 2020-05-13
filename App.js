import * as React from "react";
import { Header } from "react-native-elements";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import FavouriteScreen from "./screens/FavouriteScreen";
import FlashMessage from "react-native-flash-message";


const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <>
      <Header
        placement="left"
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{
          text: "Book Library",
          style: { color: "#fff", fontSize: 25 },
        }}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "ios-book" : "md-book";
              } else if (route.name === "Favourites") {
                iconName = focused ? "ios-star" : "ios-star-outline";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={24} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Favourites" component={FavouriteScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <FlashMessage position="bottom" />
    </>
  );
}
