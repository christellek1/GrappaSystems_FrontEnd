import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Book, Users } from 'lucide-react-native';

// Import screens
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import BookListingScreen from './BookListingScreen';
import BookDetailsScreen from './BookDetailsScreen';
import AuthorListingScreen from './AuthorListingScreen';
import AuthorDetailsScreen from './AuthorDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Book Stack
const BookStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BookListing" component={BookListingScreen} />
    <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
  </Stack.Navigator>
);

// Author Stack
const AuthorStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AuthorListing" component={AuthorListingScreen} />
    <Stack.Screen name="AuthorDetails" component={AuthorDetailsScreen} />
  </Stack.Navigator>
);

//Role-based Tab Navigators
const BooksAndAuthorsTab = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#0066cc',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="Books" 
      component={BookStack}
      options={{
        tabBarIcon: ({ color, size }) => <Book color={color} size={size} />,
      }}
    />
    <Tab.Screen 
      name="Authors" 
      component={AuthorStack}
      options={{
        tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
      }}
    />
  </Tab.Navigator>
);

const BooksOnlyTab = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#0066cc',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="Books" 
      component={BookStack}
      options={{
        tabBarIcon: ({ color, size }) => <Book color={color} size={size} />,
      }}
    />
  </Tab.Navigator>
);

const AuthorsOnlyTab = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#0066cc',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="Authors" 
      component={AuthorStack}
      options={{
        tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
      }}
    />
  </Tab.Navigator>
);

// Main App Navigation with Role-based Routing
const RoleBasedNavigation = ({ route }) => {
  const { userEmail } = route.params;

  // Determine which navigation to show based on user email
  if (userEmail === 'grappasystems3@gmail.com') {
    return <BooksAndAuthorsTab />;
  } else if (userEmail === 'grappasystems4@gmail.com') {
    return <AuthorsOnlyTab />;
  } else if (userEmail === 'grappasystems5@gmail.com') {
    return <BooksOnlyTab />;
  }
  
  // Fallback to books and authors (shouldn't reach here due to login validation)
  return <BooksAndAuthorsTab />;
};

// Main App Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="MainApp" 
          component={RoleBasedNavigation} 
          options={{ gestureEnabled: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}