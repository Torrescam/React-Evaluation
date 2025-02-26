import s from "./Home.module.css";
import reactIconUrl from "../../assets/react-icon-lg.svg";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

function Home() {
  const navigate = useNavigate();

  const handleClickColorGame = () => {
    navigate("/color-game");
  };

  const handleClickDoable = () => {
    navigate("/doable");
  };
  return (
    <div className={s.wrapper}>
      <img src={reactIconUrl} />
      <h1 className={s.title}>React Evaluation</h1>
      <p className={s.name}>Camilo Torres</p>
      <div className={s.buttons}>
        <Button onClick={handleClickColorGame}>
          Color Game
        </Button>
        <Button onClick={handleClickDoable}>Doable</Button>
      </div>
    </div>
  );
}

export default Home;
