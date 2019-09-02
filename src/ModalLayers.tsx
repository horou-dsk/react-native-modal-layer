import React, {Component} from "react";
import {View} from "react-native";
import ModalLayerFactory from "./ModalLayerFactory";
import ModalLayer from "./ModalLayer";
import _ from "lodash";

export default class ModalLayers extends Component {

  state = {
    modalLayers: []
  }

  modalLayers: React.ReactElement<any>[] = []

  componentDidMount(): void {
    ModalLayerFactory.setModalLayersRef(this)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.children}
        <View pointerEvents={'box-none'} style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          {this.state.modalLayers}
        </View>
      </View>
    )
  }

  addModalLayer = (modalLayer: React.ReactElement<ModalLayer>) => {
    this.modalLayers.push(modalLayer);
    this.setState({
      modalLayers: this.modalLayers.sort((a, b) => {
        return a.props.zIndex - b.props.zIndex;
      })
    }/*, () => {
      console.log(this.state.modalLayers);
    }*/);
  };

  removeModalLayer = (key: string) => {
    if (_.isString(key)) {
      _(this.modalLayers).forEach((ad, index) => {
        if (ad.key === key) {
          this.modalLayers.splice(index, 1);
          return false;
        }
      });
      this.setState({
        modalLayers: this.modalLayers
      });
    }
  };

  componentWillUnmount() {
    console.log('清除！！！')
    // 不能设置为空，应为app退出时有的组件执行析构函数时会删除layer，如果设置为空，会导致获取不到删除函数
    // ModalLayerFactory.setModalLayersRef(null)
  }

}
