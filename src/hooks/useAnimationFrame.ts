import { useCallback, useEffect } from "react";
import useAnimation from "./index.ts";

/**
 * @param cb function to be called on each animation frame
 * @param deps dependencies for the callback (mostly not needed, most value used with reference)
 * @description this hook registers a callback to be called on each animation frame (only one requestAnimationFrame registered on window)
 */
export default function useAnimationFrame(cb: Function, deps: any[]) {
  const { registeredCallbacks } = useAnimation();
  const memoizedCallback = useCallback(cb, deps);
  useEffect(() => {
    registeredCallbacks.push(memoizedCallback);
    return () => {
      const index = registeredCallbacks.indexOf(memoizedCallback);
      registeredCallbacks.splice(index, 1);
    };
  }, [memoizedCallback]);
}
