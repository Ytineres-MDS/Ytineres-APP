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
import AddDangerZone from "../../assets/icons/Add_Danger_Zone.svg";
import RemoveDangerZone from "../../assets/icons/Remove_Danger_Zone.svg";
import { Colors } from "../constant/values";

const BottomSheet = ({ toggleBottomSheet, toggleMarkerValidate, setMarkerCircleSize, isOpen }) => {  
  return (
    <Animated.View style={{ height: "100%", width: "100%" }}>
      <LinearGradient
        colors={[Colors.PurpleGradientLight, Colors.PurpleGradientDark]}
        style={styles.linearGradient}
      >
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleBottomSheet}
          >
            <AddDangerZone width={70} height={70} color={isOpen ? "#ff6700" : "#eaeaea"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleBottomSheet}
          >
            <RemoveDangerZone width={70} height={70} color="#eaeaea" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <TextInput style={styles.inputBox} placeholder="Enter something..." />
        <View style={styles.row}>
          <Slider
            style={{ width: 200, height: 40, flex: 1 }}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#FF3900"
            maximumTrackTintColor="#000000"
            onValueChange={setMarkerCircleSize}
          />
        </View>
        <Button title="Validate" color="#FF3900" onPress={() => toggleMarkerValidate()} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 50,
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
