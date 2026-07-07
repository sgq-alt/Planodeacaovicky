import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

// --- ICONOGRAFIA SVG ROBUSTA E PERSONALIZADA ---
const ClockIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ListChecksIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 6h9M13 12h9M13 18h9M3 6.5L4.5 8 8 4.5M3 12.5l1.5 1.5L8 10.5M3 18.5l1.5 1.5L8 16.5" />
  </svg>
);

const PlusCircleIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const Trash2Icon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PrinterIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const CloudLightningIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58" />
    <polyline points="13 11 9 17 12 17 11 23 15 17 12 17" />
  </svg>
);

const InfoIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Loader2Icon = ({ className }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const AlertTriangleIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const FolderPlusIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "",
        authDomain: "vickytex-cronoanalise.firebaseapp.com",
        projectId: "vickytex-cronoanalise",
        storageBucket: "vickytex-cronoanalise.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef",
      };

let app = null;
let auth = null;
let db = null;
let firebaseEnabled = false;

try {
  const isConfigValid =
    firebaseConfig &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim() !== "";
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    firebaseEnabled = true;
  }
} catch (error) {
  console.warn(
    "Firebase offline ou chave ausente. Rodando no Modo Local Seguro (LocalStorage).",
    error
  );
}

const appId = typeof __app_id !== "undefined" ? __app_id : "vickytex-crono";

