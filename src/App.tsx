import DragAble from "./components/core/Dragable.tsx";
import Box from "./components/utilComp/Box.tsx";
import { AnimationProvider } from "./providers/AnimationProvider.tsx";
import { useState } from "react";

function App() {
  const [size, setSize] = useState(50);

  return (
    <AnimationProvider>
      <div className={"h-[200vh]"}>
        <div>
          <button onClick={() => setSize((prev) => prev + 10)}>UP</button>
        </div>
        <DragAble>
          <Box width={size} height={size} color={"tomato"} />
        </DragAble>
        <DragAble>
          <Box width={size} height={size} color={"tomato"} />
        </DragAble>
        <DragAble>
          <h1 className={"inline-block text-[100px]"}>hi</h1>
        </DragAble>
      </div>
    </AnimationProvider>
  );
}

export default App;
