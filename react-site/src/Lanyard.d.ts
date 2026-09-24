import type { ComponentType } from 'react';

export type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  cardImage?: string | null;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
};

declare const Lanyard: ComponentType<LanyardProps>;
export default Lanyard;
