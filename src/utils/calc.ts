import { AnimationMouse } from "../types/provider";

export function isHit(mouse: AnimationMouse, rect: DOMRect) {
  return (
    mouse.x >= rect.x &&
    mouse.x <= rect.x + rect.width &&
    mouse.y >= rect.y &&
    mouse.y <= rect.y + rect.height
  );
}
