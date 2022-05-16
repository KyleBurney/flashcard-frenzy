import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Image, ScrollView, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import * as actions from '../store/actions';
import CameraRollGallery from './CameraRollGallery';
import AudioPlayback from './AudioPlayback';
import Recorder from './Recorder';
import * as FileSystem from 'expo-file-system';

class FlashCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            side: "frontSide",
            editing: false,
            edited_frontSide: props.frontSide,
            edited_backSide: props.backSide,
            modalVisible: false,
            editCardModalVisible: false,
            imageModalVisible: false
        }
    }

    copyFlashCard = () => {
        if (this.state["edited_frontSide"].match(/file\:\/\/.*\.m4a/) || this.state["edited_frontSide"].match(/file\:\/\/.*\.caf/)
            || this.state["edited_backSide"].match(/file\:\/\/.*\.m4a/) || this.state["edited_backSide"].match(/file\:\/\/.*\.caf/)) {
            this.props.actions.copyAudioCard(this.props.category, {
                frontSide: this.state["edited_frontSide"],
                backSide: this.state["edited_backSide"]
            });
        } else {
            this.props.actions.addFlashCard(this.props.category, {
                frontSide: this.state["edited_frontSide"],
                backSide: this.state["edited_backSide"]
            });
        }
    }

    updateFlashCard = () => {
        this.props.actions.updateFlashCard(this.props.category, this.props.cardIndex, {
            frontSide: this.state.edited_frontSide,
            backSide: this.state.edited_backSide
        }, this.state.side)
        this.setState({ editing: false })
    }

    deleteFlashCard = () => {
        this.props.actions.deleteFlashCard(this.props.category, this.props.cardIndex)
        this.props.actions.updateHighScore(this.props.category, "timedChallenge", "")
        this.props.actions.updateHighScore(this.props.category, "typeTheAnswer", "")
        this.props.actions.updateHighScore(this.props.category, "matchCards", 0)
    }

    saveRecording = async (fileName) => {
        if ((this.state["edited_" + this.state.side].match(/file\:\/\/.*\.m4a/)
            || this.state["edited_" + this.state.side].match(/file\:\/\/.*\.caf/))
            && this.props[this.state.side] != this.state["edited_" + this.state.side]) {
            FileSystem.deleteAsync(this.state["edited_" + this.state.side], {}).then(() => {
                this.setState({ ["edited_" + this.state.side]: fileName })
            }).catch(err => {
                console.log("err", err)
            })
        } else {
            this.setState({ ["edited_" + this.state.side]: fileName })
        }
        this.setState({ ["edited_" + this.state.side]: fileName })
    }

    render() {
        return (
            <View>
                <Modal transparent={true}
                    visible={this.state.editCardModalVisible}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#00000080'
                    }}>
                        <View style={[this.styles[this.state.side + "Card"], {
                            width: "80%",
                            padding: 5
                        }]}>
                            <ScrollView style={{ flexGrow: 0 }}
                                keyboardShouldPersistTaps="handled">
                                <TouchableOpacity style={this.styles.iconButton} onPress={() => this.setState({ editCardModalVisible: false, ["edited_" + this.state.side]: this.props[this.state.side] })}>
                                    <Icon
                                        name='close'
                                        color={this.props.backSideColor == "#FF3A3A" && this.state.side == "backSide" ? "#FCD0D5" : "red"}
                                        size={34}
                                    />
                                </TouchableOpacity>

                                {
                                    this.state["edited_" + this.state.side].includes("file://") ?
                                        (this.state["edited_" + this.state.side].match(/file\:\/\/.*\.m4a/)
                                            || this.state["edited_" + this.state.side].match(/file\:\/\/.*\.caf/)) ?
                                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 400 }}>
                                                <AudioPlayback filename={this.state["edited_" + this.state.side]} size={60} />
                                            </View>
                                            :
                                            <View style={{ alignSelf: "stretch", flex: 1, height: 400 }}>
                                                <Image style={{ height: "100%", width: "100%" }} resizeMode="contain" source={{ uri: this.state["edited_" + this.state.side] }} />
                                            </View>
                                        :
                                        <TextInput
                                            editable
                                            multiline
                                            placeholder="Enter text here"
                                            placeholderTextColor={this.state.side == "frontSide" ? this.props.backSideColor : this.props.frontSideColor}
                                            maxLength={500}
                                            style={[this.styles[this.state.side + "Text"], { textAlign: "center", minHeight: 200 }]}
                                            onChangeText={text => this.setState({ ["edited_" + this.state.side]: text })}
                                            value={this.state["edited_" + this.state.side]}
                                        />
                                }

                                <View style={[this.styles.menuContainer]}>
                                    <TouchableOpacity style={[this.styles[this.state.side + "MenuButton"], { borderRightWidth: 0 }]} onPress={this.updateFlashCard}>
                                        <Text style={[{ textAlign: "center" }, this.styles[this.state.side + "MenuText"]]}>SAVE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[this.styles[this.state.side + "MenuButton"], { borderRightWidth: 0 }]} onPress={() => this.setState({ imageModalVisible: true })}>
                                        <Icon
                                            name='insert-photo'
                                            color={this.state.side == "frontSide" ? this.props.backSideColor : this.props.frontSideColor}
                                            size={34}
                                        />
                                    </TouchableOpacity>
                                    <View style={[this.styles[this.state.side + "MenuButton"], { borderRightWidth: 0 }]}>
                                        <Recorder saveRecording={(fileName) => this.saveRecording(fileName)} color={this.state.side == "frontSide" ? this.props.backSideColor : this.props.frontSideColor} />
                                    </View>
                                    <TouchableOpacity style={[this.styles[this.state.side + "MenuButton"]]} onPress={() => {
                                        var nextSide = this.state.side == "frontSide" ? "backSide" : "frontSide";
                                        this.setState({ ["edited_" + this.state.side]: this.props[this.state.side], side: nextSide })
                                    }}>
                                        <Text style={[{ textAlign: "center" }, this.styles[this.state.side + "MenuText"]]}>FLIP</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[this.styles[this.state.side + "MenuButton"], { borderRightWidth: 0, borderLeftWidth: 0 }]} onPress={() => { this.setState({ modalVisible: true }) }}>
                                        <Text style={[{ textAlign: "center" }, this.styles[this.state.side + "MenuText"]]}>DELETE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[this.styles[this.state.side + "MenuButton"]]} onPress={this.copyFlashCard}>
                                        <Text style={[{ textAlign: "center" }, this.styles[this.state.side + "MenuText"]]}>COPY</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal
                    style={this.styles.modal}
                    animationType="slide"
                    transparent={false}
                    visible={this.state.imageModalVisible}
                >
                    <CameraRollGallery saveImage={(fileName) => this.setState({ ["edited_" + this.state.side]: fileName, imageModalVisible: false })} />
                </Modal>

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
                            <ScrollView style={{ flexGrow: 0 }}
                                keyboardShouldPersistTaps="always">
                                <Text style={{ textAlign: "center", fontSize: 20 }}>Are you sure you want to delete this flash card?</Text>
                                <TouchableOpacity
                                    style={[this.styles.menuButton, { backgroundColor: "red", height: 50 }]}
                                    onPress={this.deleteFlashCard}>
                                    <Text style={{ textAlign: "center", color: "white" }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[this.styles.menuButton, { backgroundColor: "#2a84ff", height: 50 }]}
                                    onPress={() => {
                                        this.setState({ modalVisible: false });
                                    }}>
                                    <Text style={{ textAlign: "center", color: "white" }}>Cancel</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>


                <TouchableOpacity
                    style={[this.styles.card, this.styles[this.state.side + "Card"]]}
                    onPress={
                        () => {
                            var nextSide = this.state.side == "frontSide" ? "backSide" : "frontSide";
                            this.setState({ side: nextSide })
                        }
                    }
                    onLongPress={
                        () => {
                            this.setState({ editing: true, editCardModalVisible: true })
                        }
                    }
                >
                    {this.state["edited_" + this.state.side].includes("file://") ?
                        (this.state["edited_" + this.state.side].match(/file\:\/\/.*\.m4a/)
                            || this.state["edited_" + this.state.side].match(/file\:\/\/.*\.caf/)) ?
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <AudioPlayback filename={this.state["edited_" + this.state.side]} size={this.props.settings.numCardsPerRow == 3 ? 40 : this.props.settings.numCardsPerRow == 2 ? 60 : 80} />
                            </View>
                            :
                            <Image style={{ width: "100%", height: "100%" }} resizeMode="contain" source={{ uri: this.state["edited_" + this.state.side] }} />
                        : <Text
                            style={[this.styles[this.state.side + "Text"], { maxHeight: "100%", textAlign: "center" }]}
                        >
                            {this.state["edited_" + this.state.side]}
                        </Text>
                    }
                </TouchableOpacity>
            </View >
        );
    }
    styles = StyleSheet.create({
        card: {
            width: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").width / this.props.settings.numCardsPerRow) - 10 : (Dimensions.get("window").height / this.props.settings.numCardsPerRow) - 10,
            height: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").width / this.props.settings.numCardsPerRow) - 10 : (Dimensions.get("window").height / this.props.settings.numCardsPerRow) - 10,
            textAlign: "center",
            justifyContent: 'center',
            margin: 5
        },
        editCard: {
            textAlign: "center",
            justifyContent: 'center',
            margin: 5
        },
        frontSideCard: {
            backgroundColor: this.props.frontSideColor
        },
        backSideCard: {
            backgroundColor: this.props.backSideColor
        },
        textBox: {
            width: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").width) - 10 : (Dimensions.get("window").height) - 10,
            height: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").width) - 70 : (Dimensions.get("window").height) - 70,
            textAlign: "center"
        },
        frontSideText: {
            color: "black"
        },
        backSideText: {
            color: "white"
        },
        frontSideMenuText: {
            color: this.props.backSideColor
        },
        backSideMenuText: {
            color: this.props.frontSideColor
        },
        menuButton: {
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 15,
            borderRadius: 2,
            marginTop: 10,
            maxHeight: 50,
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center'
        },
        modal: {
            flex: 1,
            flexDirection: "column",
            borderRadius: 5,
            textAlign: "center",
            justifyContent: 'center',
            margin: 10,
        },
        menuContainer: {
            flex: 1,
            flexDirection: "row",
            flexWrap: 'wrap',
            maxHeight: 45
        },
        frontSideMenuButton: {
            borderWidth: 1,
            borderColor: this.props.backSideColor,
            paddingVertical: 20,
            flex: 1,
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: this.props.frontSideColor
        },
        backSideMenuButton: {
            borderWidth: 1,
            borderColor: this.props.frontSideColor,
            paddingVertical: 20,
            flex: 1,
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: this.props.backSideColor
        },
        iconButton: {
            position: "absolute",
            top: 5,
            right: 10,
            zIndex: 1
        }
    });
}



const mapStateToProps = state => {
    return {
        settings: state.storage.settings
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashCard);