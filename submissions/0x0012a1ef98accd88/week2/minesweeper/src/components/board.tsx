import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Coordinate, revealCell, startGame, toggleFlag } from "@minesweeper";
import React, { useEffect } from "react";
import Row from "./row";
import { shallowEqual } from "react-redux";
import Loading from "./loading";
import { Sound } from "@/types";
import { difficulty } from "@/config";
import Hotkeys from "./hotkeys";
import ModalWin from "./modal-win";
import { getRandomNumber } from "../contracts/contracts";

// type Props = {
//   startNewGame: () => void;
// };
const Board = () => {
  const grid = useAppSelector((store) => store.minesweeper.grid, shallowEqual);
  const status = useAppSelector((store) => store.minesweeper.status, shallowEqual);
  const level = useAppSelector((store) => store.userData.level, shallowEqual);
  const dispatch = useAppDispatch();
  const onLeftClick = (e: React.MouseEvent, coordinate: Coordinate) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const _sound = target.dataset.sound;
    console.log("click sound", _sound, target, e.currentTarget);
    if (_sound) {
      switch (_sound as Sound) {
        case "tick":
          window.SOUND_TICK.play();
          break;
        case "loss":
          window.SOUND_LOSE.play();
          break;
        case "start":
          window.SOUND_START.play();
          break;
        case "win":
          window.SOUND_WIN.play();
          break;
        default:
          break;
      }
    }
    // @ts-ignore
    dispatch(revealCell({ coordinate }));
  };
  useEffect(() => {
    const d = difficulty[level];
    console.log({ d });

    const startWithRandomSeed = async () => {
      const randSeed = await getRandomNumber();
      dispatch(
        // @ts-ignore
        startGame({
          difficulty: d,
          randSeed
        })
      );
    };
    startWithRandomSeed();
  }, [level]);

  const onRightClick = (e: React.MouseEvent, coordinate: Coordinate) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(toggleFlag({ coordinate }));
  };
  const rows = grid.map((row, index) => (
    <Row
      key={`row-${index}`}
      rowIndex={index}
      row={row}
      leftClick={onLeftClick}
      rightClick={onRightClick}
    />
  ));
  const waiting = status === "waiting";
  const gameOver = status === "loss" || status === "win";
  return (
    <>
      <Hotkeys>
        <div
          tabIndex={2}
          className="board relative flex flex-col justify-center items-center min-w-[200px] min-h-[200px] border-t border-t-[#818181] border-l border-l-[#818181] border-r border-r-gray-200 border-b border-b-gray-200"
        >
          {waiting ? <Loading /> : rows}
          {gameOver && <div className="absolute left-0 top-0 w-full h-full html2img-ignore"></div>}
        </div>
      </Hotkeys>
      <ModalWin />
    </>
  );
};

export default Board;
