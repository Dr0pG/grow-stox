import React from "react";
import { Tabs } from "expo-router";
import { Metrics } from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";

const Navigator = () => {
  const [
    bottomBarBackground,
    bottomBarActive,
    bottomBarInactive,
    bottomBarBorder,
  ] = useThemeColor({}, [
    "bottomBarBackground",
    "bottomBarActive",
    "bottomBarInactive",
    "bottomBarBorder",
  ]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: bottomBarActive,
        tabBarInactiveTintColor: bottomBarInactive,
        headerShown: false,
        tabBarStyle: {
          height: Metrics.bottomBarHeight,
          paddingTop: Metrics.smallMargin + 2,
          backgroundColor: bottomBarBackground,
          justifyContent: "center",
          borderTopWidth: 1,
          borderTopColor: bottomBarBorder,
        },
      }}
      initialRouteName="(1_main)"
    >
      <Tabs.Screen
        name="(1_main)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(2_addStocks)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(3_settings)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Navigator;
