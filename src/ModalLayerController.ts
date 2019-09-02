import {Easing, EasingFunction, GestureResponderEvent, ViewStyle} from "react-native";
import React, {ReactElement} from "react";
import ModalLayer, {ModalLayerShowOptions} from "./ModalLayer";
import ModalLayerAnimated from "./ModalLayerAnimated";

interface ModalControllerSetOptions {
  boxStyle?: ViewStyle,
  act?: ModalLayerShowOptions['act']
  hideEasing?: EasingFunction,
  showEasing?: EasingFunction,
  showDuration?: number;
  hideDuration?: number;
  key?: string;
  backHandle?: (event: GestureResponderEvent) => boolean;
}

export interface ModalControllerOptions extends ModalControllerSetOptions {
  component: React.ComponentClass<any> | React.ReactElement<any> | null | Function;
}

export default class ModalLayerController {

  public modalLayerRef: ModalLayer;

  constructor(public key: string,
              private options: ModalControllerOptions) {

  }

  show(...args) {
    const modalLayerRef = this.modalLayerRef;
    if (!modalLayerRef) return setTimeout(() => this.show(...args), 10);
    const {
      component, boxStyle, act = ModalLayerAnimated.SCALE, hideEasing, showEasing = Easing.elastic(1),
      showDuration = 400, hideDuration = 200
    } = this.options;
    modalLayerRef.hideEasing = hideEasing;
    modalLayerRef.showEasing = showEasing;
    modalLayerRef.showDuration = showDuration;
    modalLayerRef.hideDuration = hideDuration;
    let content = typeof component === 'function' ? ((component as ((...args) => React.ComponentClass<any>) | ((...args) => (React.ReactElement<any>)))(...args)) : component;
    const beforeRef = (content as any).ref;
    content = React.cloneElement(content as ReactElement<any>, {
      ref: ref => {
        if(ref) {
          if(ref.wrappedInstance) ref.wrappedInstance.layer = this; // modalLayerRef;
          else ref.layer = this; // modalLayerRef;
          if(beforeRef) beforeRef(ref);
        }
      }
    });
    modalLayerRef.show({
      component: content,
      boxStyle,
      act
    }).then(() => this.didShow());
    this.onShow();
  }

  public setOptions(options: ModalControllerSetOptions) {
    this.options = {...this.options, ...options};
  }

  public hide() {
    this.onHide();
    this.modalLayerRef.hide().then(() => this.didHide());
  }

  public backHandle(e) {
    const {backHandle} = this.options;
    if (!(backHandle && backHandle(e))) {
      this.hide();
    }
  }

  didHide() {
  }

  didShow() {
  }

  onShow() {
  }

  onHide() {
  }
}
