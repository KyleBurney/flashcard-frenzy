import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import AudioPlayback from './AudioPlayback';

import * as actions from '../store/actions';

class MatchTheCardsCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      side: props.side
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={[this.styles.card, { borderWidth: this.getBorderWidth() }]}
        onPress={this.props.clickHandler}>
        {
          this.props.text.includes("file://") ?
            (this.props.text.match(/file\:\/\/.*\.m4a/)
              || this.props.text.match(/file\:\/\/.*\.caf/)) ?
              <View style={{ paddingLeft: 10 }}>
                <AudioPlayback filename={this.props.text} size={42} />
              </View>
              :
              <Image style={{ height: "100%", width: "100%" }} resizeMode="contain" source={{ uri: this.props.text }} />
            :
            <Text style={this.styles.text} numberOfLines={15}>{this.props.text}</Text>
        }
      </TouchableOpacity>
    );
  }

  getBorderWidth = () => {
    if (this.props.side == "front") {
      if (this.props.matchTheCards.frontSideIndex == this.props.index) {
        return 3
      } else {
        return 0
      }
    } else {
      if (this.props.matchTheCards.backSideIndex == this.props.index) {
        return 3
      } else {
        return 0
      }
    }
  }

  styles = StyleSheet.create({
    card: {
      width: "100%",
      flex: 1,
      justifyContent: "center",
      paddingVertical: 5,
      marginVertical: 3,
      minHeight: 100,
      backgroundColor: this.props.side == "front" ? "#d3e6ff" : "#005c96"
    },
    text: {
      color: this.props.side == "front" ? "#005c96" : "#d3e6ff",
      textAlign: "center"
    }
  });
}

const mapStateToProps = state => {
  return {
    matchTheCards: state.ui.matchTheCards
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchTheCardsCard);