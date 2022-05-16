import {
  Image,
  Dimensions,
  View,
  ScrollView,
  CameraRoll,
  TouchableOpacity,
  Text
} from 'react-native';
import { Icon } from 'react-native-elements'
import React, { Component } from 'react';

export default class CameraRollGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photos: [],
      endCursors: []
    }
  }

  async componentDidMount() {
    this.getPhotos([undefined])
  }

  getPhotos = (endCursors) => {
    CameraRoll.getPhotos({
      first: 21,
      after: endCursors[endCursors.length - 1]
    })
      .then(r => {
        this.setState({ photos: r.edges, endCursors: endCursors.concat([r.page_info.end_cursor]) });
      })
      .catch((err) => {
        console.warn(err)
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}
          ref={(ref) => { this.scrollviewRef = ref; }}
        >
          <TouchableOpacity
            key="none"
            style={[styles.image, { borderWidth: 1 }]}
            // TODO: change to exit button strategy instead of NONE selection
            onPress={() => this.props.saveImage("")}>
            <Text style={{ textAlign: "center" }}>NONE</Text>
          </TouchableOpacity>
          {this.state.photos.map((p, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={styles.image}
                onPress={() => this.props.saveImage(p.node.image.uri)}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: p.node.image.uri }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}
              onPress={() => {
                if (this.state.endCursors.length <= 1) {
                  return
                }
                var newCursors = [...this.state.endCursors]
                newCursors.pop()
                newCursors.pop()
                this.getPhotos(newCursors)
                this.scrollviewRef.scrollTo({ x: 0, y: 0, animated: true })
              }}>
              <Icon
                name='chevron-left'
                color="#d3e6ff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPress={() => {
                var endCursors = [undefined]
                if (this.state.endCursors.length > 0) {
                  endCursors = [...this.state.endCursors]
                }
                this.getPhotos(endCursors)
                this.scrollviewRef.scrollTo({ x: 0, y: 0, animated: true })
              }}>
              <Icon
                name='chevron-right'
                color="#d3e6ff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: "column",
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: "scroll"
  },
  image: {
    height: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").width / 2) - 10 : (Dimensions.get("window").height / 2) - 10,
    width: Dimensions.get("window").width < Dimensions.get("window").height ? (Dimensions.get("window").width / 2) - 10 : (Dimensions.get("window").height / 2) - 10,
    textAlign: "center",
    justifyContent: 'center',
    margin: 5
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    maxHeight: 45,
    backgroundColor: "#005c96"
  },
  button: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    paddingVertical: 20,
  }
};