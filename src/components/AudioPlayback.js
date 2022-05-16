import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import { Audio } from 'expo-av';

class AudioPlayback extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.soundObject = new Audio.Sound()
    }

    componentWillUnmount() {
        this.soundObject.getStatusAsync().then(status => {
            if (status.isLoaded) {
                if (status.isPlaying) {
                    this.soundObject.stopAsync()
                }
            }
        }).catch(err => {
            console.log(err)
        })
    }

    componentWillReceiveProps() {
        this.soundObject.getStatusAsync().then(status => {
            if (status.isLoaded) {
                this.soundObject.unloadAsync()
            }
        }).catch(err => {
            console.log(err)
        })
    }

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    toggleAudioPlayback = async () => {
        this.soundObject.getStatusAsync().then(status => {
            if (status.isLoaded) {
                if (status.isPlaying) {
                    this.soundObject.stopAsync()
                } else {
                    this.soundObject.setPositionAsync(0).then(status => {
                        this.soundObject.playAsync()
                    })
                }
            } else {
                this.soundObject.loadAsync({ uri: this.props.filename }).then(status => {
                    this.soundObject.playAsync()
                }).catch(err => {
                    console.log(err)
                })
            }

        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={this.toggleAudioPlayback} style={[styles.container, { maxWidth: this.props.size, maxHeight: this.props.size }]}>
                <Icon
                    name='play-circle-filled'
                    color="white"
                    size={this.props.size}
                />
                <Text>{this.state.duration}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: "black"
    }
});

const mapStateToProps = state => {
    return {
    };
};

function mapDispatchToProps(dispatch) {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayback);