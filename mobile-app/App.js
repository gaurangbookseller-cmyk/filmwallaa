import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import NewsScreen from './src/screens/NewsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReviewDetailScreen from './src/screens/ReviewDetailScreen';
import SearchScreen from './src/screens/SearchScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reviews') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97316', // Orange color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#f97316',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Filmwalla.com',
          headerTitle: 'Filmwalla.com'
        }}
      />
      <Tab.Screen 
        name="Reviews" 
        component={ReviewsScreen}
        options={{
          title: 'Reviews',
          headerTitle: 'Movie Reviews'
        }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsScreen}
        options={{
          title: 'News',
          headerTitle: 'Cinema News'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitle: 'My Profile'
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          // Add custom fonts here if needed
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#f97316" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="ReviewDetail" 
            component={ReviewDetailScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#f97316' },
              headerTintColor: '#ffffff',
              headerTitle: 'Review Details'
            }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#f97316' },
              headerTintColor: '#ffffff',
              headerTitle: 'Search Movies'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}