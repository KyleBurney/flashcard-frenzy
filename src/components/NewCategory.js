import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'

export default class NewCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedCategory: this.props.category
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    maxLength={250}
                    style={styles.textBox}
                    onChangeText={text => this.setState({ editedCategory: text })}
                    value={this.state.editedCategory}
                />
                <TouchableOpacity style={styles.iconButton} onPress={() => this.props.submitAction(this.state.editedCategory)}>
                    <Icon
                        name='check'
                        color="#00e14a"
                        size={34}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={this.props.cancelAction}>
                    <Icon
                        name='cancel'
                        color="red"
                        size={34}
                    />
                </TouchableOpacity>
            </View>
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
    textBox: {
        height: 40,
        flex: 1,
        marginLeft: 10,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: "white"
    },
    iconButton: {
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10
    }
});