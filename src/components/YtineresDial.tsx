import { SpeedDial, Icon } from '@rneui/base';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import YtineresWhite from '../../assets/Ytineres_Logo_White.svg';
import CallPolice from '../../assets/icons/Call_Police.svg';
import ShareLocation from '../../assets/icons/Share_Location.svg';
import Alarm from '../../assets/icons/Alarm.svg';
import { Colors } from '../constant/values';

const YtineresDial: React.FC = () => {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  return (
    <SpeedDial
      isOpen={isSpeedDialOpen}
      icon={<YtineresWhite width={40} height={40} />}
      openIcon={<Icon name="times" type="font-awesome-5" color="#FFF" />}
      onOpen={(): void => setIsSpeedDialOpen(!isSpeedDialOpen)}
      onClose={(): void => setIsSpeedDialOpen(!isSpeedDialOpen)}
      style={styles.speedDial}
      ViewComponent={LinearGradient}
      linearGradientProps={{
        colors: isSpeedDialOpen
          ? [Colors.PurpleGradientLight, Colors.PurpleGradientDark]
          : [Colors.OrangeGradientLight, Colors.OrangeGradientDark],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
      }}
    >
      <SpeedDial.Action
        icon={<Alarm width={30} height={30} />}
        title="Menu 1"
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: [Colors.OrangeGradientLight, Colors.OrangeGradientDark],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        onPress={(): void => {
          /* Implement menu 1 functionality */
        }}
      />
      <SpeedDial.Action
        icon={<ShareLocation width={30} height={30} />}
        title="Menu 2"
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: [Colors.OrangeGradientLight, Colors.OrangeGradientDark],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        onPress={(): void => {
          /* Implement menu 2 functionality */
        }}
      />
      <SpeedDial.Action
        icon={<CallPolice width={30} height={30} />}
        title="Menu 3"
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: [Colors.OrangeGradientLight, Colors.OrangeGradientDark],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        onPress={(): void => {
          /* Implement menu 3 functionality */
        }}
      />
    </SpeedDial>
  );
};

const styles = StyleSheet.create({
  speedDial: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default YtineresDial;
