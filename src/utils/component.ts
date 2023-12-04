import { RefObject } from "react";
import { UtilComponentRef } from "../types/util-comp";

export function getElementFromRef(
  ref: RefObject<UtilComponentRef | HTMLElement>,
) {
  /* ref from AnimateComponent */
  if (isAnimateComponentRef(ref)) {
    return ref.current!.element;
  }
  /* ref from normal HTML element */
  return ref.current!;
}

export function isAnimateComponentRef(
  ref: RefObject<UtilComponentRef | HTMLElement>,
): ref is RefObject<UtilComponentRef> {
  return (ref.current as UtilComponentRef).element !== undefined;
}
