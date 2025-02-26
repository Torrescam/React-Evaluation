import { useState } from "react";
import s from "./ColorGame.module.css";
import { getRandomColors, getStatus, rgbString, statusMessage } from "./utils";
import Button from "../Button";

function ColorGame() {
  const [numOfColors, setNumOfColors] = useState(6);
  const [colors, setColors] = useState(getRandomColors(numOfColors));
  const [attempts, setAttempts] = useState<number[]>([]);
  const [target, setTarget] = useState(0);

  function handleReset() {
    const newColors = getRandomColors(numOfColors);
    setColors(newColors);

    const newTarget = Math.floor(Math.random() * newColors.length);
    setTarget(newTarget);
    setAttempts([]);

    console.log("Reset: New Target Index:", newTarget);
  }

  function handleChangeNumber(event: React.ChangeEvent<HTMLInputElement>) {
    const newNumOfColors = parseInt(event.target.value, 10);
    setNumOfColors(newNumOfColors); // genera nuevos colores
    const newColors = getRandomColors(newNumOfColors); //alamcena los nuevos colores generados
    setColors(newColors);
    console.log("New color arrays:", newColors);

    const newTarget = Math.floor(Math.random() * newColors.length);
    setTarget(newTarget);
    setAttempts([]);
  }

  function handleColorClick(index: number) {
    setAttempts((prevAttempts) => [...prevAttempts, index]);
    console.log("Clicked index:", index);
    console.log("Target index:", target);
  }

  const status = getStatus(attempts, target, numOfColors);

  const isGameOver = status === "win" || status === "lose";

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Color Game</h1>
      <p className={s.description}>
        Guess which color correspond to the following RGB code
      </p>
      <div className={s["rgb-wrapper"]}>
        <div className={s.rgb} style={{ borderColor: "red" }}>
          <p className={s["color-number"]}>{colors[target][0]}</p>
          <p>Red</p>
        </div>
        <div className={s.rgb} style={{ borderColor: "green" }}>
          <p className={s["color-number"]}>{colors[target][1]}</p>
          <p>Green</p>
        </div>
        <div className={s.rgb} style={{ borderColor: "blue" }}>
          <p className={s["color-number"]}>{colors[target][2]}</p>
          <p>Blue</p>
        </div>
      </div>
      <div className={s.dashboard}>
        <div className={s["number-input"]}>
          <label htmlFor="colors"># Colors</label>
          <input
            id="colors"
            type="number"
            value={numOfColors}
            onChange={handleChangeNumber}
            step={3}
            min={3}
            max={9}
          />
        </div>
        <p className={s["game-status"]}>{statusMessage[status]}</p>

        <Button onClick={handleReset}>Reset</Button>
      </div>
      <div className={s.squares}>
        {colors.map((color, index) => {
          //Mostrar todos los cuadrados del color objetivo al terminar
          const backgroundColor = isGameOver
            ? rgbString(colors[target])
            : rgbString(color);
          const opacity = isGameOver || !attempts.includes(index) ? "100" : "0";

          return (
            <Button
              key={index}
              style={{ backgroundColor, opacity }}
              onClick={() => handleColorClick(index)}
              className={s.square}
              disabled={isGameOver} // Deshabilitar el botón si el juego ha terminado
              children={undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ColorGame;
