import React, { FunctionComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/Home';
import MapScreen from './pages/Map';
import { LocationProvider } from './providers/LocationContext';

const Stack = createStackNavigator();

const App: FunctionComponent = () => {
  return (
    <LocationProvider>
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