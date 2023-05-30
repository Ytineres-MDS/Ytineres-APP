import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Animated,
  NativeModules,
} from 'react-native';
import { Button, FAB, Icon, SpeedDial } from '@rneui/themed';
import MapView, { UrlTile, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from '../components/BottomDrawer';
import YtineresWhite from '../../assets/Ytineres_Logo_White.svg';
import CallPolice from '../../assets/icons/Call_Police.svg';
import ShareLocation from '../../assets/icons/Share_Location.svg';
import Alarm from '../../assets/icons/Alarm.svg';
import Stickman from '../../assets/icons/stickman.svg';
import { Colors } from '../constant/values';
import { LocationContext } from '../providers/LocationContext';
import uuid from 'react-native-uuid';
import { StackNavigationProp } from '@react-navigation/stack';
import StackNavigatorParams from '../core/stack-navigator-params';
import { RouteProp } from '@react-navigation/native';
import { getDistance } from 'geolib';

type MapScreenProps = {
  navigation: StackNavigationProp<StackNavigatorParams, 'Map'>;
  route: RouteProp<StackNavigatorParams, 'Map'>;
};

const MapScreen: React.FC<MapScreenProps> = ({ navigation, route }) => {
  const { drawerOpen } = route.params;
  const { location } = useContext(LocationContext);

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isOpen, setIsOpen] = useState(drawerOpen);
  const [isCentered, setIsCentered] = useState(false);
  const [dangerZones, setDangerZones] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRadius, setNewZoneRadius] = useState(100);
  const [isNewZoneValidated, setIsNewZoneValidated] = useState(false);

  const { StatusBarManager } = NativeModules;

  const animatedHeight = useState(
    new Animated.Value(
      Dimensions.get('window').height / 6 - StatusBarManager.HEIGHT - 100
    )
  )[0];
  const mapHeight = useState(
    new Animated.Value(
      Dimensions.get('window').height -
        Dimensions.get('window').height / 6 -
        StatusBarManager.HEIGHT -
        100
    )
  )[0];

  const mapRef = useRef(null);
  

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen
        ? Dimensions.get('window').height / 6 - StatusBarManager.HEIGHT - 300
        : Dimensions.get('window').height / 6 - StatusBarManager.HEIGHT - 100,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(mapHeight, {
      toValue: isOpen
        ? Dimensions.get('window').height -
          Dimensions.get('window').height / 6 -
          StatusBarManager.HEIGHT -
          300
        : Dimensions.get('window').height -
          Dimensions.get('window').height / 6 -
          StatusBarManager.HEIGHT -
          100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isCentered && location) {
        mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );

        setIsCentered(true);
      }
    })();

    return () => {
      setIsCentered(false);
    };
  }, [location]);

  useEffect(() => {
    console.log(selectedMarkerId);
    
  }, [selectedMarkerId]);
  

  const handleAddDangerZone = (): void => {
    const newZone = {
      id: uuid.v4(),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      name: '',
      radius: 100,
    };

    setDangerZones((currentZones) => [...currentZones, newZone]);
    setIsNewZoneValidated(false);
  };

  const toggleBottomSheet = (): void => {
    setIsOpen(!isOpen);
    if (!isOpen) handleAddDangerZone();
    else if (!isNewZoneValidated) removeSelectedMarker();
  };

  const handleMarkerPress = (id: string): void => {
    setSelectedMarkerId(id);
  };

  const removeSelectedMarker = (): void => {
    if (selectedMarkerId) {
      setDangerZones((currentZones) => currentZones.filter((zone) => zone.id !== selectedMarkerId));
      setSelectedMarkerId(null);
    }
  };

  const toggleMarkerValidate = (): void => {
    setIsNewZoneValidated(true);
    setIsOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.PurpleGradientLight, Colors.PurpleGradientDark]}
        style={styles.topBar}
      >
        <Button
          icon={<Icon name="arrow-left" type="font-awesome-5" color="white" />}
          type="clear"
          onPress={(): void => navigation.goBack()}
        />
        <View style={styles.inputContainer}>
          <View style={styles.textbox}>
            <TextInput
              placeholder="Start"
              value={origin}
              onChangeText={setOrigin}
              style={styles.input}
            />
          </View>
          <View style={styles.textbox}>
            <TextInput
              placeholder="End"
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
            />
          </View>
        </View>
        <Button
          title="Search"
          onPress={(): void => {
            /* Implement search functionality */
          }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: [Colors.OrangeGradientLight, Colors.OrangeGradientDark],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
          }}
        />
      </LinearGradient>

      <Animated.View style={{ height: mapHeight }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          region={{
            latitude: location.coords.latitude ?? 47.478419,
            longitude: location.coords.longitude ?? -0.563166,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          onPress={(event): void => {
            const coordinates = event.nativeEvent.coordinate;
            dangerZones.map(zone => {
              const distance = getDistance(
                { latitude: coordinates.latitude, longitude: coordinates.longitude },
                { latitude: zone.latitude, longitude: zone.longitude }
              );
    
              if (distance <= zone.radius) {
                handleMarkerPress(zone.id);
              } else {
                handleMarkerPress(null);
              }
            });
          }}
        >
          <UrlTile
            urlTemplate={'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            maximumZ={19}
            flipY={false}
          />
          {dangerZones.map((zone) => (
            <>
              <Marker
                key={zone.id}
                coordinate={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                onPress={(): void => handleMarkerPress(zone.id)}
              />
              <Circle
                center={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                radius={zone.radius}
                fillColor={'rgba(255, 0, 0, 0.5)'}
              />
            </>
          ))}
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Ma position"
            >
              <Stickman width={60} height={60} />
            </Marker>
          )}
        </MapView>
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
        <FAB
          visible={location !== undefined}
          onPress={(): void => {
            mapRef.current.animateToRegion(
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
              1000
            );
          }}
          placement="left"
          icon={{ name: 'my-location', color: 'black' }}
          color="white"
        />
      </Animated.View>

      <Animated.View style={{ flex: animatedHeight }}>
        <BottomSheet
          toggleBottomSheet={toggleBottomSheet}
          toggleMarkerValidate={toggleMarkerValidate}
          isOpen={isOpen}
          newZoneName={newZoneName}
          setNewZoneName={setNewZoneName}
          newZoneRadius={newZoneRadius}
          setNewZoneRadius={setNewZoneRadius}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: Dimensions.get('window').height / 6,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    height: '60%',
  },
  textbox: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    marginVertical: 5,
  },
  input: {
    textAlign: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  speedDial: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default MapScreen;
