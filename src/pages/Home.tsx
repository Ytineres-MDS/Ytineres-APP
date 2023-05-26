import React, { useState } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import Background from "../../assets/Background.png";

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.circle}>
        <TouchableOpacity style={[styles.button, styles.buttonTop]}>
          <Icon name="chevron-up" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonLeft]}
          onPress={() => navigation.navigate("Map")}
        >
          <Icon name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>
        <LinearGradient
          colors={["#ff3900", "#ff6700"]}
          style={styles.buttonCenter}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity>
            <Icon name="home" size={30} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity style={[styles.button, styles.buttonRight]}>
          <Icon name="chevron-right" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBottom]}>
          <Icon name="chevron-down" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.modalButtonContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.modalButton}>
          <Icon name="question" size={30} color="#ff3900" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.centeredView}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Modal Title</Text>
              </View>
              <Text style={styles.modalText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#ff3900" }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  buttonTop: {
    top: 5,
  },
  buttonBottom: {
    bottom: 5,
  },
  buttonLeft: {
    left: 5,
  },
  buttonRight: {
    right: 5,
  },
  buttonCenter: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "justify",
  },
  modalButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  modalButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 60,
    height: 60,
    marginRight: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
