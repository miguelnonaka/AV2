"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LateralBar from "../components/Lateralbar/lateralBar";
import styles from "./App.module.css";

const relatoriosMock = [
  {
    id: 1,
    aeronave: {
      codigo: 1,
      modelo: "Guerra",
      tipo: "Comercial",
      capacidade: 20,
      alcance: "2000km"
    },
    cliente: "Emra",
    dataEntrega: "2056-10-08",
    etapas: [
      {
        id: 1,
        nome: "Etapa inicial",
        prazo: "20/05/2026",
        status: "Pendente"
      }
    ],
    pecas: [
      {
        id: 1,
        nome: "Motor CFM56-7B",
        tipo: "Importada",
        fornecedor: "General Electric",
        status: "Em transporte"
      }
    ],
    testes: [
      {
        id: 1,
        tipo: "Aerodinamico",
        resultado: "Aprovado"
      }
    ]
  },
  {
    id: 2,
    aeronave: {
      codigo: 2,
      modelo: "Airbus A320",
      tipo: "Comercial", 
      capacidade: 180,
      alcance: "6100km"
    },
    cliente: "Latam Airlines",
    dataEntrega: "2024-12-15",
    etapas: [
      {
        id: 1,
        nome: "Montagem Inicial",
        prazo: "10/11/2024",
        status: "Em andamento"
      }
    ],
    pecas: [
      {
        id: 1,
        nome: "Asa Direita",
        tipo: "Nacional",
        fornecedor: "Embraer",
        status: "Pronta"
      }
    ],
    testes: [
      {
        id: 1,
        tipo: "Eletrico",
        resultado: "Aprovado"
      }
    ]
  }
];

