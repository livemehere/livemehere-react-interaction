export interface AnimationContextProps {
  mouse: AnimationMouse;
  registeredCallbacks: Function[];
}

export interface AnimationMouse {
  x: number;
  y: number;
  isDown: boolean;
}
