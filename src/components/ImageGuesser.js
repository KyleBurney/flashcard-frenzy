import React, { Component } from 'react';
import { Linking, Modal, View, Share, StyleSheet, TouchableOpacity } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon } from 'react-native-elements'
import SettingsModal from './SettingsModal';
import * as StoreReview from 'expo-store-review';

export default class ImageGuesser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      settingsVisible: false
    }
  }

  render() {
    return (
      <View>
        <Image
            style={{ width: "100%", height: "100%" }}
            source={{ uri: "./untitled1" }}
            resizeMode="contain"
          />
          <img src={"./untitled1.jpeg"} />
        <Button>ZOOM OUT</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: 'center',
    margin: 10,
  }
});