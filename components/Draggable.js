import React, { Component } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';

type Props = {};

type State = {
  pan: any,
};

export default class Draggable extends Component<Props, State> {
  state = {
    pan: new Animated.ValueXY(),
  };

  componentWillMount() {
    this._val = { x: 0, y: 0 };

    const { pan } = this.state;

    // adding a listener for the change
    pan.addListener(value => (this._val = value));

    // initialise PanResponder with moving handler
    this.panResponder = PanResponder.create({
      // true so that panResponder starts responding to touch events
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
    });
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, styles.circle]}
      />
    );
  }
}

const CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'skyblue',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
});
