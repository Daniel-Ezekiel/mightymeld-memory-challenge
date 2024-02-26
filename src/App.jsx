import { useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [modeName, setModeName] = useState(null);
  const [modeCount, setModeCount] = useState(null);

  switch (gameState) {
    case "start":
      return (
        <StartScreen
          start={() =>
            modeCount
              ? setGameState("play")
              : alert(
                  "Please choose a game mode between 'Easy', Medium' and 'Hard'"
                )
          }
          setModeCount={setModeCount}
          setModeName={setModeName}
        />
      );
    case "play":
      return (
        <PlayScreen
          end={() => setGameState("start")}
          tileCount={modeCount}
          modeName={modeName}
        />
      );
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
