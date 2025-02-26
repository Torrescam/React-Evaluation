import s from "./Doable.module.css";
import Authenticated from "../Authenticated";
import Unauthenticated from "../Unauthenticated";
import { useAuth } from "../../contexts/authContext";

function Doable() {
  const { isAuthenticated } = useAuth(); // Obtiene el estado de autenticacion

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Doable</h1>
      <p className={s.description}>Add and filter your most important tasks</p>
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </div>
  );
}

export default Doable;
  