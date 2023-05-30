import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { LocationObject, LocationSubscription } from 'expo-location';

interface LocationContextProps {
  location: Location.LocationObject | null;
}

export const LocationContext = createContext<LocationContextProps>({
  location: null,
});

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    let locationSubscription: LocationSubscription;

    (async (): Promise<void> => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // eslint-disable-next-line no-console
        console.error('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // update every 5 seconds
        },
        (newLocation) => {
          setLocation(newLocation);
          console.log(newLocation);
        }
      );
    })();

    // When the component is unmounted, cancel the location subscription
    return () => {
      locationSubscription?.remove();
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};
