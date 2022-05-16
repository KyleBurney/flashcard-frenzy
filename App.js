import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import React, { Component } from 'react';
import { PermissionsAndroid } from 'react-native';
import { persistor, store } from './src/store';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Updates } from 'expo';
import FlashCards from './src/components/FlashCards';
import Categories from './src/components/Categories';
import TimedChallenge from './src/components/TimedChallenge';
import TypeTheAnswer from './src/components/TypeTheAnswer';
import MatchTheCards from './src/components/MatchTheCards';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import ImageGuesser from './src/components/ImageGuesser';

const MainNavigator = createStackNavigator({
  Categories: { screen: Categories },
  FlashCards: { screen: FlashCards },
  TimedChallenge: { screen: TimedChallenge },
  TypeTheAnswer: { screen: TypeTheAnswer },
  MatchTheCards: { screen: MatchTheCards },
});

const Navigation = createAppContainer(MainNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    }
  }

  async componentWillMount() {
    try {      
      const granted = await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
        Permissions.AUDIO_RECORDING
      )
      Updates.checkForUpdateAsync().then((isAvailable, manifest) => {
        if (isAvailable) {
          Updates.fetchUpdateAsync()
        }
      }).catch(err => {
        console.warn(err)
      })
    } catch (err) {
      console.warn(err)
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'custom-header-font': require('./assets/fonts/GochiHand-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return this.state.fontLoaded ? (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ImageGuesser />
        </PersistGate>
      </Provider>
    ) : null;
  }
}