import React, { Fragment } from 'react';
import { Circle, Marker } from 'react-native-maps';

type Props = {
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  onPress?(): void;
};

const MarkerCircle: React.FC<Props> = ({ latitude, longitude, radius, color, onPress }) => {
  return (
    <Fragment>
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        onPress={onPress}
        pinColor={color}
      />
      <Circle
        center={{
          latitude: latitude,
          longitude: longitude,
        }}
        radius={radius}
        fillColor={color}
      />
    </Fragment>
  );
};

export default React.memo(MarkerCircle);