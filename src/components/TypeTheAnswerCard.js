import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AudioPlayback from './AudioPlayback';

export default class TimedChallengeCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      side: props.side,
    }
  }

  render() {
    return (
      <View style={[styles.card, styles[this.state.side + "Card"]]}>
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          {
            this.props.showAnswer ?
              this.props.answerCorrect ?
                <Icon
                  name='check'
                  color="#00e14a"
                  size={32}
                />
                :
                <Icon
                  name='close'
                  color="red"
                  size={32}
                />
              :
              null
          }
        </View>
        {
          this.props.flashCard[this.state.side].includes("file://") ?
            (this.props.flashCard[this.state.side].match(/file\:\/\/.*\.m4a/)
              || this.props.flashCard[this.state.side].match(/file\:\/\/.*\.caf/)) ?
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                <AudioPlayback filename={this.props.flashCard[this.state.side]} size={60} />
              </View>
              :
              <Image style={{ height: "100%", width: "100%" }} resizeMode="contain" source={{ uri: this.props.flashCard[this.state.side] }} />
            :
            <Text
              style={[styles.text, styles[this.state.side + "Text"], { maxHeight: "100%" }]}>
              {this.props.flashCard[this.state.side]}
            </Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    // height: "100%",
    // height: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").height / 2) - 10 : (Dimensions.get("window").width / 2) - 10,
    textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    flex: 1,
    alignSelf: "stretch"
  },
  frontSideCard: {
    backgroundColor: "#d3e6ff"
  },
  backSideCard: {
    backgroundColor: "#158fdc"
  },
  text: {
    textAlign: "center"
  },
  frontSideText: {
    color: "black"
  },
  backSideText: {
    color: "white"
  }
});