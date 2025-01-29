import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import Homepage from "./components/Homepage";

function App() {
  return (
    <HelmetProvider>
      <Homepage />
    </HelmetProvider>
  );
}

export default App;
