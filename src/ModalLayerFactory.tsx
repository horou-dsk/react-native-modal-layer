import { TouchableWithoutFeedbackProps } from 'react-native'
import React, { Component } from 'react'
import ModalLayerController, { ModalControllerOptions } from './ModalLayerController'
import { ModalLayersRef } from './types'

export interface CreateOptions {
  shade?: boolean
  shadePress?: TouchableWithoutFeedbackProps['onPress']
  zIndex?: number
}

interface CreateModalOptions extends CreateOptions, ModalControllerOptions {}

export default class ModalLayerFactory {
  private static index = 0

  private static modalLayerControllers = new Set<ModalLayerController>()

  private static self: ModalLayersRef

  public static create(elem: CreateModalOptions | React.ElementType): ModalLayerController | null {
    if (!this.self) {
      console.error('ModalLayers not loaded')
      return null
    }
    let options: CreateModalOptions
    if ((elem as any).prototype instanceof Component || elem instanceof Function)
      options = {
        component: props => React.createElement(elem as any, props as any),
        ...(elem as any).modalLayerOptions,
      }
    else options = elem as CreateModalOptions
    const key = options.key || 'layer_' + this.index++
    const oldLayer = this.getLayer(key)
    if (oldLayer) return oldLayer
    const modalLayerController = new ModalLayerController(key, options, () => this.self)
    this.modalLayerControllers.add(modalLayerController)
    return modalLayerController
  }

  public static getLayer(key: string): ModalLayerController | null {
    let layer = null
    this.modalLayerControllers.forEach(ml => {
      if (ml.key === key) {
        layer = ml
      }
    })
    return layer
  }

  public static delete(mlc: ModalLayerController | ModalLayerController[]) {
    const self = this.self
    if (mlc) {
      if (Array.isArray(mlc)) {
        mlc.forEach(ad => this.delete(ad))
        return
      }
      this.modalLayerControllers.delete(mlc as ModalLayerController)
      self.removeModalLayer((mlc as ModalLayerController).key)
    } else {
      self.clear()
      this.modalLayerControllers.clear()
    }
  }

  public static hideAll() {
    this.forEach(mlc => {
      mlc.hide()
    })
  }

  public static forEach(func: (value: ModalLayerController) => void) {
    this.modalLayerControllers.forEach(func)
  }

  public static back() {
    let mdr: ModalLayerController | undefined
    this.forEach(mlc => {
      if (mlc.modalLayerRef?.isShow) {
        mdr = mlc
      }
    })
    if (mdr) {
      mdr.backHandle()
      return true
    } else return false
  }

  public static setModalLayersRef(mlsRef: ModalLayersRef) {
    this.self = mlsRef
  }

  public static setElevation(elevation: number) {
    this.self.setElevation(elevation)
  }
}
