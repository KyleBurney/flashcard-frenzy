import {
  ImageBackground
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as actions from '../store/actions';

class ImgBackground extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notepad: require('../../assets/notepad-background.png'),
      white: require('../../assets/white-background.png'),
      card: require('../../assets/card-background.png'),
      jazz: require('../../assets/jazz-background.png')
    }
  }

  render() {
    return (
      <ImageBackground resizeMode='cover' source={this.state[this.props.settings.background]} style={{ width: '100%', height: '100%' }}>
        {this.props.children}
      </ImageBackground>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(ImgBackground);