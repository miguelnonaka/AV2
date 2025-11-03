"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LateralBar from "../components/Lateralbar/lateralBar";
import styles from "./App.module.css";

const funcionariosMock = [
  {
    id: 1,
    nome: "Miguel",
    telefone: "99999-1111",
    endereco: "Rua A",
    nivelPermissao: "Administrador"
  },
  {
    id: 2,
    nome: "João",
    telefone: "98888-2222",
    endereco: "Rua B",
    nivelPermissao: "Engenheiro"
  },
  {
    id: 3,
    nome: "Maria",
    telefone: "97777-3333",
    endereco: "Rua C",
    nivelPermissao: "Operador"
  }
];

export default function FuncionarioPage() {
  const role = useSearchParams().get("role");
  const [funcionarios, setFuncionarios] = useState(funcionariosMock);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    nivelPermissao: ""
  });

  const podeCadastrar = role === "admin";
  const podeExcluir = role === "admin";

  const handleSelectFuncionario = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCadastro = (e) => {
    e.preventDefault();
    const novoFuncionario = {
      id: funcionarios.length + 1,
      ...formData
    };
    setFuncionarios(prev => [...prev, novoFuncionario]);
    setShowModalCadastro(false);
    setFormData({
      nome: "",
      telefone: "",
      endereco: "",
      nivelPermissao: ""
    });
  };

  const handleExcluirFuncionario = () => {
    if (!funcionarioSelecionado) {
      alert("Selecione um funcionário para excluir");
      return;
    }
    setFuncionarios(prev => prev.filter(f => f.id !== funcionarioSelecionado.id));
    setFuncionarioSelecionado(null);
    setShowModalExcluir(false);
  };

  return (
    <div className={styles.pageContainer}>
      <LateralBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciamento de Funcionários</h1>
          <p className={styles.subtitle}>Controle completo da equipe de funcionários</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listaContainer}>
            <div className={styles.listaHeader}>
              <h2>Funcionários Cadastrados</h2>
              <span className={styles.count}>{funcionarios.length} funcionários</span>
            </div>
            
            <div className={styles.lista}>
              {funcionarios.map(funcionario => (
                <div
                  key={funcionario.id}
                  className={`${styles.funcionarioCard} ${
                    funcionarioSelecionado?.id === funcionario.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectFuncionario(funcionario)}
                >
                  <div className={styles.funcionarioInfo}>
                    <h3>{funcionario.nome}</h3>
                    <p>{funcionario.telefone}</p>
                    <span className={`${styles.status} ${
                      funcionario.nivelPermissao === "Administrador" ? styles.administrador : 
                      funcionario.nivelPermissao === "Engenheiro" ? styles.engenheiro : 
                      styles.operador
                    }`}>
                      {funcionario.nivelPermissao}
                    </span>
                  </div>
                  <div className={styles.endereco}>
                    {funcionario.endereco}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detalhesContainer}>
            <div className={styles.detalhesHeader}>
              <h2>Detalhes do Funcionário</h2>
            </div>

            {funcionarioSelecionado ? (
              <div className={styles.detalhesContent}>
                <div className={styles.detalheItem}>
                  <label>ID:</label>
                  <span>{funcionarioSelecionado.id}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Nome:</label>
                  <span>{funcionarioSelecionado.nome}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Telefone:</label>
                  <span>{funcionarioSelecionado.telefone}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Endereço:</label>
                  <span>{funcionarioSelecionado.endereco}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Nível de Permissão:</label>
                  <span className={`${styles.status} ${
                    funcionarioSelecionado.nivelPermissao === "Administrador" ? styles.administrador : 
                    funcionarioSelecionado.nivelPermissao === "Engenheiro" ? styles.engenheiro : 
                    styles.operador
                  }`}>
                    {funcionarioSelecionado.nivelPermissao}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.selecionarAviso}>
                <p>Selecione um funcionário para visualizar os detalhes</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {podeCadastrar && (
            <button 
              className={styles.cadastrarButton}
              onClick={() => setShowModalCadastro(true)}
            >
              Cadastrar Funcionário
            </button>
          )}
          {podeExcluir && (
            <button 
              className={styles.excluirButton}
              onClick={() => {
                if (!funcionarioSelecionado) {
                  alert("Selecione um funcionário para excluir");
                  return;
                }
                setShowModalExcluir(true);
              }}
              disabled={!funcionarioSelecionado}
            >
              Excluir Funcionário
            </button>
          )}
        </div>
      </main>

      {showModalCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Funcionário</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModalCadastro(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitCadastro} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone:</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Rua A, 123"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nível de Permissão:</label>
                <select
                  name="nivelPermissao"
                  value={formData.nivelPermissao}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o nível</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Engenheiro">Engenheiro</option>
                  <option value="Operador">Operador</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModalCadastro(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModalExcluir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Confirmar Exclusão</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModalExcluir(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.exclusaoContent}>
              <p>Tem certeza que deseja excluir o funcionário:</p>
              <h3>"{funcionarioSelecionado?.nome}"?</h3>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModalExcluir(false)}>
                Cancelar
              </button>
              <button 
                onClick={handleExcluirFuncionario}
                className={styles.excluirConfirmButton}
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}