import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location";

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
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      while (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({})
        console.log(currentLocation);
      }

      setLocation(currentLocation);
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};
