import { cloneElement, ReactElement, useEffect, useMemo, useRef } from "react";
import { getElementFromRef } from "../../utils/component.ts";
import { isHit, lerp } from "../../utils/calc.ts";
import useAnimationFrame from "../../hooks/useAnimationFrame.ts";
import useAnimation from "../../hooks";
import { UtilComponentRef } from "../../types/util-comp";

interface Props {
  children: ReactElement;
  pin?: {
    density: number; // 0~1
  };
}

export default function DragAble({ children, pin }: Props) {
  const childrenRef = useRef<UtilComponentRef | HTMLElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const { mouse } = useAnimation();
  const originRect = useRef<DOMRect | null>(null);
  const scrollRef = useRef({ x: 0, y: 0 });

  useAnimationFrame(() => {
    const element = getElementFromRef(childrenRef);
    const rect = element.getBoundingClientRect(); // children must be rendered before this component
    if (mouse.isDown && isHit(mouse, element.getBoundingClientRect())) {
      pos.current.x = mouse.x - rect.width / 2 - originRect.current!.left;
      pos.current.y = mouse.y - rect.height / 2 - originRect.current!.top;
      element.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }

    if (!mouse.isDown && pin?.density && pos.current.x > 0.001) {
      const targetX = 0;
      const targetY = 0;
      pos.current.x = lerp(pos.current.x, targetX, pin.density);
      pos.current.y = lerp(pos.current.y, targetY, pin.density);
      element.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }
  }, [pin?.density]);

  useEffect(() => {
    const scroll = () => {
      const deltaX = scrollRef.current.x - window.scrollX;
      const deltaY = scrollRef.current.y - window.scrollY;
      pos.current.x += deltaX;
      pos.current.y += deltaY;

      scrollRef.current.x = window.scrollX;
      scrollRef.current.y = window.scrollY;

      originRect.current = {
        ...originRect.current!,
        left: originRect.current!.left + deltaX,
        top: originRect.current!.top + deltaY,
      };
    };

    window.addEventListener("scroll", scroll);

    return () => {
      window.removeEventListener("scroll", scroll);
    };
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
