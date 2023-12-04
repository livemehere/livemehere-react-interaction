import { forwardRef, useImperativeHandle, useRef } from "react";
import { UtilComponentRef } from "../../types";

interface Props {
  width: number;
  height: number;
  color: string;
}

const Box = forwardRef<UtilComponentRef, Props>((props, ref) => {
  const { width, height, color } = props;
  const domRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    ...props,
    element: domRef.current!,
  }));
  return (
    <div
      ref={domRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        display: "inline-block",
      }}
    ></div>
  );
});
export default Box;
