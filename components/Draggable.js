import React, { Component } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';

type Props = {};

type State = {
  pan: any,
};

export default class Draggable extends Component<Props, State> {
  state = {
    pan: new Animated.ValueXY(),
    showDraggable: true,
    dropAreaValues: null,
    opacity: new Animated.Value(1),
  };

  componentWillMount() {
    this._val = { x: 0, y: 0 };

    const { pan, opacity } = this.state;

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
        if (this.isDropArea(gesture)) {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
          }).start(() =>
            this.setState({
              showDraggable: false,
            })
          );
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
          }).start();
        }
      },
    });
  }

  // 200 is the height of the drop zone
  isDropArea = gesture => gesture.moveY < 200;

  render() {
    const { pan, opacity } = this.state;
    const panStyle = {
      transform: pan.getTranslateTransform(),
    };
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, styles.circle, { opacity }]}
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
