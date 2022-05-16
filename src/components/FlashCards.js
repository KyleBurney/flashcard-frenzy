import React, { Component } from 'react';
import uuid from 'react-uuid'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Image, Dimensions, Modal, KeyboardAvoidingView, ImageBackground, StyleSheet, View, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native';
import FlashCard from './FlashCard';
import MenuButton from './MenuButton';
import ImgBackground from './ImgBackground';
import { Header, Icon } from 'react-native-elements';
import * as actions from '../store/actions';
import CameraRollGallery from './CameraRollGallery';
import Recorder from './Recorder';
import AudioPlayback from './AudioPlayback';
import * as FileSystem from 'expo-file-system';

class FlashCards extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <View style={{ marginTop: 10 }}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => { navigation.navigate('Categories') }}>
            <Icon
              name='arrow-back'
              color="#2a84ff"
            />
          </TouchableOpacity>}
        centerComponent={{ text: navigation.getParam('category'), style: { fontSize: 20, width: 300, textAlign: "center", paddingTop: 10, color: "#2a84ff", fontFamily: "custom-header-font" } }}
        rightComponent={<MenuButton navigation={navigation} />}
        backgroundColor="white"
      />
    </View>
  })

  constructor(props) {
    super(props)

    this.state = {
      cards: props.flashCards[props.navigation.getParam('category')].cards,
      newCardFrontSide: "",
      newCardBackSide: "",
      quizSelectionModalVisible: false,
      newCardModalVisible: false,
      cantQuizModalVisible: false,
      cantQuizMessage: "",
      frontSideImageModalVisible: false,
      backSideImageModalVisible: false,
      imageString: ""
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

  addFlashCard = () => {
    this.props.actions.addFlashCard(this.props.navigation.getParam('category'), {
      frontSide: this.state.newCardFrontSide,
      backSide: this.state.newCardBackSide
    });
    this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "timedChallenge", "")
    this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "typeTheAnswer", "")
    this.props.actions.updateHighScore(this.props.navigation.getParam('category'), "matchCards", 0)
    this.setState({ newCardFrontSide: "", newCardBackSide: "" })
  }

  shuffle = () => {
    var shuffledCards = [...this.state.cards]
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    this.setState({ cards: shuffledCards });
  }

  saveRecording = async (cardName, fileName) => {
    if (this.state[cardName].match(/file\:\/\/.*\.m4a/)
      || this.state[cardName].match(/file\:\/\/.*\.caf/)) {
      await FileSystem.deleteAsync(this.state[cardName], {}).then(() => {
        console.log("deleted recording")
      }).catch(err => {
        console.log("err", err)
      })
    }

    this.setState({ [cardName]: fileName })
  }

  deleteRecording = async (cardName) => {
    if (this.state[cardName].match(/file\:\/\/.*\.m4a/)
      || this.state[cardName].match(/file\:\/\/.*\.caf/)) {
      await FileSystem.deleteAsync(this.state[cardName], {}).then(() => {
        console.log("deleted recording")
      }).catch(err => {
        console.log("err", err)
      })
    }

    this.setState({ [cardName]: "" })
  }

  render() {
    const { navigate } = this.props.navigation
    var category = this.props.navigation.getParam('category')
    return (
      <ImgBackground>
        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.frontSideImageModalVisible}
        >
          <CameraRollGallery saveImage={(fileName) => this.setState({ frontSideImageModalVisible: false, newCardModalVisible: true, newCardFrontSide: fileName })} />
        </Modal>

        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.backSideImageModalVisible}
        >
          <CameraRollGallery saveImage={(fileName) => this.setState({ backSideImageModalVisible: false, newCardModalVisible: true, newCardBackSide: fileName })} />
        </Modal>

        <Modal transparent={true}
          visible={this.state.newCardModalVisible}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000080'
          }}>

            <View style={{
              minWidth: "80%",
              backgroundColor: '#fff',
              padding: 20
            }}>
              <ScrollView style={{ flexGrow: 0 }}
                keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.iconButton} onPress={() => this.setState({ newCardModalVisible: false, newCardFrontSide: "", newCardBackSide: "" })}>
                  <Icon
                    name='close'
                    color="red"
                    size={34}
                  />
                </TouchableOpacity>
                <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "custom-header-font", marginTop: 5 }}>New Flash Card</Text>

                <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
                  {this.state.newCardFrontSide.includes("file://") ?
                    (this.state.newCardFrontSide.match(/file\:\/\/.*\.m4a/)
                      || this.state.newCardFrontSide.match(/file\:\/\/.*\.caf/)) ?
                      <View style={[styles.textBox, { alignItems: "center", justifyContent: "center" }]}>
                        <TouchableOpacity style={{ position: "absolute", left: 10, zIndex: 1 }} onPress={() => this.deleteRecording("newCardFrontSide")}>
                          <Icon
                            name='close'
                            color='red'
                            size={34}
                          />
                        </TouchableOpacity>
                        <AudioPlayback filename={this.state.newCardFrontSide} size={36} />
                      </View>
                      :
                      <View style={{ alignSelf: "stretch", flex: 1, height: 200 }}>
                        <TouchableOpacity style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }} onPress={() => this.setState({ newCardFrontSide: "" })}>
                          <Icon
                            name='close'
                            color='red'
                            size={34}
                          />
                        </TouchableOpacity>
                        <Image style={{ height: "100%", width: "100%" }} resizeMode="contain" source={{ uri: this.state.newCardFrontSide }} />
                      </View>
                    :
                    <TextInput
                      editable
                      multiline
                      placeholder="Front side of the card"
                      style={[styles.textBox, { marginTop: 10, marginBottom: 10, padding: 5 }]}
                      onChangeText={text => this.setState({ newCardFrontSide: text })}
                      value={this.state.newCardFrontSide}
                    />}
                  <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => this.setState({ frontSideImageModalVisible: true, newCardModalVisible: false })}>
                    <Icon
                      name='insert-photo'
                      color="grey"
                      size={50}
                    />
                  </TouchableOpacity>
                  <Recorder saveRecording={(fileName) => this.saveRecording("newCardFrontSide", fileName)} color="grey" />
                </View>

                <View style={{ flex: 1, flexDirection: "row" }}>
                  {this.state.newCardBackSide.includes("file://") ?
                    (this.state.newCardBackSide.match(/file\:\/\/.*\.m4a/)
                      || this.state.newCardBackSide.match(/file\:\/\/.*\.caf/)) ?
                      <View style={[styles.textBox, { alignItems: "center", justifyContent: "center" }]}>
                        <TouchableOpacity style={{ position: "absolute", left: 10, zIndex: 1 }} onPress={() => this.deleteRecording("newCardBackSide")}>
                          <Icon
                            name='close'
                            color='red'
                            size={34}
                          />
                        </TouchableOpacity>
                        <AudioPlayback filename={this.state.newCardBackSide} size={36} />
                      </View>
                      :
                      <View style={{ alignSelf: "stretch", flex: 1, height: 200 }}>
                        <TouchableOpacity style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }} onPress={() => this.setState({ newCardBackSide: "" })}>
                          <Icon
                            name='close'
                            color='red'
                            size={34}
                          />
                        </TouchableOpacity>
                        <Image style={{ height: "100%", width: "100%" }} resizeMode="contain" source={{ uri: this.state.newCardBackSide }} />
                      </View>
                    : <TextInput
                      editable
                      multiline
                      placeholder="Back side of the card"
                      style={[styles.textBox, { marginTop: 10, marginBottom: 10, padding: 5 }]}
                      onChangeText={text => this.setState({ newCardBackSide: text })}
                      value={this.state.newCardBackSide}
                    />
                  }
                  <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => this.setState({ backSideImageModalVisible: true, newCardModalVisible: false })}>
                    <Icon
                      name='insert-photo'
                      color="grey"
                      size={50}
                    />
                  </TouchableOpacity>
                  <Recorder saveRecording={(fileName) => this.saveRecording("newCardBackSide", fileName)} color="grey" />
                </View>

                <TouchableOpacity style={styles.modalMenuButton} onPress={this.addFlashCard}>
                  <Text style={styles.text}>
                    Add
                </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal transparent={true}
          visible={this.state.cantQuizModalVisible}>
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
                <Text style={{ textAlign: "center", fontSize: 20 }}>{this.state.cantQuizMessage}</Text>
                <TouchableOpacity style={[styles.cancelMenuButton, { minHeight: 50 }]} onPress={() => { this.setState({ cantQuizModalVisible: false, cantQuizMessage: "" }) }}>
                  <Text style={styles.text}>
                    Okay
                </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.quizSelectionModalVisible}
        >
          <View style={styles.modal}>
            <TouchableOpacity
              style={[styles.gameSelectionPanel, { backgroundColor: "#d3e6ff" }]}
              onPress={() => {
                navigate('TimedChallenge', { category: category })
                this.setState({ quizSelectionModalVisible: false })
              }}>
              <Text style={{ textAlign: "center", fontFamily: "custom-header-font", fontSize: 24 }}>Timed Challenge</Text>
              <Text style={{ textAlign: "center", width: "100%", paddingHorizontal: 10 }}>Time how long it takes for you to go through all of the flash cards for this category</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gameSelectionPanel, { backgroundColor: "#FCD0D5" }]}
              onPress={() => {
                navigate('MatchTheCards', { category: category })
                this.setState({ quizSelectionModalVisible: false })
              }
              }>
              <Text style={{ textAlign: "center", fontFamily: "custom-header-font", fontSize: 24 }}>Match the Cards</Text>
              <Text style={{ textAlign: "center", width: "100%", paddingHorizontal: 10 }}>Try to match the front side of cards to their back side in the fewest amount of tries</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gameSelectionPanel, { backgroundColor: "#A7FACB" }]}
              onPress={() => {
                if (this.state.cards.filter(card => { return !card.frontSide.includes("file://") && !card.backSide.includes("file://") }).length == 0) {
                  this.setState({ cantQuizModalVisible: true, cantQuizMessage: "You need at least one card that has text on both sides" })
                } else {
                  navigate('TypeTheAnswer', { category: category })
                  this.setState({ quizSelectionModalVisible: false })
                }
              }}>
              <Text style={{ textAlign: "center", fontFamily: "custom-header-font", fontSize: 24 }}>Type the Answer</Text>
              <Text style={{ textAlign: "center", width: "100%", paddingHorizontal: 10 }}>Type the reverse side of each card to see how many you have memorized</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelMenuButton}
              onPress={() => {
                this.setState({ quizSelectionModalVisible: false });
              }}>
              <Text style={{ textAlign: "center", color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.container}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={[styles.menuButton, { borderRightWidth: 0 }]} onPress={this.shuffle}>
              <Text style={{ textAlign: "center", color: "white" }}>Shuffle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => {
              if (this.state.cards.length == 0) {
                this.setState({ cantQuizModalVisible: true, cantQuizMessage: "You need at least one flash card to take a quiz" })
              } else {
                this.setState({ quizSelectionModalVisible: true })
              }
            }}>
              <Text style={{ textAlign: "center", color: "white" }}>Quiz</Text>

            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuButton, { borderLeftWidth: 0 }]} onPress={() => this.setState({ newCardModalVisible: true })}>
              <Text style={{ textAlign: "center", color: "white" }}>Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>Tap the cards to flip and hold to enlarge/edit</Text>

          <View style={styles.cardContainer}>
            <KeyboardAvoidingView style={styles.container} behavior={"padding"} keyboardVerticalOffset={180}>
              <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}
                keyboardShouldPersistTaps="handled">

                {/* {this.state.imageString == "" ? null : <Image style={{width: 100, height: 100}} source={{uri: this.state.imageString}}/>} */}

                {
                  this.state.cards.length != 0 ?
                    this.state.cards.map((card, i) => {
                      return <FlashCard
                        key={uuid()}
                        frontSide={card.frontSide}
                        backSide={card.backSide}
                        frontSideColor={this.props.settings.frontSideColor}
                        backSideColor={this.props.settings.backSideColor}
                        category={category}
                        cardIndex={i}
                        staticCard={false}
                      />
                    })
                    :
                    <View style={styles.welcomeMessage}>
                      <Text style={{ textAlign: "center", fontSize: 26 }}>This category has no flash cards!</Text>
                      <Text style={{ textAlign: "center" }}>Press the 'Add' button to create one</Text>
                    </View>
                }
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </ImgBackground>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    height: 100,
    width: 100
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "scroll"
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    maxHeight: 35
  },
  menuButton: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 5,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#2a84ff"
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: "scroll"
  },
  modal: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: 'center',
    margin: 10,
  },
  gameSelectionPanel: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    marginVertical: 10
  },
  gameSelectionButton: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 15,
    borderRadius: 2,
    backgroundColor: "#2a84ff",
    marginTop: 10,
    maxHeight: 30,
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
  },
  cancelMenuButton: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 15,
    borderRadius: 2,
    backgroundColor: "#2a84ff",
    marginTop: 10,
    maxHeight: 50,
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
  },
  welcomeMessage: {
    flex: 1,
    justifyContent: "center"
  },
  iconButton: {
    position: "absolute",
    top: 0,
    right: 10,
    zIndex: 1
  },
  textBox: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "stretch",
    flex: 1
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  modalMenuButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    backgroundColor: "#2a84ff",
    marginTop: 10,
    height: 50,
    minWidth: Dimensions.get("window").width < Dimensions.get("window").height ? "80%" : (Dimensions.get("window").height) - 10,
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  return {
    flashCards: state.storage.flashCards,
    settings: state.storage.settings
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashCards);