import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import { Audio } from 'expo-av';
import * as actions from '../store/actions';

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false
        }
        this.recording = new Audio.Recording()
    }

    toggleRecorder = async () => {
        this.recording.getStatusAsync().then(async status => {
            if (status.isRecording) {
                var uri = this.recording.getURI()
                this.props.saveRecording(uri)
                await this.recording.stopAndUnloadAsync()
                this.recording = new Audio.Recording()
                this.setState({isRecording: false})

            } else {
                await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await this.recording.startAsync();
                this.setState({isRecording: true})
            }
        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        return (
            <TouchableOpacity style={{ justifyContent: "center" }} onPress={this.toggleRecorder}>
                <Icon
                    name={this.state.isRecording ? "stop" : "mic"}
                    color={this.state.isRecording ? "red" : this.props.color}
                    size={34}
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
});

const mapStateToProps = state => {
    return {
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);