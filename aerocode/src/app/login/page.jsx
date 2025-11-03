"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./App.module.css";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (usuario === "admin" && senha === "123") {
      router.push(`/selecao?role=admin`);
    } else if (usuario === "engenheiro" && senha === "123") {
      router.push(`/selecao?role=engenheiro`);
    } else if (usuario === "operador" && senha === "123") {
      router.push(`/selecao?role=operador`);
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <h1>Aerocode</h1>
        </div>

        <div className={styles.box}>
          <h2>Acessar Sistema</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="usuario">Usuário</label>
              <input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <button type="submit" className={styles.button}>
              Entrar no Sistema
            </button>
          </form>
        
        </div>
      </div>
    </div>
  );
}