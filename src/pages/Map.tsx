import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Animated,
  NativeModules,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Text,
} from 'react-native';
import { Button, FAB, Icon, Slider } from '@rneui/themed';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Stickman from '../../assets/icons/stickman.svg';
import { Colors } from '../constant/values';
import uuid from 'react-native-uuid';
import { StackNavigationProp } from '@react-navigation/stack';
import StackNavigatorParams from '../core/stack-navigator-params';
import { RouteProp } from '@react-navigation/native';
import { getDistance } from 'geolib';
import YtineresDial from '../components/YtineresDial';
import { LocationContext } from '../providers/LocationContext';
import AddDangerZone from '../../assets/icons/Add_Danger_Zone.svg';
import RemoveDangerZone from '../../assets/icons/Remove_Danger_Zone.svg';
import MarkerCircle from '../components/MarkerCircle';

type MapScreenProps = {
  navigation: StackNavigationProp<StackNavigatorParams, 'Map'>;
  route: RouteProp<StackNavigatorParams, 'Map'>;
};

type DangerZone = {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  radius: number;
};

const statusBarHeight = NativeModules.StatusBarManager.HEIGHT;
const mapAnimatedHeight =
  Dimensions.get('window').height -
  Dimensions.get('window').height / 6 -
  statusBarHeight;
const animatedInitialHeight =
  Dimensions.get('window').height / 6 - statusBarHeight - 100;
const animatedFinalHeight =
  Dimensions.get('window').height / 6 - statusBarHeight - 300;

const MapScreen: React.FC<MapScreenProps> = ({ navigation, route }) => {
  const { drawerOpen } = route.params;
  const { location } = useContext(LocationContext);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [isNewZoneValidated, setIsNewZoneValidated] = useState(false);
  const [tempZone, setTempZone] = useState<DangerZone | null>(null);
  const [tempZoneRadius, setTempZoneRadius] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const { StatusBarManager } = NativeModules;

  const animatedHeight = useState(new Animated.Value(animatedInitialHeight))[0];

  const mapHeight = useState(new Animated.Value(mapAnimatedHeight - 100))[0];

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      setIsOpen(true);
      if (!isOpen) handleAddTempZone();
    } else {
      setIsOpen(false);
    }
  }, [drawerOpen]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!isOpen && tempZone) {
      setTempZone(null);
    }

    Animated.timing(animatedHeight, {
      toValue: isOpen ? animatedFinalHeight : animatedInitialHeight,
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
        mapRef.current?.animateToRegion(
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

  const handleAddTempZone = (): void => {
    // Check if user is already in a zone
    const userInZone = dangerZones.some((zone) => {
      const distance = getDistance(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        { latitude: zone.latitude, longitude: zone.longitude }
      );
  
      return distance <= zone.radius;
    });
  
    // Only create a new zone if the user is not already in a zone
    if (!userInZone) {
      setTempZone({
        id: uuid.v4().toString(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: '',
        radius: 100,
      });
      setIsNewZoneValidated(false);
      setShowNotification(false);
    } else {
      setIsOpen(false);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  const toggleBottomSheet = (): void => {
    setIsOpen(!isOpen);
    if (!isOpen) handleAddTempZone();
  };

  const handleMarkerPress = (id: string): void => {
    setSelectedMarkerId(id);
  };

  const handleValidateZone = (): void => {
    if (tempZone) {
      setDangerZones((currentZones) => [
        ...currentZones,
        { ...tempZone, radius: tempZoneRadius },
      ]);
      setTempZone(null);
      toggleBottomSheet();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.PurpleGradientLight, Colors.PurpleGradientDark]}
          style={styles.topBar}
        >
          <Button
            icon={
              <Icon name="arrow-left" type="font-awesome-5" color="white" />
            }
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
        <Animated.View
          style={{
            height: Animated.add(
              mapHeight,
              new Animated.Value(-keyboardHeight)
            ),
          }}
        >
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ maxHeight: '100%', flex: 1 }}
            region={{
              latitude: location.coords.latitude || 47.478419,
              longitude: location.coords.longitude || -0.563166,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(event): void => {
              const coordinates = event.nativeEvent.coordinate;
              dangerZones.map((zone) => {
                const distance = getDistance(
                  {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                  },
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
            {dangerZones.map((zone) => (
              <MarkerCircle
                key={zone.id}
                latitude={zone.latitude}
                longitude={zone.longitude}
                radius={zone.radius}
                color="rgba(255, 0, 0, 0.5)"
                onPress={(): void => handleMarkerPress(zone.id)}
              />
            ))}
            {tempZone && (
              <MarkerCircle
                key={tempZone.id}
                latitude={tempZone.latitude}
                longitude={tempZone.longitude}
                radius={tempZoneRadius}
                color="rgba(0, 0, 255, 0.5)"
              />
            )}
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
          <YtineresDial />
          <FAB
            visible={location !== null}
            onPress={(): void => {
              mapRef.current?.animateToRegion(
                {
                  latitude: location.coords.latitude || 47.478419,
                  longitude: location.coords.longitude || -0.563166,
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
          {showNotification && (
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationText}>
      Vous êtes déjà dans une zone marquée !
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.View style={{ height: 300, width: '100%' }}>
          <LinearGradient
            colors={[Colors.PurpleGradientLight, Colors.PurpleGradientDark]}
            style={styles.linearGradient}
          >
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={toggleBottomSheet}
              >
                <AddDangerZone
                  width={70}
                  height={70}
                  color={isOpen ? '#ff6700' : '#eaeaea'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={handleValidateZone}
              >
                <RemoveDangerZone width={70} height={70} color="#eaeaea" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <TextInput
              style={styles.inputBox}
              placeholder="Enter something..."
              value={tempZone ? tempZone.name : ''}
              onChangeText={(text): void => {
                if (tempZone) setTempZone({ ...tempZone, name: text });
              }}
            />
            <View style={styles.row}>
              <Slider
                style={{ width: 200, height: 40, flex: 1 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#FF3900"
                maximumTrackTintColor="#000000"
                step={1}
                value={tempZoneRadius}
                onValueChange={setTempZoneRadius}
              />
            </View>
            <Button
              title="Validate"
              color="#FF3900"
              onPress={handleValidateZone}
            />
          </LinearGradient>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  iconContainer: {
    height: 100,
    width: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 50,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  inputBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'red', // or any other color
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  notificationText: {
    color: 'white', // or any other color
  },
});

export default MapScreen;
