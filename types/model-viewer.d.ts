import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerJSX;
    }
  }
}

export interface ModelViewerElement extends HTMLElement {
  activateAR(): void;
  canActivateAR: boolean;
  dismissPoster(): void;
  showPoster(): void;
  cameraOrbit: string;
  cameraTarget: string;
  fieldOfView: string;
  resetTurntableRotation(): void;
  jumpCameraToGoal(): void;
}

export interface ModelViewerJSX extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  src?: string;
  poster?: string;
  alt?: string;
  ar?: boolean | string;
  'ar-modes'?: string;
  'ar-scale'?: string;
  'ar-placement'?: string;
  'camera-controls'?: boolean | string;
  'auto-rotate'?: boolean | string;
  'auto-rotate-delay'?: number | string;
  'rotation-per-second'?: string;
  'camera-orbit'?: string;
  'camera-target'?: string;
  'field-of-view'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  'min-field-of-view'?: string;
  'max-field-of-view'?: string;
  'shadow-intensity'?: number | string;
  'shadow-softness'?: number | string;
  'environment-image'?: string;
  exposure?: number | string;
  loading?: 'auto' | 'lazy' | 'eager';
  reveal?: 'auto' | 'interaction' | 'manual';
  'touch-action'?: string;
  'disable-zoom'?: boolean | string;
  'disable-pan'?: boolean | string;
  'disable-tap'?: boolean | string;
  seamless?: boolean;
}
