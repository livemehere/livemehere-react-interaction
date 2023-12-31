import { createContext, ReactNode, useEffect, useRef } from "react";
import { AnimationContextProps } from "../types/provider";

export const AnimationContext = createContext<AnimationContextProps>({
  mouse: {
    x: 0,
    y: 0,
    isDown: false,
  },
  registeredCallbacks: [],
});

export function AnimationProvider({ children }: { children: ReactNode }) {
  const valueRef = useRef({
    mouse: { x: 0, y: 0, isDown: false },
    registeredCallbacks: [],
  });

  /* Global mouse position */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      valueRef.current.mouse.x = e.clientX;
      valueRef.current.mouse.y = e.clientY;
    };

    const mouseDown = () => {
      valueRef.current.mouse.isDown = true;
    };

    const mouseUp = () => {
      valueRef.current.mouse.isDown = false;
    };

    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("pointerdown", mouseDown);
    window.addEventListener("pointerup", mouseUp);

    return () => {
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("pointerdown", mouseDown);
      window.removeEventListener("pointerup", mouseUp);
    };
  }, []);

  /* Global requestAnimationFrame */
  useEffect(() => {
    let id: number;
    const onFrame = () => {
      valueRef.current.registeredCallbacks.forEach((cb: Function) => cb());
      id = requestAnimationFrame(onFrame);
    };
    id = requestAnimationFrame(onFrame);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AnimationContext.Provider value={valueRef.current}>
      {children}
    </AnimationContext.Provider>
  );
}
