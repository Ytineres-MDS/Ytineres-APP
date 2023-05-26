import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Animated,
} from "react-native";
import { Button, SpeedDial, Icon } from "@rneui/themed";
import MapView, { UrlTile, Circle, MarkerAnimated } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import BottomDrawer from "../components/BottomDrawer";
import BottomSheet from "../components/BottomDrawer";

const MapScreen = ({ navigation }) => {
  const [value, setValue] = useState(100);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const initialHeight = Dimensions.get("window").height / 8;
  const finalHeight = Dimensions.get("window").height / 2;

  const animatedHeight = useState(new Animated.Value(initialHeight))[0];
  const mapHeight = useState(
    new Animated.Value(Dimensions.get("window").height - initialHeight)
  )[0];

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? finalHeight : initialHeight,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(mapHeight, {
      toValue: isOpen
        ? Dimensions.get("window").height - finalHeight
        : Dimensions.get("window").height - initialHeight,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const toggleBottomSheet = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7338ea", "#4926cb"]} style={styles.topBar}>
        <Button
          icon={<Icon name="arrow-left" type="font-awesome-5" color="white" />}
          type="clear"
          onPress={() => navigation.goBack()}
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
          onPress={() => {
            /* Implement search functionality */
          }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#ff3900", "#ff6700"],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
          }}
        />
      </LinearGradient>

      <Animated.View style={{ height: mapHeight }}>
        <MapView
          style={{ flex: 1 }} // change this line
          region={{
            latitude: 47.478419,
            longitude: -0.563166,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <UrlTile
            urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            maximumZ={19}
            flipY={false}
          />

          <Circle
            center={{
              latitude: 47.4608367,
              longitude: -0.5884357,
            }}
            radius={value}
            fillColor={"rgba(255, 0, 0, 0.5)"}
          />
          <MarkerAnimated
            coordinate={{
              latitude: 47.4608367,
              longitude: -0.5884357,
            }}
          />
        </MapView>
      </Animated.View>

      <BottomSheet
        toggleBottomSheet={toggleBottomSheet}
        animatedHeight={animatedHeight}
      />

      <SpeedDial
        isOpen={isSpeedDialOpen}
        icon={{ name: "menu", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
        onClose={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
        style={styles.speedDial}
      >
        <SpeedDial.Action
          icon={<Icon name="user" type="font-awesome-5" />}
          title="Menu 1"
          onPress={() => {
            /* Implement menu 1 functionality */
          }}
        />
        <SpeedDial.Action
          icon={<Icon name="heart" type="font-awesome-5" />}
          title="Menu 2"
          onPress={() => {
            /* Implement menu 2 functionality */
          }}
        />
        <SpeedDial.Action
          icon={<Icon name="envelope" type="font-awesome-5" />}
          title="Menu 3"
          onPress={() => {
            /* Implement menu 3 functionality */
          }}
        />
      </SpeedDial>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    height: Dimensions.get("window").height / 6,
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
    height: "60%",
  },
  textbox: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: "40%",
    width: "100%",
    justifyContent: "center", // center text vertically
    marginVertical: 5, // add some margin between the text boxes
  },
  input: {
    textAlign: "center", // center text horizontally
  },
  map: {
    width: Dimensions.get("window").width,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  speedDial: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default MapScreen;
