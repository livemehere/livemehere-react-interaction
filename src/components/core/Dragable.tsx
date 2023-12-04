import { cloneElement, ReactElement, useMemo, useRef } from "react";
import { getElementFromRef } from "../../utils/component.ts";
import { isHit } from "../../utils/calc.ts";
import useAnimationFrame from "../../hooks/useAnimationFrame.ts";
import useAnimation from "../../hooks";
import { UtilComponentRef } from "../../types/util-comp";

interface Props {
  children: ReactElement;
}

export default function DragAble({ children }: Props) {
  const childrenRef = useRef<UtilComponentRef | HTMLElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const { mouse } = useAnimation();
  const originRect = useRef<DOMRect | null>(null);

  useAnimationFrame(() => {
    const element = getElementFromRef(childrenRef);
    const rect = element.getBoundingClientRect(); // children must be rendered before this component

    if (mouse.isDown && isHit(mouse, element.getBoundingClientRect())) {
      pos.current.x = mouse.x - rect.width / 2 - originRect.current!.left;
      pos.current.y = mouse.y - rect.height / 2 - originRect.current!.top;
      element.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }
  }, []);

  const childrenComponent = useMemo(() => {
    return cloneElement(children as any, {
      ref: (el: UtilComponentRef | HTMLElement) => {
        if (!el) return;
        childrenRef.current = el;

        const element = getElementFromRef(childrenRef);
        const rect = element.getBoundingClientRect(); // children must be rendered before this component

        // Adjust the rect as if the element translated to 0,0
        originRect.current = {
          left: rect.left - pos.current.x,
          top: rect.top - pos.current.y,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
        } as DOMRect;
      },
      style: {
        ...children.props.style,
        userSelect: "none",
        touchAction: "none",
      },
      ...children.props,
    });
  }, [children.props]);

  return childrenComponent;
}
