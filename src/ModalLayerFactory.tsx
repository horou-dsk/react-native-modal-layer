import {TouchableWithoutFeedbackProps} from "react-native";
import React, {Component} from "react";
import ModalLayer from "./ModalLayer";
import ModalLayerController, {ModalControllerOptions} from "./ModalLayerController";
import _ from "lodash";
import ModalLayers from "./ModalLayers";

export interface CreateModalOptions extends ModalControllerOptions {
  shade?: boolean,
  shadePress?: TouchableWithoutFeedbackProps['onPress'],
  zIndex?: number
}

export default class ModalLayerFactory extends React.Component<{ ss: any }> {

  private static index = 0;

  private static modalLayerControllers = new Set<ModalLayerController>();

  private static self: ModalLayers;

  public static create(elem: CreateModalOptions | React.ElementType): ModalLayerController {
    if(!this.self) {
      console.error("ModalLayers not loaded")
      return null
    }
    let options: CreateModalOptions;
    if((elem as any).prototype instanceof Component) options = {
      component: (props) => React.createElement(elem as any, props),
      ...(elem as any).modalLayerOptions
    };
    else
      options = elem as CreateModalOptions;
    const key = options.key || 'layer_' + (this.index++);
    const oldLayer = this.getLayer(key);
    if (oldLayer) return oldLayer;
    const modalLayerController = new ModalLayerController(key, options);
    const {zIndex = 0} = options;
    const modalLayer = <ModalLayer
      key={key}
      zIndex={zIndex}
      ref={modalLayerRef => {
        if (modalLayerRef) {
          modalLayerController.modalLayerRef = modalLayerRef;
          modalLayerRef.mlc = modalLayerController;
          modalLayerRef.mlf = this;
        }
      }}
      shadePress={options.shadePress} shade={options.shade}/>;
    this.self.addModalLayer(modalLayer);
    this.modalLayerControllers.add(modalLayerController);
    return modalLayerController;
  }

  public static getLayer(key: string): ModalLayerController {
    let layer = null;
    this.modalLayerControllers.forEach(ml => {
      if (ml.key === key) {
        layer = ml;
      }
    });
    return layer;
  }

  public static delete(mlc: ModalLayerController | ModalLayerController[]) {
    const self = this.self;
    if (mlc) {
      if (_.isArray(mlc)) {
        _(mlc).forEach((ad) => {
          this.delete(ad)
        });
        return;
      }
      this.modalLayerControllers.delete(mlc as ModalLayerController);
      self.removeModalLayer((mlc as ModalLayerController).key);
    } else {
      self.modalLayers = [];
      self.setState({
        modalLayers: []
      });
      this.modalLayerControllers.clear();
    }
  }

  public static hideAll() {
    this.forEach(mlc => {
      mlc.hide();
    })
  }

  public static forEach(func: (value: ModalLayerController) => void) {
    this.modalLayerControllers.forEach(func);
  }

  public static back() {
    let mdr;
    this.forEach(mlc => {
      if (mlc.modalLayerRef.state.isShow) {
        mdr = mlc;
      }
    });
    if (mdr) {
      mdr.backHandle();
      return true;
    } else return false;
  }

  public static setModalLayersRef(mlsRef: ModalLayers) {
    this.self = mlsRef
  }

}
