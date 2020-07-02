import ModalLayers from './ModalLayers'
import ModalLayerController, { ModalControllerSetOptions } from './ModalLayerController'
import ModalLayerFactory, { CreateOptions } from './ModalLayerFactory'
import ModalLayerAnimated from './ModalLayerAnimated'

interface CreateModalOptions extends ModalControllerSetOptions, CreateOptions {}

export { ModalLayerAnimated, ModalLayerController, ModalLayerFactory, ModalLayers, CreateModalOptions }
