import { useState } from "react";
import { Greet } from "../wailsjs/go/main/App";

function App() {
  const [testText, setTestText] = useState("");

  async function greet() {
    const result = await Greet("notdir");
    setTestText(result);
  }

  return (
    <div id="App">
      <p className="text-red-600">notdir</p>
      <button className="btn btn-primary" onClick={greet}>
        greet
      </button>
      <p>{testText}</p>
    </div>
  );
}

export default App;
