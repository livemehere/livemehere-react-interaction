import { useContext } from "react";
import { AnimationContext } from "../providers/AnimationProvider.tsx";

export default function useAnimation() {
  return useContext(AnimationContext);
}
