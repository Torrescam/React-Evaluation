import * as React from "react";
import s from "./Unauthenticated.module.css";
import { useAuth } from "../../contexts/authContext";
import Button from "../Button";

function Unauthenticated() {
  //TODO: Obtener del contexto login y signup
  const { login, signup } = useAuth();
  const [status, setStatus] = React.useState("idle");
  const [activeTab, setActiveTab] = React.useState("login");
  const [signUpErrors, setSignUpErrors] = React.useState(null);
  const [formData, setFormData] = React.useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  //Envio del formulario
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    //realiza el login o signup basado en la pestaña activa
    if (activeTab === "login") {
      handleLogin(formData.email, formData.password)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      handleSignup(formData.email, formData.password)
        .then(() => setStatus("success"))
        .catch((error) => {
          setStatus("error");
          setSignUpErrors(error.message);
        });
    }
  }

  async function handleLogin(email: string, password: string) {
    await login(email, password);
    console.log("Login successfull");
  }

  async function handleSignup(email: string, password: string) {
    await signup(email, password);
    console.log("signup successfull");
  }

  function handleTabChange(tab: "login" | "signup") {
    setActiveTab(tab);
    setStatus("idle");
    setSignUpErrors(null);
    setFormData({ email: "", password: "" }); //limpia el formulario
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const isLoading = status === "loading";
  const buttonText = activeTab === "login" ? "Login" : "Create";
  const hasError = status === "error";

  return (
    <div className={s.wrapper}>
      <div className={s.tabs}>
        <button
          onClick={() => handleTabChange("login")}
          className={activeTab === "login" ? s.active : ""}
        >
          Login
        </button>
        <button
          onClick={() => handleTabChange("signup")}
          className={activeTab === "signup" ? s.active : ""}
        >
          Signup
        </button>
      </div>
      <form onSubmit={handleSubmit} className={s.form}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="user@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="******"
            required
            minLength={6}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : buttonText}
        </Button>
      </form>
      {hasError && (
        <p className={s["error-message"]}>
          {signUpErrors || "Invalid Credentials"}
        </p>
      )}
    </div>
  );
}

export default Unauthenticated;
