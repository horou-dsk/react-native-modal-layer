import React, { Component, useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  EasingFunction,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  TransformsStyle,
  View,
  ViewStyle,
} from 'react-native'
import ModalLayerAnimated from './ModalLayerAnimated'

export type ModalLayerRef = {
  preload: (component: React.ReactNode, callback?: () => void) => void
  show: (options: ModalLayerShowOptions) => Promise<void>
  hide: () => Promise<void>
  showEasing: EasingFunction
  hideEasing: EasingFunction | undefined
  showDuration: number
  hideDuration: number
  emitHide: () => void
  __isMounted: boolean
  isShow: boolean
}

export interface ModalLayerProps {
  shadePress: TouchableWithoutFeedbackProps['onPress']
  shade?: boolean
  zIndex?: number
  onRef: (ref: ModalLayerRef) => void
}

interface ReactComponent {
  component?: React.ReactNode
}

export interface ModalLayerShowOptions extends ReactComponent {
  boxStyle?: ViewStyle
  act?: (ani: Animated.Value) => TransformsStyle['transform']
}

const screenSize = Dimensions.get('window')

/* export default class ModalLayer extends React.Component<ModalLayerProps> {
  state = {
    isShow: false,
    showAnimated: new Animated.Value(0),
    transform: [],
    boxStyle: {},
    contentComponent: null,
  }

  isAction = false

  contentComponent: ModalLayerShowOptions['component']

  boxStyle: ViewStyle = {}

  transform: any = []

  showEasing: EasingFunction

  hideEasing: EasingFunction

  showDuration: number

  hideDuration: number

  mlc: ModalLayerController

  __isMounted = true

  private _subscriptions = []

  private keyboardIsShow = false

  private keyboardDidShowHandle = () => {
    this.keyboardIsShow = true
  }

  private keyboardDidHideHandle = () => {
    this.keyboardIsShow = false
  }

  componentDidMount(): void {
    this._subscriptions = [
      Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandle),
      Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandle),
    ]
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach(subscription => {
      subscription.remove()
    })
    this.__isMounted = false
  }

  toggle(isShow) {
    return new Promise((resolve, reject) => {
      Animated.timing(this.state.showAnimated, {
        toValue: isShow ? 100 : 0,
        easing: isShow ? this.showEasing : this.hideEasing,
        useNativeDriver: true,
        duration: isShow ? this.showDuration : this.hideDuration,
      }).start(() => {
        resolve()
      })
    })
  }

  render() {
    const state = this.state
    const { shadePress, shade = true } = this.props
    const opacity = state.showAnimated.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
    })

    return (
      <View style={[styles.view, { left: state.isShow ? 0 : 9999 }]}>
        <View style={styles.container}>
          {shade ? (
            <TouchableWithoutFeedback
              onPress={shadePress || (() => (this.keyboardIsShow ? Keyboard.dismiss() : this.mlc.hide()))}
            >
              <Animated.View style={[styles.fixedBg, { opacity: opacity }]} />
            </TouchableWithoutFeedback>
          ) : null}
          <Animated.View style={[styles.box, this.boxStyle, { transform: this.transform, opacity: opacity }]}>
            {this.contentComponent}
          </Animated.View>
        </View>
      </View>
    )
  }

  preload(component, callback?) {
    if (!this.contentComponent) {
      this.contentComponent = component
      this.setState({}, callback)
    }
  }

  show(options: ModalLayerShowOptions = { component: null, boxStyle: {}, act: ModalLayerAnimated.SCALE }) {
    this.contentComponent = options.component
    this.boxStyle = options.boxStyle
    this.transform = options.act(this.state.showAnimated)
    // this.setState({
    //   contentComponent: options.component,
    //   boxStyle: options.boxStyle,
    //   transform: ModalLayerAnimated.getAnimated(this.state.showAnimated, options.act)
    // });
    return new Promise((resolve, reject) => {
      this.setState(
        {
          isShow: true,
        },
        () => this.toggle(true).then(resolve),
      )
    })
  }

  hide() {
    return this.toggle(false).then(() => {
      this.setState({
        isShow: false,
      })
    })
    // return new Promise((resolve, reject) => {
    //
    // });
  }
} */

