import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

const BottomSheet = ({ toggleBottomSheet, animatedHeight}) => {

  return (
    <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
      <LinearGradient
        colors={["#7338ea", "#4926cb"]}
        style={styles.linearGradient}
      >
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleBottomSheet}
          >
            <Icon name="map" size={50} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <TextInput style={styles.inputBox} placeholder="Enter something..." />
        <View style={styles.row}>
          <Slider
            style={{ width: 200, height: 40, flex: 1 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FF3900"
            maximumTrackTintColor="#000000"
          />
        </View>
        <Button title="Validate" color="#FF3900" onPress={() => {}} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconContainer: {
    height: 100,
    width: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    justifyContent: "flex-start", // change here
    alignItems: "center",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  inputBox: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default BottomSheet;
