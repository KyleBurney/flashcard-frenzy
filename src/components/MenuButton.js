import React, { Component } from 'react';
import { Linking, Modal, View, Share, StyleSheet, TouchableOpacity } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon } from 'react-native-elements'
import SettingsModal from './SettingsModal';
import * as StoreReview from 'expo-store-review';

export default class MenuButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      settingsVisible: false
    }
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  onShare = async () => {
    try {
      const result = await Share.share(
        { message: 'Flash Card Frenzy | A tool for creating text, image or audio flash cards to study and quiz yourself with: https://play.google.com/store/apps/details?id=com.kburn.flashcardfrenzy' },
        { dialogTitle: 'Flash Card Frenzy' }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  contact = async () => {
    const url = 'mailto:burneysmobileapps@gmail.com'
    try {
      const link = await Linking.openURL(url)
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <View>
        <Modal
          // style={styles.modal}
          animationType="slide"
          transparent={true}
          visible={this.state.settingsVisible}
        >
          <SettingsModal closeModal={() => {
            this.setState({ settingsVisible: false })
          }} />
        </Modal>

        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity
              onPress={this.showMenu}>
              <Icon name='menu' color="#2a84ff" />
            </TouchableOpacity>
          }
        >
          <MenuItem onPress={() => {
            this.props.navigation.navigate('Categories')
            this.hideMenu()
          }}>Home</MenuItem>
          <MenuItem onPress={() => {
            this.onShare()
            this.hideMenu()
          }}>Share App</MenuItem>
          <MenuItem onPress={() => {
            StoreReview.requestReview()
            this.hideMenu()
          }}>Rate App</MenuItem>
          <MenuItem onPress={() => {
            this.setState({ settingsVisible: true })
            this.hideMenu()
          }}>Settings</MenuItem>
          <MenuItem onPress={() => {
            this.contact()
            this.hideMenu()
          }}>Contact Us</MenuItem>
        </Menu>
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