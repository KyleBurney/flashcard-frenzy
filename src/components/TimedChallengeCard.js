import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
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
      <TouchableOpacity
        onPress={() => {
          var nextSide = this.state.side == "frontSide" ? "backSide" : "frontSide";
          this.setState({ side: nextSide })
        }}
        style={[styles.card, styles[this.state.side + "Card"]]}>
        {
          this.props.flashCard[this.state.side].includes("file://") ?
            (this.props.flashCard[this.state.side].match(/file\:\/\/.*\.m4a/)
              || this.props.flashCard[this.state.side].match(/file\:\/\/.*\.caf/)) ?
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    // height: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").height / 2) - 10 : (Dimensions.get("window").width / 2) - 10,
    textAlign: "center",
    justifyContent: 'center',
    margin: 5,
    flex: 1,
    alignSelf: "stretch"
    // height: "100%"
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