import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "motion/react";
import Homepage from "./components/Homepage";
import { BackgroundVideoProvider } from "./context/BackgroundVideoContext";

function App() {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <BackgroundVideoProvider>
          <Homepage />
        </BackgroundVideoProvider>
      </MotionConfig>
    </HelmetProvider>
  );
}

export default App;
