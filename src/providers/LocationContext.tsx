import React, { createContext } from 'react';
import { LocationObject } from 'expo-location';

type LocationContextType = {
  location: LocationObject | null;
};

export const LocationContext = createContext<LocationContextType>({
  location: null,
});

type LocationProviderProps = {
  location: LocationObject | null;
  children: React.ReactNode;
};

export const LocationProvider: React.FC<LocationProviderProps> = ({
  location,
  children,
}) => {
  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};
