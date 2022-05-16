import React, { Component } from 'react';
import { Image, View } from 'react-native';

export default class FlashCardImage extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={{ width: this.props.dimensions, height: this.props.dimensions, resizeMode: 'stretch'}}
                />
            </View>
        );
    }
}