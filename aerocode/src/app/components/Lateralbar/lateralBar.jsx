"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./lateralbar.module.css";

export default function LateralBar() {
  const router = useRouter();
  const role = useSearchParams().get("role");

  const opcoes = [
    { nome: "Aeronaves", caminho: "/aeronave", icone: "✈️" },
    { nome: "Funcionários", caminho: "/funcionario", icone: "👨‍💼" },
    { nome: "Etapas", caminho: "/etapa", icone: "📋" },
    { nome: "Peças", caminho: "/peca", icone: "🔩" },
    { nome: "Testes", caminho: "/teste", icone: "🧪" },
    { nome: "Relatórios", caminho: "/relatorio", icone: "📊" },
  ];

  const permissoes = {
    admin: opcoes, // tudo
    engenheiro: opcoes.filter(o =>
      ["Aeronaves", "Peças", "Etapas", "Testes", "Relatórios"].includes(o.nome)
    ),
    operador: opcoes.filter(o =>
      ["Etapas", "Testes"].includes(o.nome)
    ),
  };

  const acessiveis = permissoes[role] || [];

  const getRoleName = (role) => {
    const names = {
      admin: "Administrador",
      engenheiro: "Engenheiro", 
      operador: "Operador"
    };
    return names[role] || "Usuário";
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <h2>Aerocode</h2>
          </div>
          <div className={styles.roleBadge}>
            {getRoleName(role)}
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.list}>
            {acessiveis.map((op, i) => (
              <li 
                key={i} 
                className={styles.listItem}
                onClick={() => router.push(`${op.caminho}?role=${role}`)}
              >
                <span className={styles.icon}>{op.icone}</span>
                <span className={styles.text}>{op.nome}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footer}>
          <button 
            className={styles.logoutButton} 
            onClick={() => router.push("/login")}
          >
            <span className={styles.logoutIcon}>🚪</span>
            Sair
          </button>
        </div>
      </div>
      <div className={styles.sidebarSpacer}></div>
    </>
  );
}