export default function RelatorioPage() {
  const role = useSearchParams().get("role");
  const [relatorios, setRelatorios] = useState(relatoriosMock);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [showModalExcluir, setShowModalExcluir] = useState(false);

  const podeExcluir = role === "admin" || role === "engenheiro";

  const handleSelectRelatorio = (relatorio) => {
    setRelatorioSelecionado(relatorio);
  };

  const handleExcluirRelatorio = () => {
    if (!relatorioSelecionado) {
      alert("Selecione um relatório para excluir");
      return;
    }
    setRelatorios(prev => prev.filter(r => r.id !== relatorioSelecionado.id));
    setRelatorioSelecionado(null);
    setShowModalExcluir(false);
  };

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className={styles.pageContainer}>
      <LateralBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Relatórios de Entrega</h1>
          <p className={styles.subtitle}>Visualização completa dos relatórios de entrega das aeronaves</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listaContainer}>
            <div className={styles.listaHeader}>
              <h2>Relatórios Gerados</h2>
              <span className={styles.count}>{relatorios.length} relatórios</span>
            </div>
            
            <div className={styles.lista}>
              {relatorios.map(relatorio => (
                <div
                  key={relatorio.id}
                  className={`${styles.relatorioCard} ${
                    relatorioSelecionado?.id === relatorio.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectRelatorio(relatorio)}
                >
                  <div className={styles.relatorioInfo}>
                    <h3>Relatório #{relatorio.id}</h3>
                    <p>Aeronave: {relatorio.aeronave.codigo} - {relatorio.aeronave.modelo}</p>
                    <p>Cliente: {relatorio.cliente}</p>
                    <div className={styles.statusContainer}>
                      <span className={styles.data}>
                        Entrega: {formatarData(relatorio.dataEntrega)}
                      </span>
                      <span className={`${styles.status} ${
                        relatorio.testes.every(t => t.resultado === "Aprovado") ? 
                        styles.aprovado : styles.reprovado
                      }`}>
                        {relatorio.testes.every(t => t.resultado === "Aprovado") ? 
                         "Pronto para entrega" : "Aguardando ajustes"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detalhesContainer}>
            <div className={styles.detalhesHeader}>
              <h2>Detalhes do Relatório</h2>
            </div>

            {relatorioSelecionado ? (
              <div className={styles.relatorioContent}>
                <div className={styles.relatorioHeader}>
                  <h3>===== RELATÓRIO DE ENTREGA =====</h3>
                </div>

                <div className={styles.secao}>
                  <h4>Aeronave: {relatorioSelecionado.aeronave.codigo} - {relatorioSelecionado.aeronave.modelo}</h4>
                  <div className={styles.infoGrid}>
                    <span>Tipo: {relatorioSelecionado.aeronave.tipo}</span>
                    <span>Capacidade: {relatorioSelecionado.aeronave.capacidade}</span>
                    <span>Alcance: {relatorioSelecionado.aeronave.alcance}</span>
                  </div>
                </div>

                <div className={styles.secao}>
                  <div className={styles.infoGrid}>
                    <span>Cliente: {relatorioSelecionado.cliente}</span>
                    <span>Data de Entrega: {formatarData(relatorioSelecionado.dataEntrega)}</span>
                  </div>
                </div>

                <div className={styles.secao}>
                  <h4>== Etapas ==</h4>
                  {relatorioSelecionado.etapas.map((etapa, index) => (
                    <div key={etapa.id} className={styles.itemLista}>
                      <span className={styles.itemNumero}>{index + 1}.</span>
                      <span className={styles.itemNome}>{etapa.nome}</span>
                      <span className={styles.itemDetalhe}>| Prazo: {etapa.prazo}</span>
                      <span className={`${styles.itemStatus} ${
                        etapa.status === "Concluída" ? styles.concluida :
                        etapa.status === "Em andamento" ? styles.andamento :
                        styles.pendente
                      }`}>
                        | Status: {etapa.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.secao}>
                  <h4>== Peças ==</h4>
                  {relatorioSelecionado.pecas.map((peca, index) => (
                    <div key={peca.id} className={styles.itemLista}>
                      <span className={styles.itemBullet}>-</span>
                      <span className={styles.itemNome}>{peca.nome}</span>
                      <span className={styles.itemDetalhe}>| Tipo: {peca.tipo}</span>
                      {peca.fornecedor && (
                        <span className={styles.itemDetalhe}>| Fornecedor: {peca.fornecedor}</span>
                      )}
                      <span className={`${styles.itemStatus} ${
                        peca.status === "Pronta" ? styles.pronta :
                        peca.status === "Em produção" ? styles.producao :
                        styles.transporte
                      }`}>
                        | Status: {peca.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.secao}>
                  <h4>== Testes ==</h4>
                  {relatorioSelecionado.testes.map((teste, index) => (
                    <div key={teste.id} className={styles.itemLista}>
                      <span className={styles.itemBullet}>-</span>
                      <span className={styles.itemNome}>{teste.tipo}</span>
                      <span className={`${styles.itemResultado} ${
                        teste.resultado === "Aprovado" ? styles.aprovado : styles.reprovado
                      }`}>
                        =&gt; {teste.resultado}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.relatorioFooter}>
                  <h3>===============================</h3>
                </div>
              </div>
            ) : (
              <div className={styles.selecionarAviso}>
                <p>Selecione um relatório para visualizar os detalhes</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {podeExcluir && (
            <button 
              className={styles.excluirButton}
              onClick={() => {
                if (!relatorioSelecionado) {
                  alert("Selecione um relatório para excluir");
                  return;
                }
                setShowModalExcluir(true);
              }}
              disabled={!relatorioSelecionado}
            >
              Excluir Relatório
            </button>
          )}
        </div>
      </main>

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
              <p>Tem certeza que deseja excluir o relatório:</p>
              <h3>"Relatório #{relatorioSelecionado?.id} - {relatorioSelecionado?.aeronave.modelo}"?</h3>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModalExcluir(false)}>
                Cancelar
              </button>
              <button 
                onClick={handleExcluirRelatorio}
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