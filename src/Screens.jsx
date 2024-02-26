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

export function StartScreen({
  start,
  setModeCount,
  setModeName,
  showCaution,
  setShowCaution,
}) {
  const [showScores, setShowScores] = useState(false);
  const easyScores = localStorage.getItem("easyBestScore")?.split(";");
  const mediumScores = localStorage.getItem("mediumBestScore")?.split(";");
  const hardScores = localStorage.getItem("hardBestScore")?.split(";");

  return (
    <div className='min-h-[100dvh] w-screen p-8 flex flex-col items-center justify-center text-pink-500 text-center'>
      <div
        className={
          "max-w-[21rem] h-[21rem] w-full pt-6 pb-12 flex flex-col justify-center items-center gap-5 bg-pink-50 rounded-lg"
        }
      >
        <h1 className='font-bold text-3xl'>Memory</h1>

        <p>Flip over tiles looking for pairs</p>

        <div className='h-[4rem] px-6 mt-4 grid place-items-center grid-cols-3 gap-4'>
          <button
            type='button'
            className='h-fit bg-pink-200 px-3 py-1 rounded-md flex flex-col items-center justify-center focus:border-2 focus:border-pink-500 active:scale-95 transition-transform ease-in-out duration-300 font-semibold'
            onClick={() => {
              setModeCount(8);
              setModeName("Easy");
            }}
          >
            Easy
            <span className='font-normal'>8 Tiles</span>
          </button>
          <button
            type='button'
            className='bg-pink-200 px-3 py-1 rounded-md flex flex-col items-center justify-center focus:border-2 focus:border-pink-500 active:scale-95 transition-transform ease-in-out duration-300 font-semibold'
            onClick={() => {
              setModeCount(16);
              setModeName("Medium");
            }}
          >
            Medium
            <span className='font-normal'>16 Tiles</span>
          </button>
          <button
            type='button'
            className='bg-pink-200 px-3 py-1 rounded-lg flex flex-col items-center justify-center focus:border-2 focus:border-pink-500 active:scale-95 transition-transform ease-in-out duration-300 font-semibold'
            onClick={() => {
              setModeCount(24);
              setModeName("Hard");
            }}
          >
            Hard
            <span className='font-normal'>24 tiles</span>
          </button>
        </div>

        <button
          className='w-[8rem] py-2 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full text-lg text-white'
          onClick={start}
        >
          Play
        </button>
      </div>
      <button
        type='button'
        className='mt-6 font-semibold \n underline text-center px-4'
        onClick={() => setShowScores(true)}
      >
        View best 5 scores for all modes
      </button>
      {showScores && (
        <div className='max-w-[23rem] w-full h-[26rem] p-6 pt-12 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-xl rounded-lg grid grid-cols-3 justify-center border-2 border-pink-400'>
          <div>
            <h3 className='font-semibold text-xl mb-4'>Easy</h3>
            <div>
              {!easyScores ? (
                "No data"
              ) : (
                <ul>
                  {easyScores.map((score, index) => (
                    <li key={index}>{score}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h3 className='font-semibold text-xl mb-4'>Medium</h3>
            <div>
              {!mediumScores ? (
                "No data"
              ) : (
                <ul>
                  {mediumScores.map((score, index) => (
                    <li key={index}>{score}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-xl mb-4'>Hard</h3>
            <div>
              {!hardScores ? (
                "No data"
              ) : (
                <ul>
                  {hardScores.map((score, index) => (
                    <li key={index}>{score}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            type='button'
            className='col-span-full w-24 mx-auto bg-pink-100 h-fit p-2 rounded-lg active:scale-95 my-auto'
            onClick={() => setShowScores(false)}
          >
            Close
          </button>
        </div>
      )}
      {showCaution && (
        <div className='fixed :top-0 :left-0 h-full w-full bg-black bg-opacity-40 backdrop-blur'>
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full   max-w-[23rem] h-[15rem] text-center p-4 bg-white flex items-center flex-col justify-between py-8 shadow-lg border border-pink-400'>
            <p>
              Please choose a game mode between 'Easy', Medium' and 'Hard' to
              continue
            </p>
            <button
              className='bg-pink-100 w-24 p-2 rounded-lg active:scale-95 transition-transform ease-in-out duration-300'
              onClick={() => setShowCaution(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
  const [completed, setCompleted] = useState(false);
  const [showScores, setShowScores] = useState(false);

  const bestScore =
    modeName == "Easy"
      ? localStorage
          .getItem("easyBestScore")
          ?.split(";")
          .sort((a, z) => Number(a) - Number(z))[0]
      : modeName == "Medium"
      ? localStorage
          .getItem("mediumBestScore")
          ?.split(";")
          .sort((a, z) => Number(a) - Number(z))[0]
      : localStorage
          .getItem("hardBestScore")
          ?.split(";")
          .sort((a, z) => Number(a) - Number(z))[0];

  const bestScores = localStorage
    .getItem(`${modeName.toLowerCase()}BestScore`)
    ?.split(";");

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
            const prevItems = localStorage.getItem(
              `${modeName.toLowerCase()}BestScore`
            );
            const newBestScores = `${prevItems};${tryCount + 1}`;

            bestScore &&
              localStorage.setItem(
                `${modeName.toLowerCase()}BestScore`,
                [...new Set(newBestScores.split(";"))]
                  .sort((a, z) => Number(a) - Number(z))
                  .slice(0, 6)
                  .join(";")
              );

            setCompleted(true);
            // setTimeout(end, 3000);
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
      <div className='min-h-[100dvh] w-screen p-8 grid place-items-center text-indigo-500 text-center'>
        <div className='max-w-[21rem] grid grid-cols-6 gap-y-5'>
          <h1 className='mb-4 col-span-full font-bold text-3xl'>
            <span className='mr-2'>{modeName}</span>
            Mode
          </h1>
          <span className='col-span-3 flex items-center gap-2'>
            Tries{" "}
            <span className='bg-indigo-200 px-2 rounded-md'>{tryCount}</span>
          </span>
          <span className='col-span-3 place-self-end flex items-center gap-2'>
            Best Score
            <span className='bg-indigo-200 px-2 rounded-md'>
              {bestScore || "--"}
            </span>
          </span>
          <div className='relative col-span-full p-4 bg-indigo-50 rounded-lg grid grid-cols-4 gap-4 overflow-hidden'>
            {getTiles(tileCount).map((tile, i) => (
              <Tile key={i} flip={() => flip(i)} {...tile} />
            ))}
            {completed && (
              <div className='absolute border bg-indigo-100 bg-opacity-40 backdrop-blur top-0 left-0 w-full h-full flex items-center justify-center'>
                <p className='text-center font-bold text-3xl text-indigo-500'>
                  Game Complete!
                </p>
              </div>
            )}
          </div>

          <div className='col-span-full flex justify-between'>
            <button
              className='underline font-semibold'
              onClick={() => setShowScores(true)}
            >
              View mode&apos;s best scores
            </button>
            <button
              className='bg-indigo-200 px-3 py-1 rounded-lg active:scale-95'
              onClick={() => {
                end();
                setModeCount(null);
                setModeName(null);
              }}
            >
              {completed ? "End Game" : "Restart"}
            </button>
          </div>

          {showScores && (
            <div className='max-w-[23rem] w-full h-[26rem] p-6 py-12 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-xl rounded-lg border-2 border-indigo-400 flex flex-col'>
              <div className='w-full'>
                <h3 className='font-semibold text-xl mb-4'>{modeName} Mode</h3>
                <div>
                  {!bestScores?.length ? (
                    "No data"
                  ) : (
                    <ul className='text-lg'>
                      {bestScores?.map((score, index) => (
                        <li key={index}>{score}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                className='mt-auto bg-indigo-100 w-fit p-2 rounded-lg w-24 mx-auto'
                onClick={() => setShowScores(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

