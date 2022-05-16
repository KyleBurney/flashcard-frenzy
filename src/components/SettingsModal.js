import {
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as actions from '../store/actions';

class SettingsModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
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
          <ScrollView style={{ flexGrow: 0 }}>
            <TouchableOpacity style={styles.iconButton} onPress={() => this.props.closeModal()}>
              <Icon
                name='close'
                color="red"
                size={34}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "custom-header-font" }}>Settings</Text>
            <View style={styles.container}>
              <ScrollView
                contentContainerStyle={{ flexDirection: 'column', justifyContent: 'space-around' }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>Flash Card Color</Text>
                <View style={styles.colorMenuContainer}>
                  <TouchableOpacity style={{ height: 60, width: 60, marginHorizontal: 5 }} onPress={() => this.props.actions.updateCardColor("#d3e6ff", "#005c96")}>
                    <View style={{ backgroundColor: "#d3e6ff", position: "absolute", top: 0, left: 0, height: 45, width: 45 }}></View>
                    <View style={{ backgroundColor: "#005c96", position: "absolute", bottom: 0, right: 0, height: 45, width: 45 }}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ height: 60, width: 60, marginHorizontal: 5 }} onPress={() => this.props.actions.updateCardColor("#FCD0D5", "#FF3A3A")}>
                    <View style={{ backgroundColor: "#FCD0D5", position: "absolute", top: 0, left: 0, height: 45, width: 45 }}></View>
                    <View style={{ backgroundColor: "#FF3A3A", position: "absolute", bottom: 0, right: 0, height: 45, width: 45 }}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ height: 60, width: 60, marginHorizontal: 5 }} onPress={() => this.props.actions.updateCardColor("#A7FACB", "#04c824")}>
                    <View style={{ backgroundColor: "#A7FACB", position: "absolute", top: 0, left: 0, height: 45, width: 45 }}></View>
                    <View style={{ backgroundColor: "#04c824", position: "absolute", bottom: 0, right: 0, height: 45, width: 45 }}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ height: 60, width: 60, marginHorizontal: 5 }} onPress={() => this.props.actions.updateCardColor("#FAF6B3", "#A19604")}>
                    <View style={{ backgroundColor: "#FAF6B3", position: "absolute", top: 0, left: 0, height: 45, width: 45 }}></View>
                    <View style={{ backgroundColor: "#A19604", position: "absolute", bottom: 0, right: 0, height: 45, width: 45 }}></View>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10, textAlign: "center" }}>Flash Card Size</Text>
                <View style={styles.backgroundMenuContainer}>
                  <TouchableOpacity style={{ height: 30, width: 30, marginHorizontal: 10, borderWidth: 1 }} onPress={() => this.props.actions.updateNumCardsPerRow(3)} />
                  <TouchableOpacity style={{ height: 50, width: 50, marginHorizontal: 10, borderWidth: 1 }} onPress={() => this.props.actions.updateNumCardsPerRow(2)} />
                  <TouchableOpacity style={{ height: 70, width: 70, marginHorizontal: 10, borderWidth: 1 }} onPress={() => this.props.actions.updateNumCardsPerRow(1)} />
                </View>

                <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10, textAlign: "center" }}>Background</Text>
                <View style={styles.backgroundMenuContainer}>
                  <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1 }} onPress={() => this.props.actions.updateBackground("white")}>
                    <Image
                      style={{ width: 70, height: 120 }}
                      source={require('../../assets/white-background.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1 }} onPress={() => this.props.actions.updateBackground("notepad")}>
                    <Image
                      style={{ width: 70, height: 120 }}
                      source={require('../../assets/notepad-background.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1 }} onPress={() => this.props.actions.updateBackground("card")}>
                    <Image
                      style={{ width: 70, height: 120 }}
                      source={require('../../assets/card-background.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1 }} onPress={() => this.props.actions.updateBackground("jazz")}>
                    <Image
                      style={{ width: 70, height: 120 }}
                      source={require('../../assets/jazz-background.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>

            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: "scroll"
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#2a84ff",
    paddingHorizontal: 15,
    marginTop: 10,
    height: 50,
    width: "100%"
  },
  iconButton: {
    position: "absolute",
    top: 5,
    right: 10,
    zIndex: 1
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
  },
  text: {
    textAlign: "center",
    color: "white"
  },
  modal: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: 'center',
    margin: 10,
    backgroundColor: '#00000080'
  },
  colorMenuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  backgroundMenuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: "center",
    alignItems: "flex-end"
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);