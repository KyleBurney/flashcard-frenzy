import React, { Component } from 'react';
import uuid from 'react-uuid'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, ImageBackground, StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import MatchTheCardsCard from './MatchTheCardsCard';
import MenuButton from './MenuButton';
import ImgBackground from './ImgBackground';
import { Header, Icon } from 'react-native-elements';

import * as actions from '../store/actions';

class MatchTheCards extends Component {
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
        centerComponent={{ text: "Match the Cards", style: { fontSize: 20, width: 300, textAlign: "center", paddingTop: 10, color: "#2a84ff", fontFamily: "custom-header-font" } }}
        rightComponent={<MenuButton navigation={navigation} />}
        backgroundColor="white"
      />
    </View>
  })

  constructor(props) {
    super(props)

    this.state = {
      cards: [],
      frontSideCards: props.flashCards[this.props.navigation.getParam('category')].cards.map((card, i) => { return { text: card.frontSide, index: i } }).sort((a, b) => 0.5 - Math.random()),
      backSideCards: props.flashCards[this.props.navigation.getParam('category')].cards.map((card, i) => { return { text: card.backSide, index: i } }).sort((a, b) => 0.5 - Math.random()),
      selectedFrontIndex: -1,
      selectedBackIndex: -1,
      endModalVisible: false
    }

    this.selectedFrontIndex = -1;
    this.selectedBackIndex = -1;
    this.numTries = 0;
  }

  setIndex = (side, index) => {
    if (side == "front") {
      this.props.actions.updateMtcFrontSideIndex(index)
    } else {
      this.props.actions.updateMtcBackSideIndex(index)
    }
  }

  render() {
    return (
      <ImgBackground>
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
                <Text style={{ textAlign: "center" }}><Text style={{ fontWeight: 'bold' }}>Number of tries:</Text> {this.numTries}</Text>
                <Text style={{ textAlign: "center", marginBottom: 10 }}><Text style={{ fontWeight: 'bold' }}>Best Record:</Text> {this.props.flashCards[this.props.navigation.getParam('category')].quizzes.matchCards.highScore}</Text>
                <TouchableOpacity
                  style={[styles.menuButton, { height: 50 }]}
                  onPress={() => {
                    this.setState({
                      frontSideCards: this.props.flashCards[this.props.navigation.getParam('category')].cards.map((card, i) => { return { text: card.frontSide, index: i } }).sort((a, b) => 0.5 - Math.random()),
                      backSideCards: this.props.flashCards[this.props.navigation.getParam('category')].cards.map((card, i) => { return { text: card.backSide, index: i } }).sort((a, b) => 0.5 - Math.random())
                    })
                    this.setState({ endModalVisible: false })
                    this.numTries = 0;
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

        <View style={{ flex: 1, flexDirection: "row" }}>
          <ScrollView style={{ flex: 1, flexDirection: "column", margin: 3 }}>
            {this.state.frontSideCards.map(card => {
              return <MatchTheCardsCard
                key={uuid()}
                text={card.text}
                index={card.index}
                side="front"
                clickHandler={() => {
                  if (card.index != -1 && this.selectedBackIndex != -1) {
                    this.numTries++
                  }
                  if (card.index == this.selectedBackIndex) {
                    if (this.state.frontSideCards.length == 1) {
                      var quizzes = this.props.flashCards[this.props.navigation.getParam('category')].quizzes
                      if (quizzes.matchCards.highScore == "" || quizzes.matchCards.highScore > this.numTries) {
                        this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "matchCards", this.numTries)
                      }
                      this.setIndex("front", -1)
                      this.setIndex("back", -1)
                      this.setState({ endModalVisible: true })
                      this.selectedBackIndex = -1
                      this.selectedFrontIndex = -1
                      return;
                    }
                    this.setIndex("front", -1)
                    this.setIndex("back", -1)
                    // TODO: set color instead of remove card to save lag
                    var currentIndex = card.index
                    this.setState({
                      frontSideCards: this.state.frontSideCards.filter(card => card.index != currentIndex),
                      backSideCards: this.state.backSideCards.filter(card => card.index != currentIndex)
                    })
                    this.selectedBackIndex = -1
                    this.selectedFrontIndex = -1
                    return;
                  }
                  this.setIndex("front", card.index)
                  this.selectedFrontIndex = card.index
                }}
              />
            })}
          </ScrollView>
          <ScrollView style={{ flex: 1, flexDirection: "column", margin: 3 }}>
            {this.state.backSideCards.map(card => {
              return <MatchTheCardsCard
                key={uuid()}
                text={card.text}
                index={card.index}
                side="back"
                clickHandler={() => {
                  if (this.selectedFrontIndex != -1 && card.index != -1) {
                    this.numTries++
                  }
                  if (card.index == this.selectedFrontIndex) {
                    if (this.state.backSideCards.length == 1) {
                      var quizzes = this.props.flashCards[this.props.navigation.getParam('category')].quizzes
                      if (quizzes.matchCards.highScore == "" || quizzes.matchCards.highScore > this.numTries) {
                        this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "matchCards", this.numTries)
                      }
                      this.setIndex("front", -1)
                      this.setIndex("back", -1)
                      this.setState({ endModalVisible: true })
                      this.selectedBackIndex = -1
                      this.selectedFrontIndex = -1
                      return;
                    }
                    var currentIndex = card.index
                    this.setIndex("front", -1)
                    this.setIndex("back", -1)
                    this.setState({
                      frontSideCards: this.state.frontSideCards.filter(card => card.index != currentIndex),
                      backSideCards: this.state.backSideCards.filter(card => card.index != currentIndex)
                    })
                    this.selectedBackIndex = -1
                    this.selectedFrontIndex = -1
                    return;
                  }
                  this.setIndex("back", card.index)
                  this.selectedBackIndex = card.index
                }}
              />
            })}
          </ScrollView>
        </View>
      </ImgBackground>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#d3e6ff",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 5,
    marginVertical: 3,
    minHeight: 100
  },
  modal: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: 'center',
    margin: 10,
  },
  menuButton: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 5,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#2a84ff",
    maxHeight: 40,
    marginHorizontal: 5
  }
});

const mapStateToProps = state => {
  return {
    flashCards: state.storage.flashCards,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchTheCards);