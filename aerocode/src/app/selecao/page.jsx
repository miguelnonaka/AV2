"use client";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./App.module.css";

export default function Selecao() {
  const router = useRouter();
  const role = useSearchParams().get("role");

  const opcoes = [
    { nome: "Gerenciamento Aeronave", caminho: "/aeronave", icone: "✈️" },
    { nome: "Gerenciamento Funcionarios", caminho: "/funcionario", icone: "👨‍💼" },
    { nome: "Gerenciamento Etapa", caminho: "/etapa", icone: "📋" },
    { nome: "Gerenciamento Peças", caminho: "/peca", icone: "🔩" },
    { nome: "Gerenciamento Testes", caminho: "/teste", icone: "🧪" },
    { nome: "Ver Relatórios", caminho: "/relatorio", icone: "📊" },
  ];

  const permissoes = {
    admin: opcoes,
    engenheiro: opcoes.filter(o =>
      ["Gerenciamento Aeronave", "Gerenciamento Peças", "Gerenciamento Etapa", "Gerenciamento Testes", "Ver Relatórios"].includes(o.nome)
    ),
    operador: opcoes.filter(o =>
      ["Gerenciamento Etapa", "Gerenciamento Testes"].includes(o.nome)
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sistema Aerocode</h1>
        <p className={styles.subtitle}>Selecione o processo desejado</p>
        <div className={styles.roleBadge}>
          Logado como: {getRoleName(role)}
        </div>
      </div>

      <div className={styles.grid}>
        {acessiveis.map((op, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => router.push(`${op.caminho}?role=${role}`)}
          >
            <div className={styles.imagem}>{op.icone}</div>
            <p>{op.nome}</p>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.logout} 
          onClick={() => router.push("/login")}
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}
