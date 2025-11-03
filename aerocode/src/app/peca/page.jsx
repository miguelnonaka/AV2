"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LateralBar from "../components/Lateralbar/lateralBar";
import styles from "./App.module.css";

const TipoPeca = {
  NACIONAL: "Nacional",
  IMPORTADA: "Importada"
};

const StatusPeca = {
  EM_PRODUCAO: "Em produção",
  EM_TRANSPORTE: "Em transporte", 
  PRONTA: "Pronta"
};

const pecasMock = [
  {
    id: 1,
    aeronaveCodigo: 1,
    nome: "Motor CFM56-7B",
    tipo: TipoPeca.IMPORTADA,
    fornecedor: "General Electric",
    status: StatusPeca.EM_TRANSPORTE
  },
  {
    id: 2,
    aeronaveCodigo: 1,
    nome: "Asa Esquerda",
    tipo: TipoPeca.NACIONAL,
    fornecedor: "Embraer",
    status: StatusPeca.EM_PRODUCAO
  },
  {
    id: 3,
    aeronaveCodigo: 2,
    nome: "Trem de Pouso Dianteiro",
    tipo: TipoPeca.IMPORTADA,
    fornecedor: "Safran",
    status: StatusPeca.PRONTA
  }
];

export default function PecaPage() {
  const role = useSearchParams().get("role");
  const [pecas, setPecas] = useState(pecasMock);
  const [pecaSelecionada, setPecaSelecionada] = useState(null);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [formData, setFormData] = useState({
    aeronaveCodigo: "",
    nome: "",
    tipo: "",
    fornecedor: "",
    status: ""
  });

  const podeCadastrar = role === "admin" || role === "engenheiro";
  const podeExcluir = role === "admin" || role === "engenheiro";

  const handleSelectPeca = (peca) => {
    setPecaSelecionada(peca);
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
    const novaPeca = {
      id: pecas.length + 1,
      ...formData,
      aeronaveCodigo: parseInt(formData.aeronaveCodigo)
    };
    setPecas(prev => [...prev, novaPeca]);
    setShowModalCadastro(false);
    setFormData({
      aeronaveCodigo: "",
      nome: "",
      tipo: "",
      fornecedor: "",
      status: ""
    });
  };

  const handleExcluirPeca = () => {
    if (!pecaSelecionada) {
      alert("Selecione uma peça para excluir");
      return;
    }
    setPecas(prev => prev.filter(p => p.id !== pecaSelecionada.id));
    setPecaSelecionada(null);
    setShowModalExcluir(false);
  };

  return (
    <div className={styles.pageContainer}>
      <LateralBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciamento de Peças</h1>
          <p className={styles.subtitle}>Controle completo do inventário de peças</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listaContainer}>
            <div className={styles.listaHeader}>
              <h2>Peças Cadastradas</h2>
              <span className={styles.count}>{pecas.length} peças</span>
            </div>
            
            <div className={styles.lista}>
              {pecas.map(peca => (
                <div
                  key={peca.id}
                  className={`${styles.pecaCard} ${
                    pecaSelecionada?.id === peca.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectPeca(peca)}
                >
                  <div className={styles.pecaInfo}>
                    <h3>{peca.nome}</h3>
                    <p>Aeronave: {peca.aeronaveCodigo} • {peca.tipo}</p>
                    <div className={styles.statusContainer}>
                      <span className={`${styles.status} ${
                        peca.status === StatusPeca.PRONTA ? styles.pronta : 
                        peca.status === StatusPeca.EM_PRODUCAO ? styles.producao : 
                        styles.transporte
                      }`}>
                        {peca.status}
                      </span>
                      <span className={`${styles.tipo} ${
                        peca.tipo === TipoPeca.NACIONAL ? styles.nacional : styles.importada
                      }`}>
                        {peca.tipo}
                      </span>
                    </div>
                  </div>
                  <div className={styles.fornecedor}>
                    Fornecedor: {peca.fornecedor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detalhesContainer}>
            <div className={styles.detalhesHeader}>
              <h2>Detalhes da Peça</h2>
            </div>

            {pecaSelecionada ? (
              <div className={styles.detalhesContent}>
                <div className={styles.detalheItem}>
                  <label>ID:</label>
                  <span>{pecaSelecionada.id}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Código da Aeronave:</label>
                  <span>{pecaSelecionada.aeronaveCodigo}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Nome:</label>
                  <span>{pecaSelecionada.nome}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Tipo:</label>
                  <span className={`${styles.tipo} ${
                    pecaSelecionada.tipo === TipoPeca.NACIONAL ? styles.nacional : styles.importada
                  }`}>
                    {pecaSelecionada.tipo}
                  </span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Fornecedor:</label>
                  <span>{pecaSelecionada.fornecedor}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Status:</label>
                  <span className={`${styles.status} ${
                    pecaSelecionada.status === StatusPeca.PRONTA ? styles.pronta : 
                    pecaSelecionada.status === StatusPeca.EM_PRODUCAO ? styles.producao : 
                    styles.transporte
                  }`}>
                    {pecaSelecionada.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.selecionarAviso}>
                <p>Selecione uma peça para visualizar os detalhes</p>
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
              Cadastrar Peça
            </button>
          )}
          {podeExcluir && (
            <button 
              className={styles.excluirButton}
              onClick={() => {
                if (!pecaSelecionada) {
                  alert("Selecione uma peça para excluir");
                  return;
                }
                setShowModalExcluir(true);
              }}
              disabled={!pecaSelecionada}
            >
              Excluir Peça
            </button>
          )}
        </div>
      </main>

      {showModalCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Nova Peça</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModalCadastro(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitCadastro} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Código da Aeronave:</label>
                <input
                  type="number"
                  name="aeronaveCodigo"
                  value={formData.aeronaveCodigo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 1"
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nome da Peça:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Motor CFM56-7B"
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
                  <option value={TipoPeca.NACIONAL}>Nacional</option>
                  <option value={TipoPeca.IMPORTADA}>Importada</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Fornecedor:</label>
                <input
                  type="text"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: General Electric"
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
                  <option value={StatusPeca.EM_PRODUCAO}>Em produção</option>
                  <option value={StatusPeca.EM_TRANSPORTE}>Em transporte</option>
                  <option value={StatusPeca.PRONTA}>Pronta</option>
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
              <p>Tem certeza que deseja excluir a peça:</p>
              <h3>"{pecaSelecionada?.nome}"?</h3>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModalExcluir(false)}>
                Cancelar
              </button>
              <button 
                onClick={handleExcluirPeca}
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