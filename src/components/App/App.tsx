import clsx from "clsx";
import s from "./App.module.css";

import reactIconUrl from "../../assets/react-icon-lg.svg";
import Home from "../Home";
import ColorGame from "../ColorGame";
import Doable from "../Doable";
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";
import { AuthProvider } from "../../contexts/authContext";

const navigation = [
  {
    name: "Color Game",
    to: "/color-game",
  },
  {
    name: "Doable",
    to: "/doable",
  },
];

function App() {
  return (
    <>
      <BrowserRouter>
        <div className={s.wrapper}>
          <header className={s.header}>
            <Link to="/" className={s.logo}>
              <img src={reactIconUrl} /> React Evaluation
            </Link>
            <nav className={s.nav}>
              {navigation.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(s["nav-item"])}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </header>

          <main className={s.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/color-game" element={<ColorGame />} />
              <Route
                path="/doable"
                element={
                  <AuthProvider>
                    <Doable />
                  </AuthProvider>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
