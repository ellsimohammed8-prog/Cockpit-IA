"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  Mail,
  Cpu,
  Database,
  FileSpreadsheet,
  Check,
  RotateCcw,
  RefreshCw,
  Eye,
  EyeOff,
  UploadCloud,
  FileUp,
  HelpCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Save,
  Layers,
  Edit3,
  ListFilter,
  FileText,
  Inbox,
  Workflow,
  Server,
  Link,
} from "lucide-react";
import { ProductStockRecord } from "@/lib/schema";
import * as XLSX from "xlsx";
import {
  AIProvider,
  detectProviderFromKey,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/ai";
import { useLanguage } from "@/lib/languageContext";

const PROVIDER_NAMES: Record<string, string> = {
  claude: "Anthropic (Claude)",
  gemini: "Google Gemini",
  openai: "OpenAI (GPT)",
  groq: "Groq (Llama / Mixtral)",
  xai: "xAI (Grok)",
  mistral: "Mistral AI",
  deepseek: "DeepSeek",
  custom: "Custom / Ollama",
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductStockRecord[];
  onProductsUpdated: (newProducts: ProductStockRecord[]) => void;
  onResetDatabase: () => void;
  onRequestAdded?: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
  onResetDatabase,
  onRequestAdded,
}: SettingsModalProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"ai" | "email" | "sheets" | "database">("ai");

  // Multi-LLM Provider & Dynamic Models State
  const [aiProvider, setAiProvider] = useState<AIProvider>("gemini");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [customBaseUrl, setCustomBaseUrl] = useState("http://localhost:11434/v1");
  const [isManualModelInput, setIsManualModelInput] = useState(false);

  // Customizable System Prompt State
  const [systemPrompt, setSystemPrompt] = useState<string>(DEFAULT_SYSTEM_PROMPT);

  // 1. INBOUND EMAIL STATE (Lecture IMAP des demandes clients)
  const [inboundProvider, setInboundProvider] = useState<"gmail" | "outlook" | "custom">("gmail");
  const [inboundEmail, setInboundEmail] = useState("");
  const [inboundAppPassword, setInboundAppPassword] = useState("");
  const [showInboundPassword, setShowInboundPassword] = useState(false);
  const [autoSyncEmails, setAutoSyncEmails] = useState(true);
  const [customImapHost, setCustomImapHost] = useState("imap.gmail.com");
  const [customImapPort, setCustomImapPort] = useState("993");

  // 2. OUTBOUND EMAIL STATE (Expédition SMTP des devis chiffrés)
  const [outboundMode, setOutboundMode] = useState<"turbosmtp" | "same_as_inbound" | "custom">("turbosmtp");
  const [customSmtpHost, setCustomSmtpHost] = useState("pro.eu.turbo-smtp.com");
  const [customSmtpPort, setCustomSmtpPort] = useState("465");
  const [customSmtpUser, setCustomSmtpUser] = useState("");
  const [customSmtpPass, setCustomSmtpPass] = useState("");
  const [showCustomSmtpPass, setShowCustomSmtpPass] = useState(false);

  // Separate Action Feedback States
  const [isTestingImap, setIsTestingImap] = useState(false);
  const [isCheckingEmails, setIsCheckingEmails] = useState(false);
  const [imapFeedback, setImapFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpFeedback, setSmtpFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Live Connection Test State (AI)
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    isMock: boolean;
    message: string;
  }>({
    tested: false,
    success: true,
    isMock: true,
    message: "Mode Démo / Mock Actif (Sans clé)",
  });

  // DATABASE STORAGE STATE (3 MODES: Local | Supabase REST | PostgreSQL Direct)
  const [dbMode, setDbMode] = useState<"local" | "supabase" | "postgres">("local");
  const [supabaseUrl, setSupabaseUrl] = useState("https://xyzcompany.supabase.co");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);

  // PostgreSQL Direct Parameters (n8n / Pooler format)
  const [pgHost, setPgHost] = useState("aws-1-eu-west-1.pooler.supabase.com");
  const [pgDatabase, setPgDatabase] = useState("postgres");
  const [pgPort, setPgPort] = useState("5432");
  const [pgUser, setPgUser] = useState("postgres.xyzcompany");
  const [pgPassword, setPgPassword] = useState("");
  const [showPgPassword, setShowPgPassword] = useState(false);
  const [pgUri, setPgUri] = useState("");
  const [pgInputMode, setPgInputMode] = useState<"fields" | "uri">("fields");

  // DB Connection Test State
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbFeedback, setDbFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Sheets & File Upload State
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [autoDeductStock, setAutoDeductStock] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Saved Settings State (Button feedback)
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Dynamic Provider Placeholders
  const getProviderPlaceholder = () => {
    switch (aiProvider) {
      case "claude":
        return "sk-ant-api03-...";
      case "gemini":
        return "AIzaSy...";
      case "openai":
        return "sk-proj-...";
      case "groq":
        return "gsk_...";
      case "xai":
        return "xai-...";
      case "mistral":
        return "mis-...";
      case "deepseek":
        return "sk-...";
      case "custom":
        return "sk-... (ou laissez vide pour Ollama)";
      default:
        return "Collez votre clé d'API...";
    }
  };

  // Load saved configuration from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProvider = (localStorage.getItem("cockpit_ai_provider") as AIProvider) || "gemini";
      setAiProvider(savedProvider);

      const savedCustomModels = localStorage.getItem(`cockpit_models_${savedProvider}`);
      if (savedCustomModels) {
        try {
          const parsed = JSON.parse(savedCustomModels);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAvailableModels(parsed);
          }
        } catch {
          setAvailableModels([]);
        }
      }

      const savedModel = localStorage.getItem("cockpit_ai_model") || "";
      if (savedModel) setSelectedModel(savedModel);

      const savedKey = localStorage.getItem("cockpit_ai_key");
      if (savedKey) {
        setApiKey(savedKey);
        setConnectionStatus({
          tested: true,
          success: true,
          isMock: false,
          message: `Clé enregistrée (${PROVIDER_NAMES?.[savedProvider] || savedProvider || "IA"})`,
        });
      } else {
        setApiKey("");
        setConnectionStatus({
          tested: false,
          success: true,
          isMock: true,
          message: "Mode Démo / Mock Actif (Sans clé)",
        });
      }

      const savedBaseUrl = localStorage.getItem("cockpit_custom_base_url");
      if (savedBaseUrl) setCustomBaseUrl(savedBaseUrl);

      const savedPrompt = localStorage.getItem("cockpit_custom_prompt");
      if (savedPrompt && savedPrompt.trim().length > 10) {
        setSystemPrompt(savedPrompt);
      }

      // Load Inbound & Outbound Email Credentials
      const savedInboundProv = (localStorage.getItem("cockpit_inbound_provider") || localStorage.getItem("cockpit_email_provider") || "gmail") as any;
      setInboundProvider(savedInboundProv);

      const savedInboundEmail = localStorage.getItem("cockpit_inbound_email") || localStorage.getItem("cockpit_email_address") || localStorage.getItem("cockpit_smtp_from") || "";
      if (savedInboundEmail) setInboundEmail(savedInboundEmail);

      const savedInboundPass = localStorage.getItem("cockpit_inbound_password") || localStorage.getItem("cockpit_email_password") || "";
      if (savedInboundPass) setInboundAppPassword(savedInboundPass);

      const savedImapHost = localStorage.getItem("cockpit_inbound_host");
      if (savedImapHost) setCustomImapHost(savedImapHost);

      const savedImapPort = localStorage.getItem("cockpit_inbound_port");
      if (savedImapPort) setCustomImapPort(savedImapPort);

      const savedOutboundMode = (localStorage.getItem("cockpit_outbound_mode") || "turbosmtp") as any;
      setOutboundMode(savedOutboundMode);

      const savedSmtpHost = localStorage.getItem("cockpit_smtp_host");
      if (savedSmtpHost) setCustomSmtpHost(savedSmtpHost);

      const savedSmtpPort = localStorage.getItem("cockpit_smtp_port");
      if (savedSmtpPort) setCustomSmtpPort(savedSmtpPort);

      const savedSmtpUser = localStorage.getItem("cockpit_smtp_user");
      if (savedSmtpUser) setCustomSmtpUser(savedSmtpUser);

      const savedSmtpPass = localStorage.getItem("cockpit_smtp_pass");
      if (savedSmtpPass) setCustomSmtpPass(savedSmtpPass);

      // Load Database Credentials
      const savedDbMode = localStorage.getItem("cockpit_db_mode");
      if (savedDbMode === "local" || savedDbMode === "supabase" || savedDbMode === "postgres") {
        setDbMode(savedDbMode);
      }

      const savedSupaUrl = localStorage.getItem("cockpit_supabase_url");
      if (savedSupaUrl) setSupabaseUrl(savedSupaUrl);

      const savedSupaKey = localStorage.getItem("cockpit_supabase_key");
      if (savedSupaKey) setSupabaseKey(savedSupaKey);

      const savedPgHost = localStorage.getItem("cockpit_pg_host");
      if (savedPgHost) setPgHost(savedPgHost);

      const savedPgDb = localStorage.getItem("cockpit_pg_db");
      if (savedPgDb) setPgDatabase(savedPgDb);

      const savedPgPort = localStorage.getItem("cockpit_pg_port");
      if (savedPgPort) setPgPort(savedPgPort);

      const savedPgUser = localStorage.getItem("cockpit_pg_user");
      if (savedPgUser) setPgUser(savedPgUser);

      const savedPgPass = localStorage.getItem("cockpit_pg_pass");
      if (savedPgPass) setPgPassword(savedPgPass);

      const savedPgUri = localStorage.getItem("cockpit_pg_uri");
      if (savedPgUri) setPgUri(savedPgUri);

      const savedSheetsUrl = localStorage.getItem("cockpit_sheets_url");
      if (savedSheetsUrl) setSheetsUrl(savedSheetsUrl);
    }
  }, []);

  const handleProviderSelect = (provider: AIProvider) => {
    setAiProvider(provider);
    setIsManualModelInput(false);

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`cockpit_models_${provider}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAvailableModels(parsed);
            setSelectedModel(parsed[0]);
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    setAvailableModels([]);
    setSelectedModel("");

    if (!apiKey.trim()) {
      setConnectionStatus({
        tested: false,
        success: true,
        isMock: true,
        message: "Mode Démo / Mock Actif (Sans clé)",
      });
    } else {
      setConnectionStatus({
        tested: false,
        success: false,
        isMock: false,
        message: `Cliquez sur 'Tester la connexion' pour charger les modèles ${PROVIDER_NAMES?.[provider] || provider}`,
      });
    }
  };

  // Smart API Key Prefix Auto-Detection
  const handleApiKeyChange = (val: string) => {
    setApiKey(val);

    const detected = detectProviderFromKey(val);
    if (detected && detected !== aiProvider) {
      setAiProvider(detected);
      setAvailableModels([]);
      setSelectedModel("");
      setIsManualModelInput(false);
      setConnectionStatus({
        tested: false,
        success: false,
        isMock: false,
        message: `Fournisseur détecté : ${PROVIDER_NAMES?.[detected] || detected}. Cliquez sur 'Tester la connexion'.`,
      });
      return;
    }

    if (!val.trim()) {
      setAvailableModels([]);
      setSelectedModel("");
      setConnectionStatus({
        tested: false,
        success: true,
        isMock: true,
        message: "Mode Démo / Mock Actif (Sans clé)",
      });
    } else {
      setConnectionStatus({
        tested: false,
        success: false,
        isMock: false,
        message: "Cliquez sur 'Tester la connexion' pour charger les modèles",
      });
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  // Save All Settings strictly to localStorage
  const handleSaveAllSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cockpit_ai_provider", aiProvider);
      localStorage.setItem("cockpit_ai_model", selectedModel);
      localStorage.setItem("cockpit_ai_key", apiKey);
      localStorage.setItem("cockpit_custom_base_url", customBaseUrl);
      localStorage.setItem("cockpit_custom_prompt", systemPrompt);

      // 1. Inbound IMAP Settings
      localStorage.setItem("cockpit_inbound_provider", inboundProvider);
      localStorage.setItem("cockpit_inbound_email", inboundEmail);
      localStorage.setItem("cockpit_inbound_password", inboundAppPassword);
      localStorage.setItem("cockpit_inbound_host", customImapHost);
      localStorage.setItem("cockpit_inbound_port", customImapPort);

      // 2. Outbound SMTP Settings
      localStorage.setItem("cockpit_outbound_mode", outboundMode);
      localStorage.setItem("cockpit_smtp_from", inboundEmail);

      if (outboundMode === "turbosmtp") {
        localStorage.setItem("cockpit_smtp_host", "pro.eu.turbo-smtp.com");
        localStorage.setItem("cockpit_smtp_port", "465");
        localStorage.setItem("cockpit_smtp_user", customSmtpUser);
        localStorage.setItem("cockpit_smtp_pass", customSmtpPass);
      } else if (outboundMode === "same_as_inbound") {
        const host = inboundProvider === "gmail" ? "smtp.gmail.com" : "smtp.office365.com";
        const port = inboundProvider === "gmail" ? "465" : "587";
        localStorage.setItem("cockpit_smtp_host", host);
        localStorage.setItem("cockpit_smtp_port", port);
        localStorage.setItem("cockpit_smtp_user", inboundEmail);
        localStorage.setItem("cockpit_smtp_pass", inboundAppPassword);
      } else {
        localStorage.setItem("cockpit_smtp_host", customSmtpHost);
        localStorage.setItem("cockpit_smtp_port", customSmtpPort);
        localStorage.setItem("cockpit_smtp_user", customSmtpUser);
        localStorage.setItem("cockpit_smtp_pass", customSmtpPass);
      }

      // Backward compatibility keys
      localStorage.setItem("cockpit_email_provider", inboundProvider);
      localStorage.setItem("cockpit_email_address", inboundEmail);
      localStorage.setItem("cockpit_email_password", inboundAppPassword);

      // Database Configuration
      localStorage.setItem("cockpit_db_mode", dbMode);
      localStorage.setItem("cockpit_supabase_url", supabaseUrl);
      localStorage.setItem("cockpit_supabase_key", supabaseKey);
      localStorage.setItem("cockpit_pg_host", pgHost);
      localStorage.setItem("cockpit_pg_db", pgDatabase);
      localStorage.setItem("cockpit_pg_port", pgPort);
      localStorage.setItem("cockpit_pg_user", pgUser);
      localStorage.setItem("cockpit_pg_pass", pgPassword);
      localStorage.setItem("cockpit_pg_uri", pgUri);

      if (sheetsUrl) localStorage.setItem("cockpit_sheets_url", sheetsUrl);
      if (availableModels.length > 0) {
        localStorage.setItem(`cockpit_models_${aiProvider}`, JSON.stringify(availableModels));
      }
    }

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  // Live Model Inspection & Ping Connection Test (AI)
  const handleTestConnection = async () => {
    setIsTestingConnection(true);

    try {
      const res = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiProvider,
          model: selectedModel,
          apiKey: apiKey.trim(),
          customBaseUrl: customBaseUrl.trim(),
          customModel: selectedModel.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.models && Array.isArray(data.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        const newModel = data.models.includes(selectedModel) ? selectedModel : data.models[0];
        setSelectedModel(newModel);

        if (typeof window !== "undefined") {
          localStorage.setItem(`cockpit_models_${aiProvider}`, JSON.stringify(data.models));
          localStorage.setItem("cockpit_ai_model", newModel);
        }

        setConnectionStatus({
          tested: true,
          success: true,
          isMock: false,
          message: `✓ Connecté avec succès (${data.models.length} modèles détectés)`,
        });
      } else {
        setAvailableModels([]);
        setSelectedModel("");
        setConnectionStatus({
          tested: true,
          success: false,
          isMock: false,
          message: data.message || data.error || "Aucun modèle disponible pour cette clé.",
        });
      }
    } catch (err: any) {
      setAvailableModels([]);
      setSelectedModel("");
      setConnectionStatus({
        tested: true,
        success: false,
        isMock: false,
        message: "Erreur réseau lors du test de connexion.",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // 1. Inbound IMAP Test
  const handleTestImapConnection = async () => {
    setIsTestingImap(true);
    setImapFeedback(null);

    try {
      const res = await fetch("/api/check-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inboundEmail.trim(),
          appPassword: inboundAppPassword.trim(),
          provider: inboundProvider,
          isTestOnly: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImapFeedback({
          success: true,
          message: data.message || `✓ Connexion IMAP validée avec succès pour ${inboundEmail} !`,
        });
      } else {
        setImapFeedback({
          success: false,
          message: data.message || "Échec de connexion IMAP à la boîte email.",
        });
      }
    } catch (err: any) {
      setImapFeedback({
        success: false,
        message: "Erreur réseau lors du test IMAP.",
      });
    } finally {
      setIsTestingImap(false);
    }
  };

  // 2. Fetch New Inbound Emails Immediately (Relève manuelle)
  const handleFetchNewEmailsNow = async () => {
    setIsCheckingEmails(true);
    setImapFeedback(null);

    try {
      const res = await fetch("/api/check-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inboundEmail.trim(),
          appPassword: inboundAppPassword.trim(),
          provider: inboundProvider,
          isTestOnly: false,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImapFeedback({
          success: true,
          message: data.message || "✓ Nouvelles demandes clients relevées et analysées avec succès !",
        });
        if (onRequestAdded) {
          onRequestAdded();
        }
      } else {
        setImapFeedback({
          success: false,
          message: data.message || "Aucun nouvel email non lu à relever.",
        });
      }
    } catch (err: any) {
      setImapFeedback({
        success: false,
        message: "Erreur lors de la relève des emails.",
      });
    } finally {
      setIsCheckingEmails(false);
    }
  };

  // 3. Outbound SMTP Dispatch Test
  const handleTestSmtpSending = async () => {
    setIsTestingSmtp(true);
    setSmtpFeedback(null);

    try {
      let host = customSmtpHost.trim();
      let port = parseInt(customSmtpPort, 10) || 465;
      let user = customSmtpUser.trim();
      let pass = customSmtpPass.trim();

      if (outboundMode === "turbosmtp") {
        host = "pro.eu.turbo-smtp.com";
        port = 465;
      } else if (outboundMode === "same_as_inbound") {
        host = inboundProvider === "gmail" ? "smtp.gmail.com" : "smtp.office365.com";
        port = inboundProvider === "gmail" ? 465 : 587;
        user = inboundEmail.trim();
        pass = inboundAppPassword.trim();
      }

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inboundEmail.trim() || "commercial@votre-entreprise.fr",
          subject: "⚡ Test Expédition SMTP Devis — Cockpit IA",
          text: "Félicitations ! Votre configuration SMTP d'envoi de devis fonctionne parfaitement.",
          smtpConfig: {
            host,
            port,
            user,
            pass,
            fromEmail: inboundEmail.trim() || "commercial@votre-entreprise.fr",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpFeedback({
          success: true,
          message: data.message || `✓ Email de test expédié avec succès via ${host}:${port} !`,
        });
      } else {
        setSmtpFeedback({
          success: false,
          message: data.message || data.error || "Échec d'envoi SMTP.",
        });
      }
    } catch (err: any) {
      setSmtpFeedback({
        success: false,
        message: "Erreur lors du test d'envoi SMTP.",
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // 3. Database Connection Test (Local | Supabase | PostgreSQL)
  const handleTestDatabaseConnection = async () => {
    setIsTestingDb(true);
    setDbFeedback(null);

    try {
      const res = await fetch("/api/test-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: dbMode,
          supabaseUrl,
          supabaseKey,
          postgresConfig: {
            host: pgHost.trim(),
            port: parseInt(pgPort, 10) || 5432,
            database: pgDatabase.trim(),
            user: pgUser.trim(),
            password: pgPassword.trim(),
            connectionUri: pgUri.trim(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDbFeedback({
          success: true,
          message: data.message || "✓ Connecté à la base de données avec succès !",
        });
      } else {
        setDbFeedback({
          success: false,
          message: data.message || "Échec de connexion BDD (Vérifiez les identifiants ou le mot de passe).",
        });
      }
    } catch (err: any) {
      setDbFeedback({
        success: false,
        message: "Erreur réseau lors du test de connexion BDD.",
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) return;

        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          setSyncFeedback("Le fichier ne contient aucune feuille de calcul valide.");
          return;
        }

        const rawData: any[][] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          defval: "",
        });

        if (!rawData || rawData.length === 0) {
          setSyncFeedback("Le fichier est vide.");
          return;
        }

        // Identify header columns
        let headerRowIndex = -1;
        let skuCol = -1;
        let nameCol = -1;
        let qtyCol = -1;
        let priceCol = -1;
        let catCol = -1;

        for (let i = 0; i < Math.min(5, rawData.length); i++) {
          const row = rawData[i].map((c) => String(c).toLowerCase().trim());
          const hasSku = row.some((c) => c.includes("sku") || c.includes("code") || c.includes("ref") || c.includes("id"));
          const hasName = row.some((c) => c.includes("nom") || c.includes("name") || c.includes("designation") || c.includes("produit") || c.includes("article") || c.includes("description"));

          if (hasSku || hasName) {
            headerRowIndex = i;
            row.forEach((colName, colIdx) => {
              if (skuCol === -1 && (colName.includes("sku") || colName.includes("code") || colName === "ref" || colName === "reference")) {
                skuCol = colIdx;
              } else if (nameCol === -1 && (colName.includes("nom") || colName.includes("name") || colName.includes("designation") || colName.includes("produit") || colName.includes("article") || colName.includes("description") || colName.includes("titre"))) {
                nameCol = colIdx;
              } else if (qtyCol === -1 && (colName.includes("qte") || colName.includes("quant") || colName.includes("stock") || colName.includes("dispo") || colName.includes("count"))) {
                qtyCol = colIdx;
              } else if (priceCol === -1 && (colName.includes("prix") || colName.includes("price") || colName.includes("tarif") || colName.includes("ht") || colName.includes("pu"))) {
                priceCol = colIdx;
              } else if (catCol === -1 && (colName.includes("cat") || colName.includes("rayon") || colName.includes("type") || colName.includes("famille"))) {
                catCol = colIdx;
              }
            });
            break;
          }
        }

        if (skuCol === -1) skuCol = 0;
        if (nameCol === -1) nameCol = 1;
        if (qtyCol === -1) qtyCol = 2;
        if (priceCol === -1) priceCol = 3;
        if (catCol === -1) catCol = 4;

        const startIndex = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;
        const parsedProducts: ProductStockRecord[] = [];

        for (let r = startIndex; r < rawData.length; r++) {
          const row = rawData[r];
          if (!row || row.length === 0) continue;

          const rawSku = row[skuCol] ? String(row[skuCol]).trim() : "";
          const rawName = row[nameCol] ? String(row[nameCol]).trim() : "";

          if (!rawSku && !rawName) continue;

          const finalSku = (rawSku || `SKU-${r + 1}`).toUpperCase();
          const finalName = rawName || `Article Référence ${finalSku}`;
          const finalQty = row[qtyCol] !== undefined ? Math.max(0, parseInt(String(row[qtyCol]).replace(/[^\d]/g, ""), 10) || 20) : 20;

          let cleanPrice = 2900;
          if (typeof row[priceCol] === "number") {
            cleanPrice = Math.round(row[priceCol] * 100);
          } else if (row[priceCol]) {
            const pNum = parseFloat(String(row[priceCol]).replace(/[^\d.,]/g, "").replace(",", "."));
            cleanPrice = isNaN(pNum) ? 2900 : Math.round(pNum * 100);
          }

          const finalCat = row[catCol] ? String(row[catCol]).trim() : "Importé";

          parsedProducts.push({
            id: `prod-imp-${r + 1}-${Math.random().toString(36).substring(2, 7)}`,
            sku: finalSku,
            name: finalName,
            quantity_available: finalQty,
            unit_price_cents: cleanPrice,
            category: finalCat,
          });
        }

        if (parsedProducts.length > 0) {
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "import_catalog",
              products: parsedProducts,
            }),
          });
          if (res.ok) {
            onProductsUpdated(parsedProducts);
            setSyncFeedback(`✓ Importation réussie : ${parsedProducts.length} référence(s) chargées depuis ${file.name}.`);
          }
        } else {
          setSyncFeedback("Aucun produit extrait. Vérifiez que votre fichier contient bien des lignes de données.");
        }
      } catch (err: any) {
        setSyncFeedback(`Erreur lors de la lecture du fichier : ${err.message}`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSyncSheets = async () => {
    if (!sheetsUrl.trim()) {
      setSyncFeedback("Veuillez saisir l'URL de votre Google Sheet ou fichier Excel/CSV en ligne.");
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      const res = await fetch("/api/sync-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sheetsUrl.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.products) {
        onProductsUpdated(data.products);
        setSyncFeedback(data.message || `✓ ${data.count || data.products.length} produit(s) synchronisé(s) avec succès !`);
      } else {
        setSyncFeedback(`❌ ${data.error || "Impossible de synchroniser le document."}`);
      }
    } catch (err: any) {
      setSyncFeedback(`❌ Erreur réseau lors de la synchronisation : ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-[#0e1628] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#111a2e] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/25">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {t.settings.title}
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                {t.settings.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 h-11 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === "ai"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>🧠 {t.settings.tabAi}</span>
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 h-11 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === "email"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>📬 {t.settings.tabMessaging}</span>
          </button>

          <button
            onClick={() => setActiveTab("sheets")}
            className={`flex items-center gap-2 h-11 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === "sheets"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📊 {t.settings.tabCatalog}</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`flex items-center gap-2 h-11 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === "database"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>🗄️ {t.settings.tabDatabase}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* TAB 1: AI ENGINE & CUSTOM SYSTEM PROMPT */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Sélectionnez votre Fournisseur d'Intelligence Artificielle :
                </label>
                {/* AI Provider Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      "gemini",
                      "claude",
                      "openai",
                      "groq",
                      "xai",
                      "mistral",
                      "deepseek",
                      "custom",
                    ] as AIProvider[]
                  ).map((p) => {
                    const isSelected = aiProvider === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleProviderSelect(p)}
                        className={`h-12 flex items-center justify-center text-center px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/15 text-white shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/30"
                            : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                        }`}
                      >
                        <span>{PROVIDER_NAMES?.[p] || p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* API Key Input & Live Connection Test */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-400">
                    Clé d'API ({aiProvider.toUpperCase()}) :
                  </label>

                  {/* Status Badge */}
                  {connectionStatus.isMock ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {connectionStatus.message}
                    </span>
                  ) : connectionStatus.success ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {connectionStatus.message}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{connectionStatus.message}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? "text" : "password"}
                      name="cockpit_ai_api_key"
                      id="cockpit_ai_api_key"
                      autoComplete="new-password"
                      autoCorrect="off"
                      spellCheck="false"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder={getProviderPlaceholder()}
                      className="w-full h-11 bg-slate-950/90 border border-slate-800 rounded-lg px-3 pr-10 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="h-11 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold border border-slate-700/80 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    {isTestingConnection ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                        <span>Récupération des modèles...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tester la connexion</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Native Model Selection Dropdown */}
              {availableModels.length > 0 && (
                <div className="pt-2 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      Modèle Sélectionné ({PROVIDER_NAMES?.[aiProvider] || aiProvider}) :
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      {availableModels.length} modèle(s) détecté(s) via l'API
                    </span>
                  </div>

                  {aiProvider === "custom" ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="block text-slate-400 font-medium mb-1">Base URL de l'API :</label>
                          <input
                            type="text"
                            value={customBaseUrl}
                            onChange={(e) => setCustomBaseUrl(e.target.value)}
                            placeholder="http://localhost:11434/v1"
                            className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl px-3.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-400 font-medium">Modèle Custom :</label>
                            <button
                              type="button"
                              onClick={() => setIsManualModelInput(!isManualModelInput)}
                              className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                            >
                              {isManualModelInput ? (
                                <>
                                  <ListFilter className="w-3 h-3" />
                                  <span>Choisir dans la liste</span>
                                </>
                              ) : (
                                <>
                                  <Edit3 className="w-3 h-3" />
                                  <span>+ Saisir manuellement</span>
                                </>
                              )}
                            </button>
                          </div>

                          {isManualModelInput ? (
                            <input
                              type="text"
                              value={selectedModel}
                              onChange={(e) => handleModelChange(e.target.value)}
                              placeholder="llama3 ou mistral:latest"
                              className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl px-3.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <select
                              value={selectedModel}
                              onChange={(e) => handleModelChange(e.target.value)}
                              className="w-full h-11 px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                            >
                              {availableModels.map((model) => (
                                <option key={model} value={model}>
                                  {model}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={selectedModel}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-inner"
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* 1. Customizable System Prompt & Business Instructions */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      📝 Prompt Système & Instructions Métier
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Personnalisez les consignes d'analyse et le comportement de l'IA pour l'extraction de vos devis.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                    title="Rétablir le prompt système par défaut"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Rétablir par défaut</span>
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                En l'absence de clé, le <strong>moteur intelligent de simulation</strong> prend le relais de manière fluide.
              </p>
            </div>
          )}

          {/* TAB 2: SEPARATED INBOUND & OUTBOUND EMAIL ARCHITECTURE */}
          {activeTab === "email" && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-100 mb-1">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Messagerie Professionnelle : Réception Intelligente & Envoi Haute Délivrabilité</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Le système fonctionne en 2 étapes claires : <strong>1. Lecture IMAP</strong> pour récupérer et analyser les demandes des clients envoyées à votre employé, et <strong>2. Envoi SMTP</strong> pour expédier les devis et factures officiels sans passer par les spams.
                </p>
              </div>

              {/* CARD 1: INBOUND EMAIL (RECEPTION IMAP DU COMPTE EMPLOYE) */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-emerald-400" />
                      <span>📥 1. Réception & Lecture des Demandes Clients (IMAP)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Connectez la boîte de réception de l'employé (Google Workspace, Gmail, Outlook ou Webmail)
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                    Inbound IMAP
                  </span>
                </div>

                {/* Inbound Provider Selector Buttons */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Type de Boîte Email de l'Employé :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setInboundProvider("gmail");
                        setCustomImapHost("imap.gmail.com");
                        setCustomImapPort("993");
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        inboundProvider === "gmail"
                          ? "bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>🌐 Google / Gmail</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">imap.gmail.com:993</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInboundProvider("outlook");
                        setCustomImapHost("outlook.office365.com");
                        setCustomImapPort("993");
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        inboundProvider === "outlook"
                          ? "bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>🏢 Microsoft Outlook / 365</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">outlook.office365.com:993</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInboundProvider("custom");
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        inboundProvider === "custom"
                          ? "bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>🌐 Webmail Entreprise / cPanel</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">Serveur IMAP Personnalisé</span>
                    </button>
                  </div>
                </div>

                {/* Email Address & App Password Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Adresse Email de l'Employé :
                    </label>
                    <input
                      type="email"
                      value={inboundEmail}
                      onChange={(e) => setInboundEmail(e.target.value)}
                      placeholder="commercial@votre-entreprise.fr"
                      className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl px-3.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Mot de Passe d'Application (16 lettres) :
                      </label>
                      {inboundProvider === "gmail" && (
                        <a
                          href="https://myaccount.google.com/apppasswords"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold"
                        >
                          Créer sur Google ↗
                        </a>
                      )}
                      {inboundProvider === "outlook" && (
                        <a
                          href="https://account.live.com/proofs/AppPassword"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold"
                        >
                          Créer sur Microsoft ↗
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showInboundPassword ? "text" : "password"}
                        value={inboundAppPassword}
                        onChange={(e) => setInboundAppPassword(e.target.value)}
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl px-3.5 pr-10 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowInboundPassword(!showInboundPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showInboundPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom IMAP Host & Port (If Webmail selected) */}
                {inboundProvider === "custom" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 animate-fade-in">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 font-medium mb-1">Hôte IMAP (Serveur de Réception) :</label>
                      <input
                        type="text"
                        value={customImapHost}
                        onChange={(e) => setCustomImapHost(e.target.value)}
                        placeholder="mail.votre-entreprise.fr ou imap.ovh.net"
                        className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Port IMAP (SSL) :</label>
                      <input
                        type="text"
                        value={customImapPort}
                        onChange={(e) => setCustomImapPort(e.target.value)}
                        placeholder="993"
                        className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Step-by-Step Interactive Guide Box */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      Comment activer la lecture du compte {inboundProvider === "gmail" ? "Gmail" : inboundProvider === "outlook" ? "Outlook" : "Webmail"} en 3 étapes :
                    </span>
                  </div>
                  {inboundProvider === "gmail" && (
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 leading-relaxed">
                      <li>Activez la validation en 2 étapes sur votre compte Google.</li>
                      <li>
                        Ouvrez directement la page :{" "}
                        <a
                          href="https://myaccount.google.com/apppasswords"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline font-semibold hover:text-blue-300"
                        >
                          myaccount.google.com/apppasswords ↗
                        </a>
                      </li>
                      <li>Créez un mot de passe nommé <em>« Cockpit IA »</em> et collez les 16 lettres ci-dessus.</li>
                    </ol>
                  )}
                  {inboundProvider === "outlook" && (
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 leading-relaxed">
                      <li>
                        Connectez-vous à la page de sécurité Microsoft :{" "}
                        <a
                          href="https://account.live.com/proofs/AppPassword"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline font-semibold hover:text-blue-300"
                        >
                          account.live.com/proofs/AppPassword ↗
                        </a>
                      </li>
                      <li>Générez un mot de passe d'application pour <em>« Cockpit IA »</em>.</li>
                      <li>Collez le mot de passe généré dans le champ ci-dessus.</li>
                    </ol>
                  )}
                  {inboundProvider === "custom" && (
                    <p className="text-slate-400">
                      Renseignez l'adresse de votre serveur IMAP d'entreprise (ex: <code className="text-slate-300 font-mono">mail.votre-entreprise.fr:993</code>) et vos identifiants habituels.
                    </p>
                  )}
                </div>

                {/* Auto Sync Toggle & Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoSyncEmails}
                      onChange={(e) => setAutoSyncEmails(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs">Relève automatique toutes les minutes</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestImapConnection}
                      disabled={isTestingImap}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold border border-slate-700 transition-all cursor-pointer disabled:opacity-60 text-xs"
                    >
                      {isTestingImap ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Test IMAP...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>⚡ Tester IMAP</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleFetchNewEmailsNow}
                      disabled={isCheckingEmails}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-60 text-xs"
                    >
                      {isCheckingEmails ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Relève en cours...</span>
                        </>
                      ) : (
                        <>
                          <Inbox className="w-3.5 h-3.5" />
                          <span>📥 Relever les emails (IA)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* IMAP Feedback Alert */}
                {imapFeedback && (
                  <div
                    className={`p-3 rounded-lg border flex items-center gap-2 text-xs animate-fade-in ${
                      imapFeedback.success
                        ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {imapFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{imapFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* CARD 2: OUTBOUND EMAIL (ENVOI SMTP DES DEVIS & FACTURES) */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>🚀 2. Envoi des Devis & Réponses aux Clients (SMTP)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Expédie les devis validés automatiquement aux clients avec haute délivrabilité
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 uppercase tracking-wider">
                    Outbound SMTP
                  </span>
                </div>

                {/* Outbound Mode Selector Buttons */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Méthode d'Expédition des Devis :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Mode 1: turboSMTP (Recommended) */}
                    <button
                      type="button"
                      onClick={() => setOutboundMode("turbosmtp")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        outboundMode === "turbosmtp"
                          ? "bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
                          <span>👑 turboSMTP (Recommandé)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Zéro Spam & Délivrabilité garantie pour PME.
                        </p>
                      </div>
                      <span className="text-[10px] text-blue-400 font-mono mt-2">pro.eu.turbo-smtp.com:465</span>
                    </button>

                    {/* Mode 2: Same as Inbound */}
                    <button
                      type="button"
                      onClick={() => setOutboundMode("same_as_inbound")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        outboundMode === "same_as_inbound"
                          ? "bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>⚡ Même compte ({inboundProvider === "gmail" ? "Gmail" : "Outlook"})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Utilise directement le compte configuré à l'étape 1.
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-2">1 Clic Automatique</span>
                    </button>

                    {/* Mode 3: Custom SMTP */}
                    <button
                      type="button"
                      onClick={() => setOutboundMode("custom")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        outboundMode === "custom"
                          ? "bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>🖥️ Serveur SMTP Dédié / cPanel</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Configuration avancée avec hôte et port personnalisés.
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-2">Custom SMTP Host</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields for turboSMTP / Custom */}
                {outboundMode === "turbosmtp" && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-amber-400" />
                        Identifiants turboSMTP (
                        <a
                          href="https://serversmtp.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          serversmtp.com ↗
                        </a>
                        ) :
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">SSL 465 Préconfiguré</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Identifiant SMTP (Consumer Key) :</label>
                        <input
                          type="text"
                          value={customSmtpUser}
                          onChange={(e) => setCustomSmtpUser(e.target.value)}
                          placeholder="08049ca61a52869cd262"
                          className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Mot de Passe SMTP (Consumer Secret) :</label>
                        <div className="relative">
                          <input
                            type={showCustomSmtpPass ? "text" : "password"}
                            value={customSmtpPass}
                            onChange={(e) => setCustomSmtpPass(e.target.value)}
                            placeholder="NkR46nSfCdg39iVwFPOq"
                            className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 pr-10 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCustomSmtpPass(!showCustomSmtpPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showCustomSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {outboundMode === "custom" && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 animate-fade-in text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 font-medium mb-1">Hôte SMTP :</label>
                        <input
                          type="text"
                          value={customSmtpHost}
                          onChange={(e) => setCustomSmtpHost(e.target.value)}
                          placeholder="mail.votre-domaine.fr"
                          className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Port SMTP :</label>
                        <input
                          type="text"
                          value={customSmtpPort}
                          onChange={(e) => setCustomSmtpPort(e.target.value)}
                          placeholder="465 ou 587"
                          className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Identifiant SMTP :</label>
                        <input
                          type="text"
                          value={customSmtpUser}
                          onChange={(e) => setCustomSmtpUser(e.target.value)}
                          placeholder="votre_utilisateur"
                          className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Mot de Passe SMTP :</label>
                        <div className="relative">
                          <input
                            type={showCustomSmtpPass ? "text" : "password"}
                            value={customSmtpPass}
                            onChange={(e) => setCustomSmtpPass(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 pr-10 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCustomSmtpPass(!showCustomSmtpPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showCustomSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {outboundMode === "same_as_inbound" && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/25 text-emerald-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Les devis seront expédiés avec l'adresse <strong>{inboundEmail || "de votre employé"}</strong> via le serveur SMTP officiel ({inboundProvider === "gmail" ? "smtp.gmail.com:465" : "smtp.office365.com:587"}).
                    </span>
                  </div>
                )}

                {/* SMTP Action Bar */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleTestSmtpSending}
                    disabled={isTestingSmtp}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60 text-xs"
                  >
                    {isTestingSmtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Envoi du test SMTP...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>⚡ Tester l'Envoi SMTP (Email de test)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* SMTP Feedback Alert */}
                {smtpFeedback && (
                  <div
                    className={`p-3 rounded-lg border flex items-center gap-2 text-xs animate-fade-in ${
                      smtpFeedback.success
                        ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {smtpFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{smtpFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* CARD 3: PEDAGOGICAL ARCHITECTURE GUIDE FOR NON-DEVELOPERS */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>💡 Comprendre l'Architecture : Pourquoi Deux Protocoles ?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-400 leading-relaxed">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">📥 IMAP (Lecture & Réception) :</span>
                    Sert à ouvrir la boîte de réception de l'employé pour que l'IA puisse lire les emails des clients, extraire les articles demandés et préparer les devis.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-blue-400 block mb-1">🚀 SMTP / turboSMTP (Expédition) :</span>
                    Sert à déposer les devis chez le client. Des services comme <strong>turboSMTP</strong> garantissent que le devis arrive directement dans la boîte de réception du client sans passer par les spams.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATALOG & FILES */}
          {activeTab === "sheets" && (
            <div className="space-y-5">
              {/* Dropzone Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  1. Importer un fichier Excel (.xlsx, .xls) ou CSV :
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-950/30"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <p className="text-slate-200 font-medium">
                    Glissez-déposez votre fichier ici, ou cliquez pour parcourir
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Prend en charge les formats .xlsx, .xls et .csv (SKU, Nom, Quantité, Prix HT, Catégorie)
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="excel-file-input"
                  />
                  <label
                    htmlFor="excel-file-input"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer text-xs"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    Parcourir les fichiers
                  </label>
                </div>
              </div>

              {/* Remote Cloud Sync (Google Sheets / Excel Online / OneDrive / CSV) */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. Ou synchroniser via un lien Google Sheets ou fichier Excel / CSV en ligne :
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={sheetsUrl}
                    onChange={(e) => setSheetsUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/... ou https://.../catalogue.xlsx"
                    className="flex-1 h-10 bg-slate-950/90 border border-slate-800 rounded-lg px-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSyncSheets}
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-colors cursor-pointer text-xs shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Synchroniser le Catalogue</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 Compatible avec les liens publics Google Sheets, OneDrive, SharePoint ou fichiers .xlsx / .csv hébergés.
                </p>
              </div>

              {syncFeedback && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              {/* Auto stock deduction toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDeductStock}
                    onChange={(e) => setAutoDeductStock(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>
                    Déduire automatiquement les quantités du stock lors de l'approbation d'une commande
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE STORAGE (3 OPTIONS: LOCAL | SUPABASE REST | POSTGRESQL DIRECT) */}
          {activeTab === "database" && (
            <div className="space-y-5">
              {/* Option Selector Cards Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                  Choisissez votre Mode de Stockage des Données :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Local */}
                  <button
                    type="button"
                    onClick={() => setDbMode("local")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      dbMode === "local"
                        ? "bg-blue-950/50 border-blue-500 text-white shadow-md ring-1 ring-blue-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Server className="w-3.5 h-3.5 text-blue-400" />
                        <span>1. Stockage Local</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-normal">
                        Zéro configuration requise. Idéal pour tester immédiatement en local.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-2">✓ Actif par défaut</span>
                  </button>

                  {/* Option 2: Supabase REST */}
                  <button
                    type="button"
                    onClick={() => setDbMode("supabase")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      dbMode === "supabase"
                        ? "bg-blue-950/50 border-blue-500 text-white shadow-md ring-1 ring-blue-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        <span>2. Supabase Cloud</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-normal">
                        Connexion API REST via SDK Supabase officiel.
                      </p>
                    </div>
                    <span className="text-[10px] text-blue-400 font-semibold mt-2">Cloud Persistant</span>
                  </button>

                  {/* Option 3: PostgreSQL Dédié */}
                  <button
                    type="button"
                    onClick={() => setDbMode("postgres")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      dbMode === "postgres"
                        ? "bg-blue-950/50 border-blue-500 text-white shadow-md ring-1 ring-blue-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>3. PostgreSQL Dédié (Production)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-normal">
                        Connexion directe par chaîne URI ou hôte avec SSL sécurisé.
                      </p>
                    </div>
                    <span className="text-[10px] text-amber-400 font-semibold mt-2">Haute Performance</span>
                  </button>
                </div>
              </div>

              {/* Option 2 Form: Supabase Cloud REST SDK */}
              {dbMode === "supabase" && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      Paramètres Supabase Cloud (API REST) :
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">SDK Supabase JS</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      URL du Projet Supabase :
                    </label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Clé d'API Anon / Service Role :
                    </label>
                    <div className="relative">
                      <input
                        type={showSupabaseKey ? "text" : "password"}
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 pr-10 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showSupabaseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Option 3 Form: PostgreSQL Dédié */}
              {dbMode === "postgres" && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      ⚡ Paramètres de Connexion PostgreSQL Direct :
                    </span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setPgInputMode("fields")}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          pgInputMode === "fields" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Champs Séparés
                      </button>
                      <button
                        type="button"
                        onClick={() => setPgInputMode("uri")}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          pgInputMode === "uri" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        URI Connection
                      </button>
                    </div>
                  </div>

                  {pgInputMode === "fields" ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 font-medium mb-1">Hôte (Host / Pooler) :</label>
                          <input
                            type="text"
                            value={pgHost}
                            onChange={(e) => setPgHost(e.target.value)}
                            placeholder="aws-1-eu-west-1.pooler.supabase.com"
                            className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-medium mb-1">Port :</label>
                          <input
                            type="text"
                            value={pgPort}
                            onChange={(e) => setPgPort(e.target.value)}
                            placeholder="5432 ou 6543"
                            className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-300 font-medium mb-1">Base de Données :</label>
                          <input
                            type="text"
                            value={pgDatabase}
                            onChange={(e) => setPgDatabase(e.target.value)}
                            placeholder="postgres"
                            className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-medium mb-1">Utilisateur (User) :</label>
                          <input
                            type="text"
                            value={pgUser}
                            onChange={(e) => setPgUser(e.target.value)}
                            placeholder="postgres.xyzcompany"
                            className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-medium mb-1">Mot de Passe :</label>
                          <div className="relative">
                            <input
                              type={showPgPassword ? "text" : "password"}
                              value={pgPassword}
                              onChange={(e) => setPgPassword(e.target.value)}
                              placeholder="••••••••••••"
                              className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 pr-10 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPgPassword(!showPgPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                              {showPgPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Chaîne de Connexion PostgreSQL (Connection URI) :
                      </label>
                      <input
                        type="text"
                        value={pgUri}
                        onChange={(e) => setPgUri(e.target.value)}
                        placeholder="postgresql://postgres.xyz:password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require"
                        className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 font-mono text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* DB Test Feedback Badge */}
              {dbFeedback && (
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2 text-xs animate-fade-in ${
                    dbFeedback.success
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                  }`}
                >
                  {dbFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{dbFeedback.message}</span>
                </div>
              )}

              {/* Action Buttons: Test DB & Reset DB */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleTestDatabaseConnection}
                  disabled={isTestingDb}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-60 text-xs"
                >
                  {isTestingDb ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Test de connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>⚡ Tester la connexion BDD</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onResetDatabase}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 font-semibold transition-colors cursor-pointer text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser les données locales (Reset)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Explicit Save Action */}
        <div className="bg-[#111a2e] border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Modèle actif :{" "}
              <strong className="text-slate-100">
                {PROVIDER_NAMES?.[aiProvider] || aiProvider}
                {selectedModel ? ` (${selectedModel})` : ""}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveAllSettings}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold shadow-md transition-all cursor-pointer text-xs ${
                isSavedRecently
                  ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-105"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
              }`}
            >
              {isSavedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>✓ {t.settings.savedToast}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.settings.saveAllBtn}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer text-xs"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
