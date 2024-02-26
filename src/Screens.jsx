import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start, setModeCount, setModeName }) {
  return (
    <div className="min-h-[100dvh] w-screen p-8 grid place-items-center text-pink-500 text-center">
      <div
        className={
          "max-w-[21rem] h-[21rem] w-full pt-6 pb-12 flex flex-col justify-center items-center gap-5 bg-pink-50 rounded-lg"
        }
      >
        <h1 className="font-bold text-3xl">Memory</h1>

        <p>Flip over tiles looking for pairs</p>

        <div className="h-[4rem] px-6 mt-4 grid place-items-center grid-cols-3 gap-4">
          <button
            type="button"
            className="h-fit bg-pink-200 px-3 py-1 rounded-md flex flex-col items-center justify-center focus:border-2 focus:border-pink-500 active:scale-95 transition-transform ease-in-out duration-300 font-semibold"
            onClick={() => {
              setModeCount(8);
              setModeName("Easy");
            }}
          >
            Easy
            <span className="font-normal">8 Tiles</span>
          </button>
          <button
            type="button"
            className="bg-pink-200 px-3 py-1 rounded-md flex flex-col items-center justify-center focus:border-2 focus:border-pink-500 active:scale-95 transition-transform ease-in-out duration-300 font-semibold"
            onClick={() => {
              setModeCount(16);
              setModeName("Medium");
            }}
          >
            Medium
            <span className="font-normal">16 Tiles</span>
          </button>
          <button
            type="button"
            className="bg-pink-200 px-3 py-1 rounded-lg flex flex-col items-center justify-center focus:border-2 focus:border-pink-500 active:scale-95 transition-transform ease-in-out duration-300 font-semibold"
            onClick={() => {
              setModeCount(24);
              setModeName("Hard");
            }}
          >
            Hard
            <span className="font-normal">24 tiles</span>
          </button>
        </div>

        <button
          className="w-[8rem] py-2 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full text-lg text-white"
          onClick={start}
        >
          Play
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({
  end,
  tileCount,
  setModeCount,
  modeName,
  setModeName,
}) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const bestScore =
    modeName == "Easy"
      ? localStorage.getItem("easyBestScore")
      : modeName == "Medium"
      ? localStorage.getItem("mediumBestScore")
      : localStorage.getItem("hardBestScore");

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            // First game played, set best score.
            !bestScore &&
              localStorage.setItem(
                `${modeName.toLowerCase()}BestScore`,
                tryCount + 1
              );

            // Compare existing best score with current tries
            bestScore && Number(bestScore) > tryCount
              ? localStorage.setItem(
                  `${modeName.toLowerCase()}BestScore`,
                  tryCount + 1
                )
              : null;
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="min-h-[100dvh] w-screen p-8 grid place-items-center text-indigo-500 text-center">
        <div className="max-w-[21rem] grid grid-cols-6 gap-y-5">
          <h1 className="mb-4 col-span-full font-bold text-3xl">
            <span className="mr-2">{modeName}</span>
            Mode
          </h1>
          <span className="col-span-3 flex items-center gap-2">
            Tries{" "}
            <span className="bg-indigo-200 px-2 rounded-md">{tryCount}</span>
          </span>
          <span className="col-span-3 place-self-end flex items-center gap-2">
            Best Score
            <span className="bg-indigo-200 px-2 rounded-md">
              {bestScore || "--"}
            </span>
          </span>
          <div className="col-span-full p-4 bg-indigo-50 rounded-lg grid grid-cols-4 gap-4">
            {getTiles(tileCount).map((tile, i) => (
              <Tile key={i} flip={() => flip(i)} {...tile} />
            ))}
          </div>
          <div className="col-span-full">
            <button
              type="button"
              className="bg-indigo-200 px-3 py-1 rounded-lg active:scale-95"
              onClick={() => {
                end();
                setModeCount(null);
                setModeName(null);
              }}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
