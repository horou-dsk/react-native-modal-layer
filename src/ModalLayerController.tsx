import {Easing, EasingFunction, GestureResponderEvent, ViewStyle} from 'react-native'
import React from 'react'
import ModalLayer, {ModalLayerShowOptions} from './ModalLayer'
import ModalLayerAnimated from './ModalLayerAnimated'
import {CreateModalOptions, ModalLayers} from './index'

export interface ModalControllerSetOptions {
  boxStyle?: ViewStyle
  act?: ModalLayerShowOptions['act']
  hideEasing?: EasingFunction
  showEasing?: EasingFunction
  showDuration?: number
  hideDuration?: number
  key?: string
  backHandle?: (event: GestureResponderEvent) => boolean
}

export interface ModalControllerOptions extends ModalControllerSetOptions {
  component: React.ComponentClass<any> | React.ReactElement | null | Function
}

export default class ModalLayerController {
  public modalLayerRef: ModalLayer

  constructor(public key: string, private options: ModalControllerOptions, private getModalLayers: () => ModalLayers) {
    this.createModalLayer(key, options)
  }

  private createModalLayer(key: string, options: CreateModalOptions, callback?: () => void) {
    const { zIndex = 0 } = options
    const modalLayer = (
      <ModalLayer
        key={key}
        zIndex={zIndex}
        ref={modalLayerRef => {
          if (modalLayerRef) {
            this.modalLayerRef = modalLayerRef
            modalLayerRef.mlc = this
          }
        }}
        shadePress={options.shadePress}
        shade={options.shade}
      />
    )
    this.getModalLayers().addModalLayer(modalLayer, callback)
  }

  private getComponent(...args) {
    const component = this.options.component
    /*const beforeRef = (content as any).ref;
    content = React.cloneElement(content as ReactElement<any>, {
      ref: ref => {
        if(ref) {
          if(ref.wrappedInstance) ref.wrappedInstance.layer = this; // modalLayerRef;
          else ref.layer = this; // modalLayerRef;
          if(beforeRef) beforeRef(ref);
        }
      }
    })*/
    return typeof component === 'function'
      ? (component as ((...args) => React.ComponentClass<any>) | ((...args) => React.ReactElement))(...args)
      : component
  }

  show(...args) {
    const modalLayerRef = this.modalLayerRef
    if (!modalLayerRef) return setTimeout(() => this.show(...args), 10)
    if (!modalLayerRef.__isMounted) return this.createModalLayer(this.key, this.options, () => this.show(...args))
    const {
      boxStyle,
      act = ModalLayerAnimated.SCALE,
      hideEasing,
      showEasing = Easing.elastic(1),
      showDuration = 400,
      hideDuration = 200,
    } = this.options
    modalLayerRef.hideEasing = hideEasing
    modalLayerRef.showEasing = showEasing
    modalLayerRef.showDuration = showDuration
    modalLayerRef.hideDuration = hideDuration
    modalLayerRef
      .show({
        component: this.getComponent(...args),
        boxStyle,
        act,
      })
      .then(() => this.didShow())
    this.onShow()
  }

  public preload(...args) {
    if (this.modalLayerRef) this.modalLayerRef.preload(this.getComponent(...args), () => this.onLoad())
    else setTimeout(() => this.preload(...args), 10)
  }

  public setOptions(options: ModalControllerSetOptions) {
    this.options = { ...this.options, ...options }
  }

  public hide() {
    this.onHide()
    if (this.modalLayerRef.__isMounted) this.modalLayerRef.hide().then(() => this.didHide())
  }

  public backHandle(e) {
    const { backHandle } = this.options
    if (!(backHandle && backHandle(e))) {
      this.hide()
    }
  }

  didHide: ((this: ModalLayerController) => void) | null = () => {}

  didShow: ((this: ModalLayerController) => void) | null = () => {}

  onShow: ((this: ModalLayerController) => void) | null = () => {}

  onHide: ((this: ModalLayerController) => void) | null = () => {}

  onLoad: ((this: ModalLayerController) => void) | null = () => {}
}
