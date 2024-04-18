import { ReactElement } from 'react'
import { ModalLayerProps } from './ModalLayer'

export type ModalLayersRef = {
  setElevation(elevation: number): void
  removeModalLayer(key: string): void
  addModalLayer(modalLayer: ReactElement<ModalLayerProps, any>, callback?: () => void): void
  clear(): void
}