// Modelos Iniciais Padrão de Engenharia Têxtil (Incluindo os Planos de Ação Iniciais)
const DEFAULT_MAPS = {
  processo_costura_polo: {
    id: "processo_costura_polo",
    metaData: {
      process: "Montagem de Gola & Ombro - Polo",
      analyst: "Equipe de Engenharia Têxtil",
      factory: "Facção Têxtil Modelo",
      date: "2026-07-06",
    },
    rowsData: [
      {
        id: 1,
        etapa: "Recebimento e conferência de lote (Romaneio)",
        responsavel: "Auxiliar de Recebimento",
        tipo: "IP",
        tempo: 0.0333,
        insumos: "Prancheta, Ficha Técnica",
        critica: "Verificar se grade de tamanhos está correta",
      },
      {
        id: 2,
        etapa: "Abastecimento do posto com amarrados",
        responsavel: "Abastecedor",
        tipo: "TR",
        tempo: 0.0125,
        insumos: "Carrinho Gaiola",
        critica:
          "Mistura de tonalidades no mesmo amarrado (Risco de Bicromaticidade)",
      },
      {
        id: 3,
        etapa: "Costura de Ombro a Ombro (Overloque + Fita)",
        responsavel: "Costureira Ombrista",
        tipo: "OP",
        tempo: 0.0085,
        insumos: "Overloque de 3 cabos, Fita reforço",
        critica: "Não tensionar a fita para não dar franzido no ombro",
      },
      {
        id: 4,
        etapa: "Inspeção Visual por amostragem",
        responsavel: "Revisora de Linha",
        tipo: "IP",
        tempo: 0.011,
        insumos: "Mesa de Revisão",
        critica: "Controle de saltos de ponto e estiramento de costura",
      },
      {
        id: 5,
        etapa: "Aguardando aprovação de segunda qualidade",
        responsavel: "Supervisor",
        tipo: "ES",
        tempo: 0.05,
        insumos: "Formulário de Desvio",
        critica: "Gargalo físico na bancada - Lead time estagnado",
      },
    ],
    actionsData: [
      {
        id: 1,
        acao: "Implementar dispositivo de dobra automática na máquina overloque",
        setor: "Facção Externa",
        responsavel: "Mecânico de Manutenção",
        dataInicio: "2026-07-08",
        dataFim: "2026-07-15",
        status: "Em Andamento",
      },
      {
        id: 2,
        acao: "Elaborar POP de amarração por tom de tintura para evitar bicromaticidade",
        setor: "Logística / Recebimento",
        responsavel: "Analista de Processos",
        dataInicio: "2026-07-06",
        dataFim: "2026-07-10",
        status: "Concluído",
      },
      {
        id: 3,
        acao: "Criar painel visual Kanban físico para aprovação de segunda qualidade",
        setor: "Qualidade",
        responsavel: "Supervisor de Produção",
        dataInicio: "2026-07-12",
        dataFim: "2026-07-20",
        status: "Não Iniciado",
      },
    ],
  },
  processo_estamparia_local: {
    id: "processo_estamparia_local",
    metaData: {
      process: "Fluxo de Silk-Screen em Peças Cortadas",
      analyst: "Mapeador Têxtil Sênior",
      factory: "Estamparia SilkArt",
      date: "2026-07-06",
    },
    rowsData: [
      {
        id: 1,
        etapa: "Separação e registro das frentes de camisetas",
        responsavel: "Operador de Mesa",
        tipo: "OP",
        tempo: 0.015,
        insumos: "Ficha Técnica, Berço",
        critica: "Alinhamento no berço térmico para evitar estampa torta",
      },
      {
        id: 2,
        etapa: "Aplicação da primeira demão de Plastisol",
        responsavel: "Impressor Silk",
        tipo: "OP",
        tempo: 0.005,
        insumos: "Rodo Poliuretano, Tela 77 fios",
        critica: "Pressão uniforme para cobertura homogênea",
      },
      {
        id: 3,
        etapa: "Pré-cura rápida (Flash Cure)",
        responsavel: "Ajudante de Estampa",
        tipo: "TR",
        tempo: 0.003,
        insumos: "Soprador Térmico",
        critica: "Não exceder tempo de cura para não queimar o tecido",
      },
      {
        id: 4,
        etapa: "Inspeção visual e toque",
        responsavel: "Revisor Técnico",
        tipo: "IP",
        tempo: 0.004,
        insumos: "Lupa Conta-Fios",
        critica: "Procurar furos na emulsão ou migração de cor",
      },
    ],
    actionsData: [
      {
        id: 1,
        acao: "Comprar calibrador de berço térmico regulável por sensor de presença",
        setor: "Estamparia",
        responsavel: "Engenheiro de Compras",
        dataInicio: "2026-07-10",
        dataFim: "2026-07-25",
        status: "Não Iniciado",
      },
    ],
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(
    firebaseEnabled ? "connecting" : "local"
  );

  // --- GERENCIADOR DE PROCESSOS ---
  const [processList, setProcessList] = useState([]);
  const [activeProcessId, setActiveProcessId] = useState("");

  // --- DADOS DO PROCESSO ATIVO ---
  const [metaData, setMetaData] = useState({
    process: "Novo Processo Têxtil",
    analyst: "",
    factory: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [rowsData, setRowsData] = useState([
    {
      id: 1,
      etapa: "Primeira etapa operacional",
      responsavel: "Operador",
      tipo: "OP",
      tempo: 0.01,
      insumos: "Ficha Técnica",
      critica: "Ponto de atenção inicial",
    },
  ]);

  // NOVO ESTADO: Plano de Ação
  const [actionsData, setActionsData] = useState([
    {
      id: 1,
      acao: "Criar plano de ação corretivo",
      setor: "Engenharia",
      responsavel: "Responsável",
      dataInicio: new Date().toISOString().split("T")[0],
      dataFim: new Date().toISOString().split("T")[0],
      status: "Não Iniciado",
    },
  ]);

  // Estados de Controle de UI
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
  });
  const [newProcessModal, setNewProcessModal] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // --- CARREGAMENTO INICIAL DE CONFIGURAÇÕES E LISTAS ---
  useEffect(() => {
    try {
      const cachedList = localStorage.getItem("vickytex_process_list");
      const cachedActive = localStorage.getItem("vickytex_active_id");

      if (cachedList) {
        const parsedList = JSON.parse(cachedList);
        setProcessList(parsedList);
        if (cachedActive) {
          setActiveProcessId(cachedActive);
          const cachedData = localStorage.getItem(
            `vickytex_process_data_${cachedActive}`
          );
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            setMetaData(parsedData.metaData);
            setRowsData(parsedData.rowsData);
            setActionsData(parsedData.actionsData || []);
          }
        }
      } else {
        // Se estiver completamente limpo, inicializa com os modelos padrão de Engenharia Vickytex
        const initialList = Object.keys(DEFAULT_MAPS).map((key) => ({
          id: key,
          name: DEFAULT_MAPS[key].metaData.process,
        }));
        setProcessList(initialList);
        setActiveProcessId(initialList[0].id);
        setMetaData(DEFAULT_MAPS[initialList[0].id].metaData);
        setRowsData(DEFAULT_MAPS[initialList[0].id].rowsData);
        setActionsData(DEFAULT_MAPS[initialList[0].id].actionsData || []);

        // Cacheia-os
        localStorage.setItem(
          "vickytex_process_list",
          JSON.stringify(initialList)
        );
        localStorage.setItem("vickytex_active_id", initialList[0].id);
        initialList.forEach((item) => {
          localStorage.setItem(
            `vickytex_process_data_${item.id}`,
            JSON.stringify(DEFAULT_MAPS[item.id])
          );
        });
      }
    } catch (e) {
      console.warn("Erro ao ler dados no cache do LocalStorage:", e);
    }
  }, []);

  // --- AUTENTICAÇÃO SECURE NO FIREBASE ---
  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setAuthLoading(false);
      setSyncStatus("local");
      return;
    }

    const initAuth = async () => {
      try {
        setAuthLoading(true);
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Erro ao autenticar no Firestore:", error);
        setSyncStatus("local");
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // --- SINCRONIZAÇÃO EM TEMPO REAL MULTI-PROCESSO ---
  useEffect(() => {
    if (!firebaseEnabled || !db || !user || !activeProcessId) {
      setSyncStatus("local");
      return;
    }

    setSyncStatus("connecting");

    // Escuta em tempo real o documento específico deste mapeamento no Firestore
    const docRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "cronoanalises",
      activeProcessId
    );

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.metaData) setMetaData(data.metaData);
          if (data.rowsData) setRowsData(data.rowsData);
          if (data.actionsData) setActionsData(data.actionsData);
          setSyncStatus("synced");
        } else {
          // Se não existir na nuvem, fazemos o upload inicial dos dados locais
          saveData(metaData, rowsData, actionsData, activeProcessId);
        }
      },
      (error) => {
        console.error("Erro ao sincronizar com o Firestore:", error);
        setSyncStatus("local");
      }
    );

    return () => unsubscribe();
  }, [user, activeProcessId]);

  // --- ESCUTADOR GERAL DE LISTA DE PROCESSOS NA NUVEM ---
  useEffect(() => {
    if (!firebaseEnabled || !db || !user) return;

    // Escuta a lista mestre de mapeamentos para alimentar o seletor dinâmico
    const docListRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "cronoanalises",
      "index_list"
    );

    const unsubscribe = onSnapshot(
      docListRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.list) {
            setProcessList(data.list);
            localStorage.setItem(
              "vickytex_process_list",
              JSON.stringify(data.list)
            );
          }
        }
      },
      (error) => {
        console.warn(
          "Sem acesso ao index_list na nuvem, utilizando local.",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --- SALVAMENTO INTEGRADO E HÍBRIDO (AUTO-SAVE COMPLETO) ---
  const saveData = async (
    currentMeta,
    currentRows,
    currentActions,
    targetId
  ) => {
    const activeId = targetId || activeProcessId;
    if (!activeId) return;

    setSyncStatus("saving");

    const actionsToSave = currentActions || actionsData;

    // 1. Salva no LocalStorage para redundância à prova de falhas de rede no chão de fábrica
    try {
      localStorage.setItem(
        `vickytex_process_data_${activeId}`,
        JSON.stringify({
          id: activeId,
          metaData: currentMeta,
          rowsData: currentRows,
          actionsData: actionsToSave,
        })
      );
      localStorage.setItem("vickytex_active_id", activeId);
    } catch (e) {
      console.warn("Erro ao salvar dados localmente:", e);
    }

    // 2. Tenta persistência na nuvem (Firestore)
    if (!firebaseEnabled || !db || !auth || !auth.currentUser) {
      setSyncStatus("local");
      return;
    }

    try {
      const docRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "cronoanalises",
        activeId
      );
      await setDoc(docRef, {
        id: activeId,
        metaData: currentMeta,
        rowsData: currentRows,
        actionsData: actionsToSave,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid,
      });
      setSyncStatus("synced");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      setSyncStatus("local");
    }
  };

  // --- CRIAR NOVO MAPEAMENTO (Criação de novos itens) ---
  const handleCreateNewProcess = async (e) => {
    e.preventDefault();
    if (!newProcessName.trim()) {
      showModal(
        "Nome Inválido",
        "Por favor, defina um título para o mapeamento.",
        "warning"
      );
      return;
    }

    const newId = `processo_${Date.now()}`;
    const cleanMeta = {
      process: newProcessName.trim(),
      analyst: metaData.analyst || "",
      factory: "",
      date: new Date().toISOString().split("T")[0],
    };
    const cleanRows = [
      {
        id: 1,
        etapa: "Conferência inicial de grade",
        responsavel: "Revisor",
        tipo: "IP",
        tempo: 0.01,
        insumos: "Ficha Técnica",
        critica: "Verificar qualidade geral",
      },
    ];
    const cleanActions = [
      {
        id: 1,
        acao: "Ação corretiva preventiva para início do fluxo",
        setor: "Engenharia",
        responsavel: metaData.analyst || "Analista",
        dataInicio: new Date().toISOString().split("T")[0],
        dataFim: new Date().toISOString().split("T")[0],
        status: "Não Iniciado",
      },
    ];

    // Atualiza a lista local de processos
    const updatedList = [
      ...processList,
      { id: newId, name: cleanMeta.process },
    ];
    setProcessList(updatedList);
    setActiveProcessId(newId);
    setMetaData(cleanMeta);
    setRowsData(cleanRows);
    setActionsData(cleanActions);
    setNewProcessModal(false);
    setNewProcessName("");

    // Cacheia a lista e o novo mapeamento no LocalStorage
    localStorage.setItem("vickytex_process_list", JSON.stringify(updatedList));
    localStorage.setItem("vickytex_active_id", newId);

    // Salva na nuvem e atualiza a lista de índice
    await saveData(cleanMeta, cleanRows, cleanActions, newId);
    await syncProcessIndex(updatedList);

    showModal(
      "Mapeamento Criado",
      `"${cleanMeta.process}" foi inicializado com sucesso e está ativo para edição.`,
      "success"
    );
  };

  const syncProcessIndex = async (listToSync) => {
    if (!firebaseEnabled || !db || !auth || !auth.currentUser) return;
    try {
      const docListRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "cronoanalises",
        "index_list"
      );
      await setDoc(docListRef, { list: listToSync });
    } catch (e) {
      console.error("Erro ao sincronizar índice na nuvem:", e);
    }
  };

  // --- ALTERAR PROCESSO ATIVO ---
  const handleSelectProcess = (id) => {
    if (id === activeProcessId) return;
    setActiveProcessId(id);

    try {
      const cachedData = localStorage.getItem(`vickytex_process_data_${id}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setMetaData(parsed.metaData);
        setRowsData(parsed.rowsData);
        setActionsData(parsed.actionsData || []);
      }
      localStorage.setItem("vickytex_active_id", id);
    } catch (e) {
      console.warn("Erro ao ler processo do cache local:", e);
    }
  };

  // --- EXCLUSÃO COMPLETA DE UM MAPEAMENTO ---
  const handleDeleteProcess = async () => {
    if (processList.length <= 1) {
      showModal(
        "Bloqueado",
        "Você deve manter ao menos um mapeamento ativo no sistema.",
        "warning"
      );
      setConfirmDelete(false);
      return;
    }

    const idToDelete = activeProcessId;
    const remainingList = processList.filter((p) => p.id !== idToDelete);
    const nextActive = remainingList[0];

    setProcessList(remainingList);
    handleSelectProcess(nextActive.id);
    setConfirmDelete(false);

    try {
      localStorage.removeItem(`vickytex_process_data_${idToDelete}`);
      localStorage.setItem(
        "vickytex_process_list",
        JSON.stringify(remainingList)
      );
    } catch (e) {
      console.warn(e);
    }

    if (firebaseEnabled && db && auth && auth.currentUser) {
      try {
        const docRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "cronoanalises",
          idToDelete
        );
        await deleteDoc(docRef);
        await syncProcessIndex(remainingList);
      } catch (error) {
        console.error("Erro ao deletar do Firestore:", error);
      }
    }

    showModal(
      "Mapeamento Excluído",
      "O processo foi removido definitivamente do banco de dados.",
      "info"
    );
  };

  // --- CONTROLES DE CAMPOS DE INTERAÇÃO ---
  const handleMetaChange = (field, value) => {
    const updatedMeta = { ...metaData, [field]: value };
    setMetaData(updatedMeta);

    if (field === "process" && value.trim()) {
      const updatedList = processList.map((item) =>
        item.id === activeProcessId ? { ...item, name: value.trim() } : item
      );
      setProcessList(updatedList);
      localStorage.setItem(
        "vickytex_process_list",
        JSON.stringify(updatedList)
      );
      syncProcessIndex(updatedList);
    }

    saveData(updatedMeta, rowsData, actionsData, activeProcessId);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rowsData];
    updatedRows[index][field] = value;
    setRowsData(updatedRows);
    saveData(metaData, updatedRows, actionsData, activeProcessId);
  };

  // Alteração dinâmica das ações do Plano de Ação
  const handleActionChange = (index, field, value) => {
    const updatedActions = [...actionsData];
    updatedActions[index][field] = value;
    setActionsData(updatedActions);
    saveData(metaData, rowsData, updatedActions, activeProcessId);
  };

  // --- OPERAÇÕES DA TABELA DE CRONOANÁLISE ---
  const addRow = () => {
    const nextId =
      rowsData.length > 0 ? Math.max(...rowsData.map((r) => r.id)) + 1 : 1;
    const newRow = {
      id: nextId,
      etapa: "",
      responsavel: "",
      tipo: "OP",
      tempo: 0.0,
      insumos: "",
      critica: "",
    };
    const updatedRows = [...rowsData, newRow];
    setRowsData(updatedRows);
    saveData(metaData, updatedRows, actionsData, activeProcessId);
  };

  const removeRow = (index) => {
    const updatedRows = [...rowsData];
    updatedRows.splice(index, 1);
    updatedRows.forEach((row, i) => (row.id = i + 1));
    setRowsData(updatedRows);
    saveData(metaData, updatedRows, actionsData, activeProcessId);
  };

  // --- OPERAÇÕES DO PLANO DE AÇÃO ---
  const addAction = () => {
    const nextId =
      actionsData.length > 0
        ? Math.max(...actionsData.map((a) => a.id)) + 1
        : 1;
    const newAction = {
      id: nextId,
      acao: "",
      setor: "",
      responsavel: "",
      dataInicio: new Date().toISOString().split("T")[0],
      dataFim: new Date().toISOString().split("T")[0],
      status: "Não Iniciado",
    };
    const updatedActions = [...actionsData, newAction];
    setActionsData(updatedActions);
    saveData(metaData, rowsData, updatedActions, activeProcessId);
  };

  const removeAction = (index) => {
    const updatedActions = [...actionsData];
    updatedActions.splice(index, 1);
    updatedActions.forEach((act, i) => (act.id = i + 1));
    setActionsData(updatedActions);
    saveData(metaData, rowsData, updatedActions, activeProcessId);
  };

  const executeClearSheet = () => {
    const emptyRow = [
      {
        id: 1,
        etapa: "",
        responsavel: "",
        tipo: "OP",
        tempo: 0.0,
        insumos: "",
        critica: "",
      },
    ];
    const emptyAction = [
      {
        id: 1,
        acao: "",
        setor: "",
        responsavel: "",
        dataInicio: new Date().toISOString().split("T")[0],
        dataFim: new Date().toISOString().split("T")[0],
        status: "Não Iniciado",
      },
    ];
    setRowsData(emptyRow);
    setActionsData(emptyAction);
    setConfirmClear(false);
    saveData(metaData, emptyRow, emptyAction, activeProcessId);
    showModal(
      "Tabela Limpa",
      "O fluxo e o plano de ação foram resetados.",
      "info"
    );
  };

  // --- CÁLCULO DE MÉTRICAS LEAN ---
  const calculateMetrics = () => {
    let totalTime = 0;
    let opTime = 0;
    const totalSteps = rowsData.length;

    rowsData.forEach((row) => {
      const rowTempo = parseFloat(row.tempo) || 0;
      totalTime += rowTempo;
      if (row.tipo === "OP") {
        opTime += rowTempo;
      }
    });

    const valueAddedPercent =
      totalTime > 0 ? ((opTime / totalTime) * 100).toFixed(1) : "0.0";
    const totalMinutes = (totalTime * 60).toFixed(2);

    return {
      totalTime:
        totalTime.toLocaleString("pt-PT", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }) + "h",
      totalMinutes: totalMinutes + " min",
      valueAddedPercent: valueAddedPercent + "%",
      totalSteps,
    };
  };

  const metrics = calculateMetrics();

  // --- EXPORTAR PARA EXCEL (CSV Premium com Cronoanálise + Plano de Ação 5W2H) ---
  const exportToCSV = () => {
    if (
      rowsData.length === 0 ||
      (rowsData.length === 1 && rowsData[0].etapa === "")
    ) {
      showModal(
        "Exportação Vazia",
        "Preencha pelo menos uma linha para realizar a exportação.",
        "warning"
      );
      return;
    }

    const processName = metaData.process || "Mapeamento_Processo";
    const analyst = metaData.analyst || "Nao_Identificado";
    const factory = metaData.factory || "Geral";
    const date = metaData.date || "Sem_Data";

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM para compatibilidade com o MS Excel em português

    // 1. Cabeçalho Executivo
    csvContent += `=========================================================================\r\n`;
    csvContent += `VICKYTEX S.A. - RELATORIO INTEGRADO DE CRONOANALISE E PLANO DE ACAO\r\n`;
    csvContent += `=========================================================================\r\n`;
    csvContent += `PROCESSO:;${processName}\r\n`;
    csvContent += `ANALISTA DE PROCESSOS:;${analyst}\r\n`;
    csvContent += `FACCAO / POSTO DE TRABALHO:;${factory}\r\n`;
    csvContent += `DATA DO MAPEAMENTO:;${date}\r\n`;
    csvContent += `-------------------------------------------------------------------------\r\n`;

    // 2. Quadro Resumo de KPIs do Processo
    csvContent += `QUADRO DE METRICAS OPERACIONAIS (KPIs):\r\n`;
    csvContent += `TEMPO DE CICLO TOTAL:;${metrics.totalTime} (ou ${metrics.totalMinutes})\r\n`;
    csvContent += `EFICIENCIA LEAN (AGREGA VALOR - OP):;${metrics.valueAddedPercent}\r\n`;
    csvContent += `TOTAL DE OPERACOES MAPEADAS:;${metrics.totalSteps}\r\n`;
    csvContent += `=========================================================================\r\n\r\n`;

    // 3. Tabela de Cronoanálise
    csvContent += `1. CRONOANALISE - MAPEAMENTO DE TEMPOS DE CAMPO\r\n`;
    csvContent +=
      "ID;Etapa / Operacao do Processo;Executor / Posto;Classificacao Lean;Tempo de Ciclo (horas);Materiais / Insumos;Ponto Critico de Qualidade e Desvio\r\n";

    rowsData.forEach((row) => {
      const etapaClean = (row.etapa || "").replace(/;/g, ",").trim();
      const respClean = (row.responsavel || "").replace(/;/g, ",").trim();
      const insumosClean = (row.insumos || "").replace(/;/g, ",").trim();
      const criticaClean = (row.critica || "").replace(/;/g, ",").trim();
      const formattedTempo =
        typeof row.tempo === "number"
          ? row.tempo.toFixed(4).replace(".", ",")
          : "0,0000";

      csvContent += `${row.id};"${etapaClean}";"${respClean}";"${row.tipo}";${formattedTempo};"${insumosClean}";"${criticaClean}"\r\n`;
    });

    csvContent += `\r\n\r\n`;

    // 4. Tabela de Plano de Ação 5W2H
    csvContent += `2. PLANO DE ACAO CORRETIVA (5W2H)\r\n`;
    csvContent += `ID;Acao Recomendada (O que);Setor / Faccao;Responsavel (Quem);Data de Inicio;Prazo (Ate);Status Operacional\r\n`;

    actionsData.forEach((act) => {
      const acaoClean = (act.acao || "").replace(/;/g, ",").trim();
      const setorClean = (act.setor || "").replace(/;/g, ",").trim();
      const respClean = (act.responsavel || "").replace(/;/g, ",").trim();

      csvContent += `${act.id};"${acaoClean}";"${setorClean}";"${respClean}";"${act.dataInicio}";"${act.dataFim}";"${act.status}"\r\n`;
    });

    const fileName = `${processName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")}_estudo_completo.csv`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showModal(
      "Relatório de Melhoria Concluído",
      "Cronoanálise e Plano de Ação consolidados foram enviados de forma unificada para o seu arquivo Excel.",
      "success"
    );
  };

  const showModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans">
      {/* CSS Exclusivo para Formatação de Impressão de Engenharia de Processos */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, footer, .no-print {
            display: none !important;
          }
          .print-full {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin-bottom: 20px !important;
          }
          .signature-area {
            display: flex !important;
            justify-content: space-between !important;
            margin-top: 50px !important;
            padding: 10px 40px !important;
            page-break-inside: avoid;
          }
        }
        .signature-area {
          display: none;
        }
      `}</style>

      {/* CABEÇALHO INTEGRADO COM SISTEMA DE NUVEM SEGURO */}
      <header className="bg-[#1E3A8A] text-white shadow-md border-b-4 border-[#0F766E] px-6 py-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
              <svg
                className="w-8 h-8 text-[#0F766E]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
                VICKYTEX
                <span className="text-xs bg-[#0F766E] px-2.5 py-0.5 rounded font-semibold text-[#10B981] flex items-center gap-1">
                  <CloudLightningIcon className="w-3.5 h-3.5" />{" "}
                  {syncStatus === "local"
                    ? "Modo Offline Ativo"
                    : "Live Sync Ativo"}
                </span>
              </h1>
              <p className="text-xs text-slate-300 uppercase tracking-widest">
                Excelência Operacional & Engenharia de Processos
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <span className="bg-[#0F766E] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5" /> Folha de Cronoanálise v2.6
            </span>
            <div className="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5">
              {syncStatus === "connecting" && (
                <>
                  <Loader2Icon className="w-3 h-3 text-amber-400" />
                  <span>Sincronizando com a base de dados...</span>
                </>
              )}
              {syncStatus === "saving" && (
                <>
                  <Loader2Icon className="w-3 h-3 text-teal-400 animate-spin" />
                  <span className="text-teal-300 font-medium">
                    Salvamento automático ativo...
                  </span>
                </>
              )}
              {syncStatus === "synced" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse"></span>
                  <span className="text-[#10B981] font-semibold">
                    Tudo Salvo na Nuvem
                  </span>
                </>
              )}
              {syncStatus === "local" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block animate-pulse"></span>
                  <span className="text-blue-300 font-medium">
                    Salvo em cache local (Segurança)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* PAINEL TÁTICO / ÁREA PRINCIPAL */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 print-full">
        {/* CABEÇALHO EXCLUSIVO PARA IMPRESSÃO / PDF */}
        <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-slate-950">
                VICKYTEX S/A
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Divisão de Engenharia de Processos & Tempos Lean
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold border border-slate-400 px-3 py-1 rounded">
                DOCUMENTO OFICIAL DE ENGENHARIA DE PROCESSO
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Gerado pelo Vickytex Crono Inteligente
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLE DE GERENCIAMENTO DE PROCESSOS (Criar Novos Itens) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4 no-print print-card">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-blue-50 text-[#1E3A8A] p-2 rounded-lg">
              <BriefcaseIcon className="w-5 h-5" />
            </div>
            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Mapeamento Ativo
              </label>
              <select
                value={activeProcessId}
                onChange={(e) => handleSelectProcess(e.target.value)}
                className="w-full md:w-80 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
              >
                {processList.map((proc) => (
                  <option key={proc.id} value={proc.id}>
                    {proc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setNewProcessModal(true)}
              className="bg-[#0F766E] hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <FolderPlusIcon className="w-4 h-4" /> Criar Novo Processo
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Trash2Icon className="w-4 h-4" /> Excluir Este Processo
            </button>
          </div>
        </div>

        {/* METADADOS DO PROCESSO - INTERATIVO E EDITÁVEL */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-card">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              Processo Mapeado <span className="text-red-500 no-print">*</span>
            </label>
            <input
              type="text"
              value={metaData.process}
              onChange={(e) => handleMetaChange("process", e.target.value)}
              placeholder="Ex: Retorno de Costura Externa"
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition print:border-none print:bg-white print:p-0 print:text-base print:font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Analista de Processos (Você)
            </label>
            <input
              type="text"
              value={metaData.analyst}
              onChange={(e) => handleMetaChange("analyst", e.target.value)}
              placeholder="Seu nome completo"
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition print:border-none print:bg-white print:p-0 print:text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Facção / Posto de Trabalho
            </label>
            <input
              type="text"
              value={metaData.factory}
              onChange={(e) => handleMetaChange("factory", e.target.value)}
              placeholder="Ex: Oficina Confecções Silva"
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition print:border-none print:bg-white print:p-0 print:text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Data da Recolha de Campo
            </label>
            <input
              type="date"
              value={metaData.date}
              onChange={(e) => handleMetaChange("date", e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition font-mono print:border-none print:bg-white print:p-0"
            />
          </div>
        </div>

        {/* DASHBOARD DE ATIVIDADES & MÉTRICAS LEAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tempo Total de Ciclo */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition print-card">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tempo Total de Ciclo
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-[#1E3A8A] mt-1 font-mono">
                {metrics.totalTime}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <ClockIcon className="w-3.5 h-3.5 text-blue-500" /> Equivalente
                a {metrics.totalMinutes}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-[#1E3A8A] print:bg-white">
              <ClockIcon className="w-8 h-8" />
            </div>
          </div>

          {/* Card 2: Valor Agregado Lean */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition print-card">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Eficiência Lean (Valor - OP)
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-[#0F766E] mt-1 font-mono">
                {metrics.valueAddedPercent}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Foco no controle de gargalos de costura e espera
              </p>
            </div>
            <div className="bg-teal-50 p-3 rounded-xl text-[#0F766E] print:bg-white">
              <TrendingUpIcon className="w-8 h-8" />
            </div>
          </div>

          {/* Card 3: Total de Etapas Sequenciadas */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition print-card">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Etapas Mapeadas
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-700 mt-1 font-mono">
                {metrics.totalSteps}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sequenciamento cronometrado em campo
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 print:bg-white">
              <ListChecksIcon className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* TABELA DE CRONOANÁLISE INTERATIVA - ESTILO EXCEL COMPACTA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-slate-300">
          {/* Barra de Controle de Ações da Tabela */}
          <div className="bg-[#FAF8F5] px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center no-print">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0F766E] animate-pulse"></span>
              <h2 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
                1. Fluxo Sequencial das Operações Cronometradas
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={addRow}
                className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircleIcon className="w-4 h-4" /> Adicionar Operação
              </button>
              <button
                onClick={() => setConfirmClear(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-red-600 hover:text-red-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <Trash2Icon className="w-4 h-4" /> Limpar Dados
              </button>
              <button
                onClick={exportToCSV}
                className="bg-[#0F766E] hover:bg-teal-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <DownloadIcon className="w-4 h-4" /> Exportar Planilha Estética
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-700 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <PrinterIcon className="w-4 h-4" /> Imprimir Relatório Oficial
              </button>
            </div>
          </div>

          {/* Renderização da Tabela de Dados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 print:bg-slate-100 print:text-black">
                  <th className="py-3 px-3 border-r border-slate-700 text-center w-12 print:border-slate-300">
                    ID
                  </th>
                  <th className="py-3 px-4 border-r border-slate-700 min-w-[240px] print:border-slate-300">
                    Etapa / Operação no Processo
                  </th>
                  <th className="py-3 px-4 border-r border-slate-700 min-w-[150px] print:border-slate-300">
                    Executor / Posto
                  </th>
                  <th className="py-3 px-4 border-r border-slate-700 min-w-[170px] text-center print:border-slate-300">
                    Classificação Lean
                  </th>
                  <th className="py-3 px-4 border-r border-slate-700 min-w-[130px] text-center print:border-slate-300">
                    Tempo Ciclo (horas)
                  </th>
                  <th className="py-3 px-4 border-r border-slate-700 min-w-[180px] print:border-slate-300">
                    Insumos / Ferramental
                  </th>
                  <th className="py-3 px-4 border-r border-slate-700 min-w-[220px] print:border-slate-300">
                    Ponto Crítico de Controle / Qualidade
                  </th>
                  <th className="py-3 px-3 text-center w-14 no-print">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm print:divide-slate-300">
                {rowsData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-amber-50/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-slate-500 bg-[#FAF8F5] print:border-slate-300 print:bg-white">
                      {row.id}
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={row.etapa}
                        onChange={(e) =>
                          handleRowChange(index, "etapa", e.target.value)
                        }
                        placeholder="Insira a descrição da etapa do fluxo..."
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white rounded py-1 px-1.5 text-slate-800 transition text-sm focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={row.responsavel}
                        onChange={(e) =>
                          handleRowChange(index, "responsavel", e.target.value)
                        }
                        placeholder="Quem faz a etapa?"
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white rounded py-1 px-1.5 text-slate-800 transition text-sm focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 text-center print:border-slate-300">
                      <span className="hidden print:inline font-semibold text-xs text-slate-700">
                        {row.tipo} -{" "}
                        {row.tipo === "OP"
                          ? "Operação"
                          : row.tipo === "TR"
                          ? "Transporte"
                          : row.tipo === "IP"
                          ? "Inspeção"
                          : row.tipo === "ES"
                          ? "Espera"
                          : "Armazenamento"}
                      </span>
                      <select
                        value={row.tipo}
                        onChange={(e) =>
                          handleRowChange(index, "tipo", e.target.value)
                        }
                        className="w-full bg-transparent border border-slate-200 hover:border-slate-300 focus:border-[#1E3A8A] rounded py-1 px-1 text-xs font-semibold text-slate-700 focus:ring-0 cursor-pointer print:hidden"
                      >
                        <option value="OP">OP - Operação (Agrega valor)</option>
                        <option value="TR">
                          TR - Transporte (Logística de amarrados)
                        </option>
                        <option value="IP">
                          IP - Inspeção / Qualidade de Peça
                        </option>
                        <option value="ES">
                          ES - Espera (Aguardando liberação)
                        </option>
                        <option value="AR">
                          AR - Armazenamento temporário
                        </option>
                      </select>
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={row.tempo}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "tempo",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.0000"
                        className="w-full text-center bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white rounded py-1 px-1 font-mono font-bold text-[#1E3A8A] focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={row.insumos}
                        onChange={(e) =>
                          handleRowChange(index, "insumos", e.target.value)
                        }
                        placeholder="Ex: Fita métrica, romaneio..."
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white rounded py-1 px-1.5 text-slate-700 text-xs transition focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={row.critica}
                        onChange={(e) =>
                          handleRowChange(index, "critica", e.target.value)
                        }
                        placeholder="Pontos críticos, desvios ou gargalos operacionais..."
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white rounded py-1 px-1.5 text-slate-700 text-xs transition focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 text-center no-print">
                      <button
                        onClick={() => removeRow(index)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition"
                        title="Remover etapa"
                      >
                        <Trash2Icon className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- NOVO SEGMENTO: PLANO DE AÇÃO GERENCIAL (CAPA / 5W2H) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-slate-300">
          <div className="bg-[#FAF8F5] px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center no-print">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse"></span>
              <h2 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                <ActivityIcon className="w-4 h-4 text-[#10B981]" /> 2. Plano de
                Ação Preventivo & Corretivo (5W2H)
              </h2>
            </div>
            <button
              onClick={addAction}
              className="bg-[#0F766E] hover:bg-teal-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircleIcon className="w-4 h-4" /> Adicionar Ação
            </button>
          </div>

          <div className="p-4 hidden print:block border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              2. Plano de Ação Estruturado (Melhoria Contínua)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F766E] text-white text-[11px] font-bold uppercase tracking-wider border-b border-teal-800 print:bg-slate-100 print:text-black print:border-slate-300">
                  <th className="py-3 px-3 border-r border-teal-700 text-center w-12 print:border-slate-300">
                    ID
                  </th>
                  <th className="py-3 px-4 border-r border-teal-700 min-w-[280px] print:border-slate-300">
                    Ação Corretiva / Recomendação (O quê)
                  </th>
                  <th className="py-3 px-4 border-r border-teal-700 min-w-[150px] print:border-slate-300">
                    Setor / Facção (Onde)
                  </th>
                  <th className="py-3 px-4 border-r border-teal-700 min-w-[150px] print:border-slate-300">
                    Responsável (Quem)
                  </th>
                  <th className="py-3 px-4 border-r border-teal-700 min-w-[120px] text-center print:border-slate-300">
                    Data Início
                  </th>
                  <th className="py-3 px-4 border-r border-teal-700 min-w-[120px] text-center print:border-slate-300">
                    Prazo Limite
                  </th>
                  <th className="py-3 px-4 border-r border-teal-700 min-w-[140px] text-center print:border-slate-300">
                    Status
                  </th>
                  <th className="py-3 px-3 text-center w-14 no-print">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm print:divide-slate-300">
                {actionsData.map((act, index) => (
                  <tr
                    key={index}
                    className="hover:bg-emerald-50/20 transition-colors"
                  >
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-slate-500 bg-[#FAF8F5] print:border-slate-300 print:bg-white">
                      {act.id}
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={act.acao}
                        onChange={(e) =>
                          handleActionChange(index, "acao", e.target.value)
                        }
                        placeholder="Descreva o que deve ser feito..."
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#0F766E] focus:bg-white rounded py-1 px-1.5 text-slate-800 transition text-sm focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={act.setor}
                        onChange={(e) =>
                          handleActionChange(index, "setor", e.target.value)
                        }
                        placeholder="Setor ou Facção de destino"
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#0F766E] focus:bg-white rounded py-1 px-1.5 text-slate-800 transition text-sm focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 print:border-slate-300">
                      <input
                        type="text"
                        value={act.responsavel}
                        onChange={(e) =>
                          handleActionChange(
                            index,
                            "responsavel",
                            e.target.value
                          )
                        }
                        placeholder="Nome do responsável"
                        className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[#0F766E] focus:bg-white rounded py-1 px-1.5 text-slate-800 transition text-sm focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 text-center print:border-slate-300">
                      <input
                        type="date"
                        value={act.dataInicio}
                        onChange={(e) =>
                          handleActionChange(
                            index,
                            "dataInicio",
                            e.target.value
                          )
                        }
                        className="bg-transparent border border-transparent hover:border-slate-300 focus:border-[#0F766E] rounded py-1 px-1 text-xs font-mono text-slate-700 focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    <td className="py-1.5 px-2 border-r border-slate-200 text-center print:border-slate-300">
                      <input
                        type="date"
                        value={act.dataFim}
                        onChange={(e) =>
                          handleActionChange(index, "dataFim", e.target.value)
                        }
                        className="bg-transparent border border-transparent hover:border-slate-300 focus:border-[#0F766E] rounded py-1 px-1 text-xs font-mono text-slate-700 focus:ring-0 print:border-none print:text-black print:p-0"
                      />
                    </td>

                    {/* Status Operational com Badge Cor-Codificada */}
                    <td className="py-1.5 px-2 border-r border-slate-200 text-center print:border-slate-300">
                      <span className="hidden print:inline text-xs font-semibold">
                        {act.status}
                      </span>
                      <select
                        value={act.status}
                        onChange={(e) =>
                          handleActionChange(index, "status", e.target.value)
                        }
                        className={`w-full bg-transparent border rounded py-1 px-1 text-xs font-bold focus:ring-0 cursor-pointer print:hidden ${
                          act.status === "Concluído"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : act.status === "Em Andamento"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : act.status === "Atrasado"
                            ? "border-red-200 bg-red-50 text-red-800"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <option
                          value="Não Iniciado"
                          className="text-slate-800 bg-white font-normal"
                        >
                          Não Iniciado
                        </option>
                        <option
                          value="Em Andamento"
                          className="text-slate-800 bg-white font-normal"
                        >
                          Em Andamento
                        </option>
                        <option
                          value="Concluído"
                          className="text-slate-800 bg-white font-normal"
                        >
                          Concluído
                        </option>
                        <option
                          value="Atrasado"
                          className="text-slate-800 bg-white font-normal"
                        >
                          Atrasado
                        </option>
                      </select>
                    </td>

                    <td className="py-1.5 px-2 text-center no-print">
                      <button
                        onClick={() => removeAction(index)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition"
                        title="Remover ação"
                      >
                        <Trash2Icon className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GUIA DE CAPTURAS LEAN - LEITURA RÁPIDA DE SUPORTE */}
        <div className="bg-[#FAF8F5] border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-5 gap-4 no-print">
          <div className="flex items-start gap-3">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
              OP
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-700">Operação</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Agrega valor direto. (Ex: Costurar ombro, rebarbar, estampar).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              TR
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-700">Transporte</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Movimentação física de lote, amarrado de peças cortadas ou
                romaneio.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded">
              IP
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-700">Inspeção</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Controle de qualidade e medições em mesa de revisão física.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
              ES
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-700">
                Espera / Fila
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Gargalo. Aguardando aprovação técnica de pilotos ou insumos.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
              AR
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-700">
                Armazenamento
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Retenção de lotes defeituosos ou caixas para segunda qualidade.
              </p>
            </div>
          </div>
        </div>

        {/* ÁREA DE ASSINATURA PARA O PDF OFICIAL */}
        <div className="signature-area">
          <div className="w-1/3 border-t border-slate-900 text-center pt-2">
            <p className="text-xs font-bold text-slate-800">
              Assinatura do Analista
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Engenharia de Processos Vickytex
            </p>
          </div>
          <div className="w-1/3 border-t border-slate-900 text-center pt-2">
            <p className="text-xs font-bold text-slate-800">
              Assinatura da Facção / Fornecedor
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Validação das Ações Corretivas
            </p>
          </div>
        </div>
      </main>

      {/* RODAPÉ OPERACIONAL */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 text-center border-t border-slate-800 mt-auto no-print">
        <p>
          © 2026 Vickytex S.A. - Divisão de Excelência Operacional & Engenharia
          de Processos.
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Todos os dados coletados são de propriedade exclusiva e sigilo
          industrial.
        </p>
      </footer>

      {/* MODAL 1: CRIAR NOVO MAPEAMENTO (Novos Itens) */}
      {newProcessModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewProcess}
            className="bg-white rounded-xl max-w-md w-full shadow-2xl border-t-4 border-[#0F766E] p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 text-[#0F766E] p-2 rounded-full">
                <FolderPlusIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Criar Novo Processo Têxtil
              </h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Nome do Processo / Estudo de Caso
              </label>
              <input
                type="text"
                value={newProcessName}
                onChange={(e) => setNewProcessName(e.target.value)}
                placeholder="Ex: Confecção de Camisa - Oficina Vale"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Este mapeamento receberá um documento isolado na nuvem contendo
                Cronoanálise e Plano de Ação.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewProcessModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="bg-[#0F766E] hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
              >
                Criar e Iniciar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: CONFIRMAÇÃO DE EXCLUSÃO DE PROCESSO */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border-t-4 border-rose-600 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-rose-50 text-rose-600 p-2 rounded-full">
                <AlertTriangleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Excluir Mapeamento Ativo?
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Tem certeza de que deseja apagar permanentemente o processo{" "}
              <strong className="text-slate-800">"{metaData.process}"</strong>?
              Esta operação removerá tanto o cache local quanto o arquivo remoto
              no banco de dados na nuvem.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProcess}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRMAÇÃO DE LIMPAR TABELA */}
      {confirmClear && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border-t-4 border-red-600 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 text-red-600 p-2 rounded-full">
                <AlertTriangleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Limpar Todos os Dados?
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Você apagará de imediato todas as linhas de cronoanálise e também
              o plano de ação cadastrado para este estudo de caso. Deseja
              prosseguir?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Voltar
              </button>
              <button
                onClick={executeClearSheet}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FEEDBACK GERAL */}
      {modal.show && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-xl max-w-md w-full shadow-xl border-t-4 p-6 space-y-4 ${
              modal.type === "success"
                ? "border-[#10B981]"
                : modal.type === "warning"
                ? "border-amber-500"
                : "border-[#1E3A8A]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  modal.type === "success"
                    ? "bg-emerald-50 text-[#10B981]"
                    : modal.type === "warning"
                    ? "bg-amber-50 text-amber-500"
                    : "bg-blue-50 text-[#1E3A8A]"
                }`}
              >
                {modal.type === "success" ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  <InfoIcon className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {modal.title}
              </h3>
            </div>
            <p className="text-sm text-slate-600">{modal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
