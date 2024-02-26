import { useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [modeName, setModeName] = useState(null);
  const [modeCount, setModeCount] = useState(null);
  const [showCaution, setShowCaution] = useState(false);

  switch (gameState) {
    case "start":
      return (
        <StartScreen
          start={() =>
            modeCount ? setGameState("play") : setShowCaution(true)
          }
          setModeCount={setModeCount}
          setModeName={setModeName}
          showCaution={showCaution}
          setShowCaution={setShowCaution}
        />
      );
    case "play":
      return (
        <PlayScreen
          end={() => setGameState("start")}
          tileCount={modeCount}
          setModeCount={setModeCount}
          modeName={modeName}
          setModeName={setModeName}
        />
      );
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
