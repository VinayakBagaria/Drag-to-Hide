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
      onPanResponderGrant: (e, gesture) => {
        pan.setOffset({
          x: this._val.x,
          y: this._val.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      // when touch is released, go back to original in a spring motion
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
        }).start();
      },
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
