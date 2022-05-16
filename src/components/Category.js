import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import FlashCardImage from './FlashCardImage';
import NewCategory from './NewCategory';

import * as actions from '../store/actions';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: this.props.editing,
            modalVisible: false
        }
    }

    updateCategory = (newCategory) => {
        if (this.props.category != newCategory) {
            this.props.actions.updateCategory(this.props.category, newCategory)
        }
        this.setState({
            editing: false
        })
    }

    deleteCategory = () => {
        this.props.actions.deleteCategory(this.props.category)
    }

    render() {
        return (
            this.state.editing ?
                <NewCategory category={this.props.category} submitAction={this.updateCategory} cancelAction={() => this.setState({ editing: false })} />
                :
                <View style={[styles.container]}>

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
                                    <Text style={{ textAlign: "center", fontSize: 20 }}>Are you sure you want to delete the category '{this.props.category}'?</Text>
                                    <TouchableOpacity
                                        style={[styles.menuButton, { backgroundColor: "red", height: 50 }]}
                                        onPress={this.deleteCategory}>
                                        <Text style={{ textAlign: "center", color: "white" }}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.menuButton, { backgroundColor: "#2a84ff", height: 50 }]}
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
                        style={styles.container}
                        onPress={this.props.clickHandler}
                    >
                        <View style={{ margin: 5, marginLeft: 10 }}>
                            <FlashCardImage dimensions={25} />
                        </View>
                        <View>
                            <Text style={{ paddingRight: 30 }} numberOfLines={2}>{this.props.category}</Text>
                            <Text style={{ fontSize: 10 }}>{this.props.flashCards[this.props.category] ? this.props.flashCards[this.props.category].cards ? this.props.flashCards[this.props.category].cards.length : "0" : "0"} Cards</Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <View style={[styles.container, { marginTop: 5 }]}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => this.setState({ editing: true })}>
                                <Icon
                                    name='edit'
                                    color="#fdba5a"
                                    size={34}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => this.setState({ modalVisible: true })}>
                                <Icon
                                    name='delete'
                                    color="#757575"
                                    size={34}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        maxHeight: 50,
        marginBottom: 5
    },
    iconButton: {
        marginLeft: 10,
        marginRight: 10
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
    }
});

const mapStateToProps = state => {
    return {
        flashCards: state.storage.flashCards
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);