import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/Home';
import MapScreen from './pages/Map';
import { LocationProvider } from './providers/LocationContext';
import { enableLatestRenderer } from 'react-native-maps';
import LoadingScreen from './components/LoadingScreen';
import { Accuracy, LocationObject, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';

enableLatestRenderer();

const Stack = createStackNavigator();

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    const fetchLocation = async (): Promise<void> => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === 'granted') {
        await watchPositionAsync(
          {
            accuracy: Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (getLocation: LocationObject) => {
            setLocation(getLocation);
            console.log(getLocation);
            setIsLoading(false);
          }
        );
      }
    };

    fetchLocation();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <LocationProvider location={location}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerShown: false }}
            initialParams={{ drawerOpen: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
};

export default App;