"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LateralBar from "../components/Lateralbar/lateralBar";
import styles from "./App.module.css";

const aeronavesMock = [
  {
    codigo: 1,
    modelo: "Airbus A320",
    tipo: "Comercial",
    capacidade: 180,
    alcance: "6100km"
  },
  {
    codigo: 2,
    modelo: "Embraer Phenom 300",
    tipo: "Executiva",
    capacidade: 9,
    alcance: "3650km"
  },
  {
    codigo: 3,
    modelo: "Boeing 747-8F",
    tipo: "Carga",
    capacidade: 0,
    alcance: "8130km"
  }
];

export default function AeronavePage() {
  const role = useSearchParams().get("role");
  const [aeronaves, setAeronaves] = useState(aeronavesMock);
  const [aeronaveSelecionada, setAeronaveSelecionada] = useState(null);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [formData, setFormData] = useState({
    modelo: "",
    tipo: "",
    capacidade: "",
    alcance: ""
  });

  const podeCadastrar = role === "admin" || role === "engenheiro";
  const podeExcluir = role === "admin" || role === "engenheiro";

  const handleSelectAeronave = (aeronave) => {
    setAeronaveSelecionada(aeronave);
  };

  const handleGerarRelatorio = () => {
    if (!aeronaveSelecionada) {
      alert("Selecione uma aeronave para gerar o relatório");
      return;
    }
    alert(`Relatório gerado para: ${aeronaveSelecionada.modelo}`);
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
    const novaAeronave = {
      codigo: aeronaves.length + 1,
      ...formData,
      capacidade: parseInt(formData.capacidade)
    };
    setAeronaves(prev => [...prev, novaAeronave]);
    setShowModalCadastro(false);
    setFormData({
      modelo: "",
      tipo: "",
      capacidade: "",
      alcance: ""
    });
  };

  const handleExcluirAeronave = () => {
    if (!aeronaveSelecionada) {
      alert("Selecione uma aeronave para excluir");
      return;
    }
    setAeronaves(prev => prev.filter(a => a.codigo !== aeronaveSelecionada.codigo));
    setAeronaveSelecionada(null);
    setShowModalExcluir(false);
  };

  return (
    <div className={styles.pageContainer}>
      <LateralBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciamento de Aeronaves</h1>
          <p className={styles.subtitle}>Controle completo da frota de aeronaves</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listaContainer}>
            <div className={styles.listaHeader}>
              <h2>Aeronaves Cadastradas</h2>
              <span className={styles.count}>{aeronaves.length} aeronaves</span>
            </div>
            
            <div className={styles.lista}>
              {aeronaves.map(aeronave => (
                <div
                  key={aeronave.codigo}
                  className={`${styles.aeronaveCard} ${
                    aeronaveSelecionada?.codigo === aeronave.codigo ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectAeronave(aeronave)}
                >
                  <div className={styles.aeronaveInfo}>
                    <h3>{aeronave.modelo}</h3>
                    <p>{aeronave.tipo} • Capacidade: {aeronave.capacidade}</p>
                    <span className={`${styles.status} ${
                      aeronave.tipo === "Militar" ? styles.militar : styles.comercial
                    }`}>
                      {aeronave.tipo}
                    </span>
                  </div>
                  <div className={styles.alcance}>
                    Alcance: {aeronave.alcance}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detalhesContainer}>
            <div className={styles.detalhesHeader}>
              <h2>Detalhes da Aeronave</h2>
              <button 
                className={styles.relatorioButton}
                onClick={handleGerarRelatorio}
                disabled={!aeronaveSelecionada}
              >
                Gerar Relatório
              </button>
            </div>

            {aeronaveSelecionada ? (
              <div className={styles.detalhesContent}>
                <div className={styles.detalheItem}>
                  <label>Código:</label>
                  <span>{aeronaveSelecionada.codigo}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Modelo:</label>
                  <span>{aeronaveSelecionada.modelo}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Tipo:</label>
                  <span className={`${styles.status} ${
                    aeronaveSelecionada.tipo === "Militar" ? styles.militar : styles.comercial
                  }`}>
                    {aeronaveSelecionada.tipo}
                  </span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Capacidade:</label>
                  <span>{aeronaveSelecionada.capacidade} {aeronaveSelecionada.tipo === "Militar" ? "pessoas" : "passageiros"}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Alcance:</label>
                  <span>{aeronaveSelecionada.alcance}</span>
                </div>
              </div>
            ) : (
              <div className={styles.selecionarAviso}>
                <p>Selecione uma aeronave para visualizar os detalhes</p>
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
              Cadastrar Aeronave
            </button>
          )}
          {podeExcluir && (
            <button 
              className={styles.excluirButton}
              onClick={() => {
                if (!aeronaveSelecionada) {
                  alert("Selecione uma aeronave para excluir");
                  return;
                }
                setShowModalExcluir(true);
              }}
              disabled={!aeronaveSelecionada}
            >
              Excluir Aeronave
            </button>
          )}
        </div>
      </main>

      {showModalCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Nova Aeronave</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModalCadastro(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitCadastro} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Modelo:</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Airbus A320"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tipo:</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Executiva">Executiva</option>
                  <option value="Carga">Carga</option>
                  <option value="Militar">Militar</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Capacidade:</label>
                <input
                  type="number"
                  name="capacidade"
                  value={formData.capacidade}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 150"
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Alcance:</label>
                <input
                  type="text"
                  name="alcance"
                  value={formData.alcance}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 4000km"
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
              <p>Tem certeza que deseja excluir a aeronave:</p>
              <h3>"{aeronaveSelecionada?.modelo}"?</h3>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModalExcluir(false)}>
                Cancelar
              </button>
              <button 
                onClick={handleExcluirAeronave}
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