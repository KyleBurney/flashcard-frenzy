import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Header } from 'react-native-elements';
import uuid from 'react-uuid';
import { connect } from 'react-redux';
import { ImageBackground, KeyboardAvoidingView, Modal, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Category from './Category';
import NewCategory from './NewCategory';
import FlashCardImage from './FlashCardImage';
import MenuButton from './MenuButton';
import ImgBackground from './ImgBackground';

import * as actions from '../store/actions';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      newCategory: "",
      modalVisible: false,
      invalidCategory: ""
    }
  }
  static navigationOptions = ({ navigation }) => ({
    header: <View style={{ marginTop: 20 }}><Header
      leftComponent={<FlashCardImage dimensions={30} />}
      centerComponent={{ text: 'FLASH CARD FRENZY', style: { color: '#2a84ff', fontSize: 26, width: 300, textAlign: "center", paddingTop: 10, fontFamily: "custom-header-font" } }}
      rightComponent={<MenuButton navigation={navigation} />}
      backgroundColor="white"
    /></View>
  })

  setCategory = (newCategory) => {
    if (this.props.categories.includes(newCategory)) {
      this.setState({ editing: false, invalidCategory: newCategory, modalVisible: true })
      return;
    }
    this.props.actions.setCategory(newCategory);
    this.setState({ editing: false })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImgBackground>
        <KeyboardAvoidingView style={styles.container} behavior={"padding"} keyboardVerticalOffset={90}>
          <View>
            <Text style={styles.text}>{this.props.categories.length == 0 ? "" : "My Categories"}</Text>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled">
            <Modal transparent={true}
              visible={this.state.modalVisible}>
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
                    <Text style={{ textAlign: "center", fontSize: 20 }}>The category '{this.state.invalidCategory}' already exists!</Text>

                    <TouchableOpacity
                      style={[styles.button, { height: 50 }]}
                      onPress={() => {
                        this.setState({ modalVisible: false, invalidCategory: "" });
                      }}>
                      <Text style={{ textAlign: "center", color: "white" }}>Okay</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {
              this.state.editing ?
                <NewCategory submitAction={this.setCategory} cancelAction={() => this.setState({ editing: false })} />
                :
                null
            }
            {
              this.props.categories.length > 0 ?
                this.props.categories.sort((a, b) => {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
                }).map((category, i) => {
                  return <Category
                    key={uuid()}
                    category={category}
                    clickHandler={() => navigate('FlashCards', { category: category })}
                    editing={false}
                  />
                })
                :
                this.state.editing == false ?
                  <View style={styles.welcomeMessage}>
                    <Text style={{ textAlign: "center", fontSize: 26 }}>Welcome to Flash Card Frenzy!</Text>
                    <Text style={{ textAlign: "center" }}>To get started, press the 'New Category' button</Text>
                  </View>
                  :
                  null
            }
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => this.setState({ editing: true })}>
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>New Category</Text>
          </TouchableOpacity>
        </View>
      </ImgBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
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
  text: {
    margin: 10,
    fontWeight: "bold"
  },
  welcomeMessage: {
    flex: 1,
    justifyContent: "center",
    height: 300
  },
  button: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#2a84ff",
    paddingHorizontal: 15,
    marginTop: 10,
    maxHeight: 50,
    width: "100%"
  }
});

const mapStateToProps = state => {
  return {
    categories: Object.keys(state.storage.flashCards),
    settings: state.storage.settings
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);