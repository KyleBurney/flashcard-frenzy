import React, { Component } from 'react';
import uuid from 'react-uuid'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dimensions, Modal, ImageBackground, ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import TimedChallengeCard from './TimedChallengeCard';
import MenuButton from './MenuButton';
import ImgBackground from './ImgBackground';
import { Header, Icon } from 'react-native-elements';
import { Stopwatch } from 'react-native-stopwatch-timer';

import * as actions from '../store/actions';

class TimedChallenge extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <View style={{ marginTop: 10 }}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => { navigation.navigate('FlashCards', { category: navigation.getParam('category') }) }}>
            <Icon
              name='arrow-back'
              color="#2a84ff"
            />
          </TouchableOpacity>}
        centerComponent={{ text: "Timed Challenge", style: { fontSize: 20, width: 300, textAlign: "center", paddingTop: 10, color: "#2a84ff", fontFamily: "custom-header-font" } }}
        rightComponent={<MenuButton navigation={navigation} />}
        backgroundColor="white"
      />
    </View>
  })

  constructor(props) {
    super(props)

    this.state = {
      cards: [],
      index: 0,
      side: "frontSide",
      stopwatchStart: false,
      stopwatchReset: false,
      startModalVisible: true,
      endModalVisible: false,
      currentTime: ""
    }
  }

  toggleStopwatch() {
    this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
  }

  resetStopwatch = () => {
    this.setState({ stopwatchStart: false, stopwatchReset: true });
  }

  getFormattedTime = (time) => {
    this.currentTime = time;
  }

  componentWillMount() { // TODO: not needed
    var shuffledCards = [...this.props.flashCards[this.props.navigation.getParam('category')].cards]
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    this.setState({ cards: shuffledCards });
  }

  shuffleCards = () => {
    var shuffledCards = [...this.state.cards]
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    this.setState({ cards: shuffledCards, index: 0 });
  }

  render() {
    return (
      <ImgBackground>
        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.startModalVisible}
        >
          <View style={styles.modal}>
            <TouchableOpacity
              style={[styles.sideSelectionPanel, { backgroundColor: "#d3e6ff", marginTop: 30 }]}
              onPress={() => {
                this.shuffleCards()
                this.toggleStopwatch()
                this.setState({ side: "frontSide", startModalVisible: false })
              }}>
              <Text style={{ textAlign: "center", color: "#005c96", fontFamily: "custom-header-font", fontSize: 20 }}>Front side first</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sideSelectionPanel, { backgroundColor: "#005c96", marginBottom: 30 }]}
              onPress={() => {
                this.shuffleCards()
                this.toggleStopwatch()
                this.setState({ side: "backSide", startModalVisible: false })
              }}>
              <Text style={{ textAlign: "center", color: "#d3e6ff", fontFamily: "custom-header-font", fontSize: 20 }}>Back side first</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal transparent={true}
          visible={this.state.endModalVisible}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000080'
          }}>
            <View style={{
              width: "80%",
              backgroundColor: '#fff',
              padding: 20
            }}>
              <ScrollView style={{ flexGrow: 0 }}>
                <Text style={{ textAlign: "center", fontFamily: "custom-header-font", fontSize: 20, marginBottom: 5 }}>Congratulations, you finished!</Text>
                <Text style={{ textAlign: "center" }}><Text style={{ fontWeight: 'bold' }}>Time:</Text> {this.state.currentTime}</Text>
                <Text style={{ textAlign: "center", marginBottom: 10 }}><Text style={{ fontWeight: 'bold' }}>Best Record:</Text> {this.props.flashCards[this.props.navigation.getParam('category')].quizzes.timedChallenge.highScore}</Text>
                <TouchableOpacity
                  style={[styles.menuButton, { height: 50 }]}
                  onPress={() => {
                    this.setState({ startModalVisible: true, endModalVisible: false })
                  }}>
                  <Text style={{ textAlign: "center", color: "white" }}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuButton, { height: 50 }]}
                  onPress={() => { this.props.navigation.navigate('FlashCards', { category: this.props.navigation.getParam('category') }) }}>
                  <Text style={{ textAlign: "center", color: "white" }}>Finish</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Stopwatch laps secs start={this.state.stopwatchStart}
          reset={this.state.stopwatchReset}
          options={options}
          getTime={this.getFormattedTime} />

        <View style={styles.cardContainer}>
          <TimedChallengeCard
            key={uuid()}
            flashCard={this.props.flashCards[this.props.navigation.getParam('category')].cards[this.state.index]}
            side={this.state.side}
          />
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={() => {
            if (this.state.index == this.state.cards.length - 1) {
              this.setState({ endModalVisible: true, currentTime: this.currentTime })
              this.resetStopwatch()
              var quizzes = this.props.flashCards[this.props.navigation.getParam('category')].quizzes
              if (quizzes.timedChallenge.highScore == "" || quizzes.timedChallenge.highScore > this.currentTime) {
                this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "timedChallenge", this.currentTime)
              }
              return;
            }
            this.setState({ index: this.state.index + 1 })
          }
          }>
            <Text style={{ textAlign: "center", color: "white" }}>Next</Text>
          </TouchableOpacity>
        </View>
      </ImgBackground>
    );
  }
}

const options = {
  container: {
    width: "100%"
  },
  text: {
    textAlign: "center"
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: "column"
  },
  cardContainer: {
    flex: 1,
    alignSelf: "stretch"
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    maxHeight: 50,
    marginVertical: 5
  },
  menuButton: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 5,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#2a84ff",
    maxHeight: 50,
  },
  card: {
    height: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").height / 2) - 10 : (Dimensions.get("window").width / 2) - 10,
    textAlign: "center",
    justifyContent: 'center',
    margin: 5
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
  },
  modal: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: 'center',
    margin: 10,
  },
  sideSelectionPanel: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 60,
    marginVertical: 10
  }
});

const mapStateToProps = state => {
  return {
    flashCards: state.storage.flashCards
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimedChallenge);