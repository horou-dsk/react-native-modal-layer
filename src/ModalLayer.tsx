import React, {Component} from "react";
import {
  Animated, Dimensions,
  EasingFunction,
  Keyboard, StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps, TransformsStyle, View,
  ViewStyle
} from "react-native";
import ModalLayerAnimated from "./ModalLayerAnimated";
import ModalLayerController from "./ModalLayerController";
import ModalLayerFactory from "./ModalLayerFactory";

interface ModalLayerProps {
  shadePress: TouchableWithoutFeedbackProps['onPress'];
  shade?: boolean,
  zIndex?: number
}

interface ReactComponent {
  component: React.ComponentClass<any> | React.ReactElement<any> | null,
}

export interface ModalLayerShowOptions extends ReactComponent {
  boxStyle?: ViewStyle,
  act?: (ani: Animated.Value) => TransformsStyle['transform']
}

const screenSize = Dimensions.get('window')

export default class ModalLayer extends React.Component<ModalLayerProps> {

  state = {
    isShow: false,
    showAnimated: new Animated.Value(0),
    transform: [],
    boxStyle: {},
    contentComponent: null
  };

  isAction = false;

  contentComponent: ModalLayerShowOptions['component'];

  boxStyle: ViewStyle = {};

  transform: any = [];

  showEasing: EasingFunction;

  hideEasing: EasingFunction;

  showDuration: number;

  hideDuration: number;

  mlc: ModalLayerController;

  mlf: typeof ModalLayerFactory;

  private _subscriptions = [];

  private keyboardIsShow = false;

  private keyboardDidShowHandle = () => {
    this.keyboardIsShow = true;
  };

  private keyboardDidHideHandle = () => {
    this.keyboardIsShow = false;
  };

  componentDidMount(): void {
    this._subscriptions = [
      Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandle),
      Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandle)
    ];
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach(subscription => {
      subscription.remove();
    });
    this.mlf.delete(this.mlc);
  }

  toggle(isShow) {
    return new Promise((resolve, reject) => {
      Animated.timing(
        this.state.showAnimated,
        {
          toValue: isShow ? 100 : 0,
          easing: isShow ? this.showEasing : this.hideEasing,
          useNativeDriver: true,
          duration: isShow ? this.showDuration : this.hideDuration
        }
      ).start(() => {
        resolve();
      });
    });
  }

  render() {

    const state = this.state;
    const {
      shadePress,
      shade = true
    } = this.props;
    const opacity = state.showAnimated.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1]
    });

    return (
      <View style={[styles.view, {left: state.isShow ? 0 : screenSize.width}]}>
    <View style={styles.container}>
    {shade ? <TouchableWithoutFeedback onPress={shadePress || (() => this.keyboardIsShow ? Keyboard.dismiss() : this.mlc.hide())}>
    <Animated.View style={[styles.fixedBg, {opacity: opacity}]}>

    </Animated.View>
    </TouchableWithoutFeedback> : null}
    <Animated.View style={[styles.box, this.boxStyle, {transform: this.transform, opacity: opacity}]}>
    {this.contentComponent}
    </Animated.View>
    </View>
    </View>
  )
  }

  preload(component, callback?) {
    this.contentComponent = component
    this.setState({}, callback)
  }

  show(options: ModalLayerShowOptions = {component: null, boxStyle: {}, act: ModalLayerAnimated.SCALE}) {
    this.contentComponent = options.component;
    this.boxStyle = options.boxStyle;
    this.transform = options.act(this.state.showAnimated);
    // this.setState({
    //   contentComponent: options.component,
    //   boxStyle: options.boxStyle,
    //   transform: ModalLayerAnimated.getAnimated(this.state.showAnimated, options.act)
    // });
    return new Promise((resolve, reject) => {
      this.setState({
        isShow: true
      }, () => this.toggle(true).then(resolve));
    });
  }

  hide() {
    return this.toggle(false).then(() => {
      this.setState({
        isShow: false,
      });
    });
    // return new Promise((resolve, reject) => {
    //
    // });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // width: screenSize.width,
    // height: screenSize.height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    position: 'absolute',
    width: screenSize.width,
    // height: windowSize.height,
    top: 0,
    bottom: 0,
  },
  fixedBg: {
    position: 'absolute',
    width: screenSize.width,
    // height: windowSize.height,
    top: 0,
    bottom: 0,
    backgroundColor: '#0000007a'
  },
  box: {
    // position: 'absolute'
  }
});
