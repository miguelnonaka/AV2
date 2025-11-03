"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LateralBar from "../components/Lateralbar/lateralBar";
import styles from "./App.module.css";

const ResultadoTeste = {
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado"
};

const TipoTeste = {
  ELETRICO: "Eletrico",
  HIDRAULICO: "Hidraulico", 
  AERODINAMICO: "Aerodinamico"
};

const testesMock = [
  {
    id: 1,
    aeronaveCodigo: 1,
    tipo: TipoTeste.AERODINAMICO,
    resultado: ResultadoTeste.APROVADO,
    dataTeste: "10/11/2024",
    observacoes: "Teste realizado com sucesso, todos os parâmetros dentro do esperado."
  },
  {
    id: 2,
    aeronaveCodigo: 1,
    tipo: TipoTeste.ELETRICO,
    resultado: ResultadoTeste.APROVADO,
    dataTeste: "08/11/2024",
    observacoes: "Sistema elétrico funcionando perfeitamente."
  },
  {
    id: 3,
    aeronaveCodigo: 2,
    tipo: TipoTeste.HIDRAULICO,
    resultado: ResultadoTeste.REPROVADO,
    dataTeste: "05/11/2024",
    observacoes: "Necessário ajuste no sistema de pressão hidráulica."
  }
];

export default function TestePage() {
  const role = useSearchParams().get("role");
  const [testes, setTestes] = useState(testesMock);
  const [testeSelecionado, setTesteSelecionado] = useState(null);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [formData, setFormData] = useState({
    aeronaveCodigo: "",
    tipo: "",
    resultado: "",
    dataTeste: "",
    observacoes: ""
  });

  const podeCadastrar = role === "admin" || role === "engenheiro" || role === "operador";
  const podeExcluir = role === "admin" || role === "engenheiro";

  const handleSelectTeste = (teste) => {
    setTesteSelecionado(teste);
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
    const novoTeste = {
      id: testes.length + 1,
      ...formData,
      aeronaveCodigo: parseInt(formData.aeronaveCodigo)
    };
    setTestes(prev => [...prev, novoTeste]);
    setShowModalCadastro(false);
    setFormData({
      aeronaveCodigo: "",
      tipo: "",
      resultado: "",
      dataTeste: "",
      observacoes: ""
    });
  };

  const handleExcluirTeste = () => {
    if (!testeSelecionado) {
      alert("Selecione um teste para excluir");
      return;
    }
    setTestes(prev => prev.filter(t => t.id !== testeSelecionado.id));
    setTesteSelecionado(null);
    setShowModalExcluir(false);
  };

  return (
    <div className={styles.pageContainer}>
      <LateralBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciamento de Testes</h1>
          <p className={styles.subtitle}>Controle completo dos testes realizados nas aeronaves</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listaContainer}>
            <div className={styles.listaHeader}>
              <h2>Testes Realizados</h2>
              <span className={styles.count}>{testes.length} testes</span>
            </div>
            
            <div className={styles.lista}>
              {testes.map(teste => (
                <div
                  key={teste.id}
                  className={`${styles.testeCard} ${
                    testeSelecionado?.id === teste.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectTeste(teste)}
                >
                  <div className={styles.testeInfo}>
                    <h3>Teste {teste.tipo}</h3>
                    <p>Aeronave: {teste.aeronaveCodigo} • {teste.dataTeste}</p>
                    <div className={styles.statusContainer}>
                      <span className={`${styles.resultado} ${
                        teste.resultado === ResultadoTeste.APROVADO ? styles.aprovado : styles.reprovado
                      }`}>
                        {teste.resultado}
                      </span>
                      <span className={`${styles.tipo} ${
                        teste.tipo === TipoTeste.ELETRICO ? styles.eletrico : 
                        teste.tipo === TipoTeste.HIDRAULICO ? styles.hidraulico : 
                        styles.aerodinamico
                      }`}>
                        {teste.tipo}
                      </span>
                    </div>
                  </div>
                  <div className={styles.observacoes}>
                    {teste.observacoes}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detalhesContainer}>
            <div className={styles.detalhesHeader}>
              <h2>Detalhes do Teste</h2>
            </div>

            {testeSelecionado ? (
              <div className={styles.detalhesContent}>
                <div className={styles.detalheItem}>
                  <label>ID:</label>
                  <span>{testeSelecionado.id}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Código da Aeronave:</label>
                  <span>{testeSelecionado.aeronaveCodigo}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Tipo de Teste:</label>
                  <span className={`${styles.tipo} ${
                    testeSelecionado.tipo === TipoTeste.ELETRICO ? styles.eletrico : 
                    testeSelecionado.tipo === TipoTeste.HIDRAULICO ? styles.hidraulico : 
                    styles.aerodinamico
                  }`}>
                    {testeSelecionado.tipo}
                  </span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Resultado:</label>
                  <span className={`${styles.resultado} ${
                    testeSelecionado.resultado === ResultadoTeste.APROVADO ? styles.aprovado : styles.reprovado
                  }`}>
                    {testeSelecionado.resultado}
                  </span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Data do Teste:</label>
                  <span>{testeSelecionado.dataTeste}</span>
                </div>
                <div className={styles.detalheItem}>
                  <label>Observações:</label>
                  <span className={styles.observacoesTexto}>{testeSelecionado.observacoes}</span>
                </div>
              </div>
            ) : (
              <div className={styles.selecionarAviso}>
                <p>Selecione um teste para visualizar os detalhes</p>
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
              Cadastrar Teste
            </button>
          )}
          {podeExcluir && (
            <button 
              className={styles.excluirButton}
              onClick={() => {
                if (!testeSelecionado) {
                  alert("Selecione um teste para excluir");
                  return;
                }
                setShowModalExcluir(true);
              }}
              disabled={!testeSelecionado}
            >
              Excluir Teste
            </button>
          )}
        </div>
      </main>

      {showModalCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Teste</h2>
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
                <label>Tipo de Teste:</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value={TipoTeste.ELETRICO}>Eletrico</option>
                  <option value={TipoTeste.HIDRAULICO}>Hidraulico</option>
                  <option value={TipoTeste.AERODINAMICO}>Aerodinamico</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Resultado:</label>
                <select
                  name="resultado"
                  value={formData.resultado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o resultado</option>
                  <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                  <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Data do Teste:</label>
                <input
                  type="text"
                  name="dataTeste"
                  value={formData.dataTeste}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 10/11/2024"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Observações:</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  required
                  placeholder="Descreva as observações do teste..."
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
              <p>Tem certeza que deseja excluir o teste:</p>
              <h3>"Teste {testeSelecionado?.tipo} - Aeronave {testeSelecionado?.aeronaveCodigo}"?</h3>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModalExcluir(false)}>
                Cancelar
              </button>
              <button 
                onClick={handleExcluirTeste}
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