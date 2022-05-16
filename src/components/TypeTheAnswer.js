import React, { Component } from 'react';
import uuid from 'react-uuid'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextInput, KeyboardAvoidingView, Dimensions, Modal, ImageBackground, StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import TypeTheAnswerCard from './TypeTheAnswerCard';
import MenuButton from './MenuButton';
import ImgBackground from './ImgBackground';
import { Header, Icon } from 'react-native-elements';

import * as actions from '../store/actions';

class TypeTheAnswer extends Component {
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
        centerComponent={{ text: "Type The Answer", style: { fontSize: 20, width: 300, textAlign: "center", paddingTop: 10, color: "#2a84ff", fontFamily: "custom-header-font" } }}
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
      startModalVisible: true,
      endModalVisible: false,
      answer: "",
      score: 0,
      showAnswer: false,
      answerCorrect: false
    }
  }

  componentWillMount() { // TODO: not needed
    var shuffledCards = [...this.props.flashCards[this.props.navigation.getParam('category')].cards]
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    this.setState({ cards: shuffledCards });
  }

  shuffleCards = (shuffledCards) => {
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    this.setState({ cards: shuffledCards, index: 0 });
  }

  validateAnswer = () => { // TODO: reduce setstates
    var normalizedResponse = this.state.answer.toLowerCase().replace(/\s/g, '')
    var normalizedAnswer = this.state.cards[this.state.index][this.state.side == "frontSide" ? "backSide" : "frontSide"].toLowerCase().replace(/\s/g, '')

    var score = this.state.score;
    if (normalizedAnswer == normalizedResponse) {
      score++;
      this.setState({ score: score })
    }
    // TODO: where do I need to use state.cards vs this long thing
    var quizzes = this.props.flashCards[this.props.navigation.getParam('category')].quizzes
    if (quizzes.typeTheAnswer.highScore == "" || quizzes.typeTheAnswer.highScore < score) {
      this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "typeTheAnswer", score)
    }

    this.setState({ side: this.state.side == "frontSide" ? "backSide" : "frontSide", showAnswer: true, answerCorrect: normalizedAnswer == normalizedResponse })
  }

  nextCard = () => { // TODO: reduce setstates
    if (this.state.index == this.state.cards.length - 1) {
      this.setState({ endModalVisible: true, side: this.state.side == "frontSide" ? "backSide" : "frontSide", showAnswer: false, answer: "" })
      return;
    }
    this.setState({ side: this.state.side == "frontSide" ? "backSide" : "frontSide", index: this.state.index + 1, showAnswer: false, answer: "" })
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
                this.shuffleCards(this.state.cards.filter(card => {
                  return !card.backSide.includes("file://");
                }))
                this.setState({ side: "frontSide", startModalVisible: false })
              }}>
              <Text style={{ textAlign: "center", color: "#005c96", fontFamily: "custom-header-font", fontSize: 20 }}>Front side first</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sideSelectionPanel, { backgroundColor: "#005c96", marginBottom: 30 }]}
              onPress={() => {
                this.shuffleCards(this.state.cards.filter(card => {
                  return !card.frontSide.includes("file://");
                }))
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
                <Text style={{ textAlign: "center" }}><Text style={{ fontWeight: 'bold' }}>Score:</Text> {this.state.score}/{this.state.cards.length}</Text>
                <Text style={{ textAlign: "center", marginBottom: 10 }}><Text style={{ fontWeight: 'bold' }}>Best Record:</Text> {this.props.flashCards[this.props.navigation.getParam('category')].quizzes.typeTheAnswer.highScore}/{this.state.cards.length}</Text>
                <TouchableOpacity
                  style={[styles.menuButton, {height: 50}]}
                  onPress={() => {
                    this.setState({ startModalVisible: true, endModalVisible: false, score: 0 })
                  }}>
                  <Text style={{ textAlign: "center", color: "white" }}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuButton, {height: 50}]}
                  onPress={() => { this.props.navigation.navigate('FlashCards', { category: this.props.navigation.getParam('category') }) }}>
                  <Text style={{ textAlign: "center", color: "white" }}>Finish</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={styles.scrollViewContainer}>
          <View style={styles.scrollViewContainer}>
            <View style={styles.cardContainer}>
              <TypeTheAnswerCard
                key={uuid()}
                flashCard={this.state.cards[this.state.index]}
                side={this.state.side}
                answerCorrect={this.state.answerCorrect}
                showAnswer={this.state.showAnswer}
              />
            </View>

            <TextInput
              editable={!this.state.showAnswer}
              multiline
              numberOfLines={4}
              style={styles.textBox}
              placeholder="Type your answer here"
              onChangeText={text => this.setState({ answer: text })}
              value={this.state.answer}
            />

            {
              this.state.showAnswer ?
                <TouchableOpacity style={styles.menuButton} onPress={this.nextCard}>
                  <Text style={styles.text}>
                    Next
                  </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.menuButton} onPress={this.validateAnswer}>
                  <Text style={styles.text}>
                    Okay
                  </Text>
                </TouchableOpacity>
            }
          </View>
        </KeyboardAvoidingView>
      </ImgBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  cardContainer: {
    flex: 1,
    alignSelf: "stretch"
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
  },
  text: {
    textAlign: "center"
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
  },
  textBox: {
    textAlign: "center",
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: "white",
    margin: 5
  },
  text: {
    textAlign: "center",
    color: "white"
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: "column",
    overflow: "scroll",
    width: "100%"
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

export default connect(mapStateToProps, mapDispatchToProps)(TypeTheAnswer);