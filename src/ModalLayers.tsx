import React, { Component } from 'react'
import { View } from 'react-native'
import ModalLayerFactory from './ModalLayerFactory'
import ModalLayer from './ModalLayer'

export default class ModalLayers extends Component {
  state = {
    modalLayers: [],
    elevation: 99,
  }

  modalLayers = new Map()

  constructor(props) {
    super(props)
    ModalLayerFactory.setModalLayersRef(this)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
        <View
          pointerEvents={'box-none'}
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            elevation: this.state.elevation,
          }}
        >
          {this.state.modalLayers}
        </View>
      </View>
    )
  }

  addModalLayer = (modalLayer: React.ReactElement<ModalLayer>, callback?: () => void) => {
    this.modalLayers.set(modalLayer.key, modalLayer)
    this.setState(
      {
        modalLayers: Array.from(this.modalLayers.values()).sort((a, b) => {
          return a.props.zIndex - b.props.zIndex
        }),
      },
      callback,
    )
  }

  removeModalLayer = (key: string) => {
    if (typeof key === 'string') {
      this.modalLayers.delete(key)
      this.setState({
        modalLayers: Array.from(this.modalLayers.values()),
      })
    }
  }

  setElevation(elevation: number) {
    this.setState({ elevation })
  }

  componentWillUnmount() {
    // console.log('清除！！！')
    // 不能设置为空，应为app退出时有的组件执行析构函数时会删除layer，如果设置为空，会导致获取不到删除函数
    // ModalLayerFactory.setModalLayersRef(null)
  }
}
