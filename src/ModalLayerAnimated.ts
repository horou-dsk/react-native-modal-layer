import { Animated, Dimensions } from 'react-native'

const screenSize = Dimensions.get('window')

export default class ModalLayerAnimated {
  static SCALE = ani => [
    {
      scale: ani.interpolate({
        inputRange: [0, 100],
        outputRange: [0.5, 1],
      }),
    },
  ]

  static TRANSLATE_Y = ani => [
    {
      translateY: ani.interpolate({
        inputRange: [0, 100],
        outputRange: [screenSize.height / 2, 0],
      }),
    },
  ]

  static TRANSLATE_Y_B = ani => [
    {
      translateY: ani.interpolate({
        inputRange: [0, 100],
        outputRange: [-150, 0],
      }),
    },
  ]

  static TRANSLATE_X = ani => [
    {
      translateX: ani.interpolate({
        inputRange: [0, 100],
        outputRange: [screenSize.height / 2, 0],
      }),
    },
  ]

  static TRANSLATE_X_B = ani => [
    {
      translateX: ani.interpolate({
        inputRange: [0, 100],
        outputRange: [-150, 0],
      }),
    },
  ]
}
