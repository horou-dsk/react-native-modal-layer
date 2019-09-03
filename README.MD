# ModalLayer

## Install
`npm i react-native-modal-layer`

## ChangeLogs

[CHANGELOG.md](CHANGELOG.md)

## Documentation

### Quick Start

#### Example 1.
<img src="https://i.imgur.com/4NeDDrp.gif" />

```typescript jsx
import React, {Component, Fragment} from 'react';
import {
  Button,
  StatusBar, View, Text
} from 'react-native';
import {ModalLayerController, ModalLayerFactory, ModalLayers} from "react-native-modal-layer";

class Layer extends Component {
  render() {
    return (
      <View style={{width: 200, height: 200, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#fff'}}>
        <Text style={{fontSize: 30, color: '#000'}}>My Layer</Text>
      </View>
    );
  }
}

class Page1 extends Component {

  layer: ModalLayerController

  componentDidMount(): void {
    // create your page as a Pop-up layer
    this.layer = ModalLayerFactory.create({
      component: <Layer />
    })
  }

  componentWillUnmount(): void {
    // It is recommended to clear Pop-up layer here
    ModalLayerFactory.delete(this.layer) // or ModalLayerFactory.delete([this.layer])
  }

  render() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Button onPress={() => this.layer.show()} title={'Open Layer'} />
      </View>
    );
  }
}

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <ModalLayers>
        <Page1 />
      </ModalLayers>
    </Fragment>
  );
};

export default App;
```



#### Example 2.

More Options:

```typescript jsx
import React, {Component, Fragment} from 'react';
import {
  Button,
  StatusBar, View, Text, Easing
} from 'react-native';
import {ModalLayerAnimated, ModalLayerController, ModalLayerFactory, ModalLayers} from "react-native-modal-layer";

class Layer extends Component<{title: string}> {
  render() {
    return (
      <View style={{width: 200, height: 200, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#fff'}}>
        <Text style={{fontSize: 16, color: '#000'}}>{this.props.title}</Text>
        <Text style={{fontSize: 30, color: '#000'}}>My Layer</Text>
      </View>
    );
  }
}

class Page1 extends Component {

  layer: ModalLayerController

  componentDidMount(): void {
    this.layer = ModalLayerFactory.create({
      component: (title) => <Layer title={title} />,
      act: ModalLayerAnimated.TRANSLATE_Y,
      boxStyle: {position: 'absolute', bottom: 0},
      hideEasing: Easing.bezier(0.215, 0.61, 0.355, 1),
      showEasing: Easing.bezier(0.215, 0.61, 0.355, 1),
      key: 'MyLayer',
      zIndex: 9,
      shade: true
    })
  }

  componentWillUnmount(): void {
    // It is recommended to clear popovers here
    ModalLayerFactory.delete(this.layer) // or ModalLayerFactory.delete([this.layer])
  }

  render() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Button onPress={() => this.layer.show('Title01')} title={'Open Layer'} />
      </View>
    );
  }
}

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <ModalLayers>
        <Page1 />
      </ModalLayers>
    </Fragment>
  );
};

export default App;
```

<img src="https://i.imgur.com/qDY0qpX.gif" />

*You can also write the configuration to the Layer class.*

for example: 

```typescript jsx
class Layer extends Component<{title: string}> {
  
  static modalLayerOptions: CreateModalOptions = {
    act: ModalLayerAnimated.TRANSLATE_Y,
    boxStyle: {position: 'absolute', bottom: 0},
    hideEasing: Easing.bezier(0.215, 0.61, 0.355, 1),
    showEasing: Easing.bezier(0.215, 0.61, 0.355, 1),
    key: 'MyLayer',
    zIndex: 9,
    shade: true
  }
  
  render() {
    return (
      <View style={{width: 200, height: 200, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#fff'}}>
        <Text style={{fontSize: 16, color: '#000'}}>{this.props.title}</Text>
        <Text style={{fontSize: 30, color: '#000'}}>My Layer</Text>
      </View>
    );
  }
}

// create method change to
this.layer = ModalLayerFactory.create(Layer)

// show method change to
this.layer.show({title: 'Title02'})
```