function ModalLayer(props: ModalLayerProps) {
  const [isShow, setIsShow] = useState(false)
  const [didHide, setDidHide] = useState(true)
  const [state, setState] = React.useState<{
    showAnimated: Animated.Value
    transform: TransformsStyle['transform']
    boxStyle: ViewStyle | undefined
    contentComponent: React.ReactNode
  }>({
    showAnimated: new Animated.Value(0),
    transform: [],
    boxStyle: {},
    contentComponent: null,
  })
  const keyboardIsShowRef = React.useRef(false)
  const callbackRef = React.useRef<{ fn: () => void; timeoutTimer: number }>()
  const { shadePress, shade = true, onRef } = props
  const opacity = state.showAnimated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  })

  const modalLayerRef = React.useRef<ModalLayerRef>({
    preload: (component: React.ReactNode, callback?: () => void) => {
      setState(state => ({
        ...state,
        contentComponent: component,
      }))
    },
    show: (
      options: ModalLayerShowOptions = {
        component: null,
        boxStyle: {},
        act: ModalLayerAnimated.SCALE,
      },
    ) => {
      setState(state => ({
        ...state,
        contentComponent: options.component,
        boxStyle: options.boxStyle,
        transform: options.act?.(state.showAnimated),
      }))
      return new Promise<void>((resolve, reject) => {
        callbackRef.current = {
          fn: resolve,
          timeoutTimer: setTimeout(() => {
            reject(new Error('ModalLayer show timeout'))
          }, 2000),
        }
        setDidHide(false)
        setIsShow(true)
      })
    },
    hide: () => {
      return new Promise<void>((resolve, reject) => {
        callbackRef.current = {
          fn: resolve,
          timeoutTimer: setTimeout(() => {
            reject(new Error('ModalLayer hide timeout'))
          }, 2000),
        }
        setIsShow(false)
      })
    },
    showEasing: Easing.linear,
    hideEasing: Easing.linear,
    showDuration: 300,
    hideDuration: 300,
    emitHide: () => {},
    __isMounted: false,
    isShow: false,
  })

  useEffect(() => {
    modalLayerRef.current.isShow = isShow
    if (callbackRef.current) {
      const temp = callbackRef.current
      callbackRef.current = undefined
      Animated.timing(state.showAnimated, {
        toValue: isShow ? 100 : 0,
        easing: isShow ? modalLayerRef.current.showEasing : modalLayerRef.current.hideEasing,
        useNativeDriver: true,
        duration: isShow ? modalLayerRef.current.showDuration : modalLayerRef.current.hideDuration,
      }).start(() => {
        setDidHide(!isShow)
        temp.fn()
        clearTimeout(temp.timeoutTimer)
      })
    }
  }, [isShow])

  useEffect(() => {
    modalLayerRef.current.__isMounted = true
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', () => {
        keyboardIsShowRef.current = true
      }),
      Keyboard.addListener('keyboardDidHide', () => {
        keyboardIsShowRef.current = false
      }),
    ]
    onRef(modalLayerRef.current)
    return () => {
      subscriptions.forEach(sub => sub.remove())
      modalLayerRef.current.__isMounted = false
    }
  }, [onRef, modalLayerRef])
  return (
    <View style={[styles.view, { left: isShow || !didHide ? 0 : 9999 }]}>
      <View style={styles.container}>
        {shade ? (
          <TouchableWithoutFeedback
            onPress={
              shadePress || (() => (keyboardIsShowRef.current ? Keyboard.dismiss() : modalLayerRef.current.emitHide()))
            }
          >
            <Animated.View style={[styles.fixedBg, { opacity: opacity }]} />
          </TouchableWithoutFeedback>
        ) : null}
        <Animated.View style={[styles.box, state.boxStyle, { transform: state.transform, opacity: opacity }]}>
          {state.contentComponent}
        </Animated.View>
      </View>
    </View>
  )
}

export default ModalLayer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // width: screenSize.width,
    // height: screenSize.height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#0000007a',
  },
  box: {
    // position: 'absolute'
  },
})
