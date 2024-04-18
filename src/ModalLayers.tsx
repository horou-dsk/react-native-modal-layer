import React, { Component, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import ModalLayerFactory from './ModalLayerFactory'
import ModalLayer, { ModalLayerProps } from './ModalLayer'

function ModalLayers({ children }: React.PropsWithChildren<{}>) {
  const [modalLayers, setModalLayers] = useState<React.ReactElement<ModalLayerProps, any>[]>([])
  const [elevation, setElevation] = useState(99)
  const modalLayersMap = useRef(new Map<string, React.ReactElement<ModalLayerProps, any>>())
  const modalLayersRef = React.useRef({
    setElevation(elevation: number) {
      setElevation(elevation)
    },
    removeModalLayer(key: string) {
      if (typeof key === 'string') {
        modalLayersMap.current.delete(key)
        setModalLayers(Array.from(modalLayersMap.current.values()))
      }
    },
    addModalLayer(modalLayer: React.ReactElement<ModalLayerProps, any>, callback?: () => void) {
      modalLayersMap.current.set(modalLayer.key!, modalLayer)
      setModalLayers(
        Array.from(modalLayersMap.current.values()).sort((a, b) => {
          return a.props.zIndex! - b.props.zIndex!
        }),
      )
      // TODO: 回调时机有问题
      callback && callback()
    },
    clear() {
      modalLayersMap.current.clear()
      setModalLayers([])
    },
  })
  useEffect(() => {
    ModalLayerFactory.setModalLayersRef(modalLayersRef.current)
  }, [modalLayersRef])
  return (
    <View style={{ flex: 1 }}>
      {children}
      <View
        pointerEvents={'box-none'}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          elevation: elevation,
        }}
      >
        {modalLayers}
      </View>
    </View>
  )
}

export default ModalLayers
