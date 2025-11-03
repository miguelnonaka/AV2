"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LateralBar from "../components/Lateralbar/lateralBar";
import styles from "./App.module.css";

const etapasMock = [
  {
    id: 1,
    nome: "Montagem Inicial",
    responsavel: "Miguel",
    status: "Em andamento",
    prazo: "10/11/2025",
    descricao: "Início do processo de montagem da aeronave base."
  },
  {
    id: 2,
    nome: "Inspeção Técnica",
    responsavel: "João",
    status: "Concluída",
    prazo: "03/11/2025",
    descricao: "Verificação completa dos sistemas principais."
  },
  {
    id: 3,
    nome: "Teste de Motores",
    responsavel: "Maria",
    status: "Pendente",
    prazo: "15/11/2025",
    descricao: "Etapa de avaliação dos motores e componentes elétricos."
  }
];

export default function EtapaPage() {
  const role = useSearchParams().get("role");
  const [etapas, setEtapas] = useState(etapasMock);
  const [etapaSelecionada, setEtapaSelecionada] = useState(null);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    responsavel: "",
    status: "",
    prazo: "",
    descricao: ""
  });

  const podeCadastrar = role === "admin" || role === "engenheiro";
  const podeExcluir = role === "admin" || role === "engenheiro";

  const handleSelectEtapa = (etapa) => {
    setEtapaSelecionada(etapa);
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
    const novaEtapa = {
      id: etapas.length + 1,
      ...formData
    };
    setEtapas(prev => [...prev, novaEtapa]);
    setShowModalCadastro(false);
    setFormData({
      nome: "",
      responsavel: "",
      status: "",
      prazo: "",
      descricao: ""
    });
  };

  const handleExcluirEtapa = () => {
    if (!etapaSelecionada) {
      alert("Selecione uma etapa para excluir");
      return;
    }
    setEtapas(prev => prev.filter(e => e.id !== etapaSelecionada.id));
    setEtapaSelecionada(null);
    setShowModalExcluir(false);
  };

  return (
    <div className={styles.pageContainer}>
      <LateralBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciamento de Etapas</h1>
          <p className={styles.subtitle}>Controle completo do processo de produção</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listaContainer}>
            <div className={styles.listaHeader}>
              <h2>Etapas Cadastradas</h2>
              <span className={styles.count}>{etapas.length} etapas</span>
            </div>
            
            <div className={styles.lista}>
              {etapas.map(etapa => (
                <div
                  key={etapa.id}
                  className={`${styles.etapaCard} ${
                    etapaSelecionada?.id === etapa.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectEtapa(etapa)}
                >
                  <div className={styles.etapaInfo}>
                    <h3>{etapa.nome}</h3>
                    <p>Responsável: {etapa.responsavel}</p>
                    <span className={`${styles.status} ${
                      etapa.status === "Concluída" ? styles.concluida : 
                      etapa.status === "Em andamento" ? styles.andamento : 
                      styles.pendente
                    }`}>
                      {etapa.status}
                    </span>
                  </div>
                  <div className={styles.prazo}>
                    Prazo: {etapa.prazo}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detalhesContainer}>
            <div className={styles.detalhesHeader}>
              <h2>Detalhes da Etapa</h2>
            </div>

            {etapaSelecionada ? (
              <div className={styles.detalhesContent}>
                <div className={styles.detalheItem}>
                  <label>ID:</label>
                  <span>{etapaSelecionada.id}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Nome:</label>
                  <span>{etapaSelecionada.nome}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Responsável:</label>
                  <span>{etapaSelecionada.responsavel}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Status:</label>
                  <span className={`${styles.status} ${
                    etapaSelecionada.status === "Concluída" ? styles.concluida : 
                    etapaSelecionada.status === "Em andamento" ? styles.andamento : 
                    styles.pendente
                  }`}>
                    {etapaSelecionada.status}
                  </span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Prazo:</label>
                  <span>{etapaSelecionada.prazo}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Descrição:</label>
                  <span className={styles.descricao}>{etapaSelecionada.descricao}</span>
                </div>
              </div>
            ) : (
              <div className={styles.selecionarAviso}>
                <p>Selecione uma etapa para visualizar os detalhes</p>
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
              Cadastrar Etapa
            </button>
          )}
          {podeExcluir && (
            <button 
              className={styles.excluirButton}
              onClick={() => {
                if (!etapaSelecionada) {
                  alert("Selecione uma etapa para excluir");
                  return;
                }
                setShowModalExcluir(true);
              }}
              disabled={!etapaSelecionada}
            >
              Excluir Etapa
            </button>
          )}
        </div>
      </main>

      {showModalCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Nova Etapa</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModalCadastro(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitCadastro} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nome da Etapa:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Montagem Inicial"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Responsável:</label>
                <input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Miguel"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Prazo:</label>
                <input
                  type="text"
                  name="prazo"
                  value={formData.prazo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 10/11/2025"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Descrição:</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                  placeholder="Descreva a etapa..."
                  rows="3"
                />
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
              <p>Tem certeza que deseja excluir a etapa:</p>
              <h3>"{etapaSelecionada?.nome}"?</h3>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModalExcluir(false)}>
                Cancelar
              </button>
              <button 
                onClick={handleExcluirEtapa}
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