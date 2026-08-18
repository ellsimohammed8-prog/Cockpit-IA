export type Language = "en" | "fr";

export interface TranslationDict {
  common: {
    save: string;
    cancel: string;
    delete: string;
    close: string;
    confirm: string;
    loading: string;
    refresh: string;
    search: string;
    actions: string;
    status: string;
    total: string;
    client: string;
    email: string;
    phone: string;
    date: string;
    edit: string;
    add: string;
    success: string;
    error: string;
    warning: string;
    view: string;
    all: string;
    none: string;
    active: string;
    inactive: string;
    unitPrice: string;
    quantity: string;
    category: string;
    sku: string;
    stock: string;
    description: string;
    test: string;
    sync: string;
    export: string;
    import: string;
    required: string;
  };
  header: {
    appName: string;
    appBeta: string;
    tagline: string;
    systemStatus: string;
    systemStatusSubtitle: string;
    refreshTooltip: string;
    settingsTooltip: string;
    settingsBtn: string;
    langEn: string;
    langFr: string;
    langTitle: string;
  };
  badges: {
    pendingReview: string;
    needsManual: string;
    processed: string;
    rejected: string;
    urgencyHigh: string;
    urgencyMedium: string;
    urgencyLow: string;
    intentQuote: string;
    intentInfo: string;
    intentComplaint: string;
    intentOther: string;
    inStock: string;
    lowStock: string;
    outOfStock: string;
  };
  requests: {
    title: string;
    countSuffix: string;
    subtitle: string;
    searchPlaceholder: string;
    newManualBtn: string;
    clearAllBtn: string;
    clearAllConfirmTitle: string;
    clearAllConfirmDesc: string;
    clearConfirmBtn: string;
    tabAll: string;
    tabToValidate: string;
    tabManualReview: string;
    tabProcessed: string;
    colClient: string;
    colIntent: string;
    colUrgency: string;
    colStatus: string;
    colItems: string;
    colDate: string;
    colActions: string;
    emptyTitle: string;
    emptyDesc: string;
    viewDetails: string;
    deleteTooltip: string;
    deletedSuccess: string;
    allClearedSuccess: string;
    modalTitle: string;
    modalSubtitle: string;
    formClientName: string;
    formClientEmail: string;
    formClientPhone: string;
    formIntent: string;
    formUrgency: string;
    formItemsLabel: string;
    formItemsHint: string;
    formRawContent: string;
    formSubmitBtn: string;
    formSubmitting: string;
  };
  catalog: {
    title: string;
    countSuffix: string;
    subtitle: string;
    searchPlaceholder: string;
    addProductBtn: string;
    clearAllBtn: string;
    clearAllConfirmTitle: string;
    clearAllConfirmDesc: string;
    colSku: string;
    colName: string;
    colCategory: string;
    colStock: string;
    colUnitPrice: string;
    colStatus: string;
    colActions: string;
    emptyTitle: string;
    emptyDesc: string;
    modalTitle: string;
    modalSubtitle: string;
    formName: string;
    formSku: string;
    formCategory: string;
    formPrice: string;
    formStock: string;
    formSubmitBtn: string;
    productAddedSuccess: string;
    productDeletedSuccess: string;
  };
  drawer: {
    title: string;
    subtitle: string;
    aiBadge: string;
    humanReviewBadge: string;
    sectionClient: string;
    sectionOriginalEmail: string;
    sectionQuoteSummary: string;
    colItemName: string;
    colQuantity: string;
    colUnitPrice: string;
    colLineTotal: string;
    colAvailability: string;
    colRemove: string;
    addItemBtn: string;
    totalHT: string;
    totalTTC: string;
    stockWarning: string;
    sectionDraftEmail: string;
    copyDraftBtn: string;
    copiedText: string;
    validateAndSendBtn: string;
    validatingBtn: string;
    markNeedsManualBtn: string;
    rejectBtn: string;
    saveChangesBtn: string;
    savingBtn: string;
    validatedSuccess: string;
    manualSuccess: string;
    rejectedSuccess: string;
    savedSuccess: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabGeneral: string;
    tabAi: string;
    tabMessaging: string;
    tabCatalog: string;
    tabDatabase: string;
    tabAbout: string;
    
    // AI Tab
    aiTitle: string;
    aiSubtitle: string;
    aiProviderLabel: string;
    aiApiKeyLabel: string;
    aiModelLabel: string;
    aiTestBtn: string;
    aiTesting: string;
    aiTestSuccess: string;
    aiTestError: string;
    
    // Messaging Tab
    msgTitle: string;
    msgSubtitle: string;
    
    inboundCardTitle: string;
    inboundCardBadge: string;
    inboundCardDesc: string;
    inboundProviderLabel: string;
    inboundEmailLabel: string;
    inboundAppPassLabel: string;
    inboundCustomHost: string;
    inboundCustomPort: string;
    inboundGuideTitle: string;
    inboundGuideGmail1: string;
    inboundGuideGmail2: string;
    inboundGuideGmail3: string;
    inboundGuideOutlook1: string;
    inboundGuideOutlook2: string;
    inboundTestBtn: string;
    inboundTesting: string;
    inboundCheckNowBtn: string;
    inboundChecking: string;
    
    outboundCardTitle: string;
    outboundCardBadge: string;
    outboundCardDesc: string;
    outboundModeLabel: string;
    outboundModeTurbo: string;
    outboundModeSame: string;
    outboundModeCustom: string;
    outboundTurboNotice: string;
    outboundHostLabel: string;
    outboundPortLabel: string;
    outboundUserLabel: string;
    outboundPassLabel: string;
    outboundTestBtn: string;
    outboundTesting: string;
    
    pedagogicalTitle: string;
    pedagogicalSubtitle: string;
    pedagogicalImapTitle: string;
    pedagogicalImapDesc: string;
    pedagogicalSmtpTitle: string;
    pedagogicalSmtpDesc: string;
    
    // Catalog Tab
    catTitle: string;
    catSubtitle: string;
    catUploadLabel: string;
    catUploadDropzone: string;
    catSheetsUrlLabel: string;
    catSheetsSyncBtn: string;
    catSyncing: string;
    catSyncSuccess: string;
    
    // Database Tab
    dbTitle: string;
    dbSubtitle: string;
    dbModeLabel: string;
    dbModeLocal: string;
    dbModeSupabase: string;
    dbModePostgres: string;
    dbSupabaseUrl: string;
    dbSupabaseKey: string;
    dbResetTitle: string;
    dbResetDesc: string;
    dbResetBtn: string;
    dbResetConfirm: string;
    
    // About Tab
    aboutTitle: string;
    aboutDesc: string;
    aboutVersion: string;
    aboutReleaseDate: string;
    aboutLicense: string;
    
    saveAllBtn: string;
    savedToast: string;
  };
  simulator: {
    title: string;
    subtitle: string;
    selectSample: string;
    simulateBtn: string;
    simulating: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      close: "Close",
      confirm: "Confirm",
      loading: "Loading...",
      refresh: "Refresh",
      search: "Search...",
      actions: "Actions",
      status: "Status",
      total: "Total",
      client: "Customer",
      email: "Email",
      phone: "Phone",
      date: "Date",
      edit: "Edit",
      add: "Add",
      success: "Success",
      error: "Error",
      warning: "Warning",
      view: "View",
      all: "All",
      none: "None",
      active: "Active",
      inactive: "Inactive",
      unitPrice: "Unit Price",
      quantity: "Qty",
      category: "Category",
      sku: "SKU",
      stock: "Stock",
      description: "Description",
      test: "Test",
      sync: "Sync",
      export: "Export",
      import: "Import",
      required: "Required",
    },
    header: {
      appName: "Cockpit AI",
      appBeta: "BETA",
      tagline: "Commercial automation & real-time inventory synchronization",
      systemStatus: "AI Engine Operational",
      systemStatusSubtitle: "Listening for inbound customer requests",
      refreshTooltip: "Refresh all data",
      settingsTooltip: "Settings and connectors",
      settingsBtn: "Settings",
      langEn: "English",
      langFr: "Français",
      langTitle: "Change language",
    },
    badges: {
      pendingReview: "To Validate",
      needsManual: "Manual Review",
      processed: "Validated & Processed",
      rejected: "Rejected",
      urgencyHigh: "High",
      urgencyMedium: "Medium",
      urgencyLow: "Low",
      intentQuote: "Quote Request",
      intentInfo: "Information",
      intentComplaint: "Complaint",
      intentOther: "Other",
      inStock: "In Stock",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
    },
    requests: {
      title: "Inbound Requests & Pending Quotes",
      countSuffix: "total",
      subtitle: "Real-time AI processed customer email stream ready for human validation",
      searchPlaceholder: "Search by customer name, email, item, or keyword...",
      newManualBtn: "New Manual Request",
      clearAllBtn: "Clear All",
      clearAllConfirmTitle: "Clear all requests?",
      clearAllConfirmDesc: "This will permanently delete all incoming requests from the dashboard.",
      clearConfirmBtn: "Yes, clear everything",
      tabAll: "All",
      tabToValidate: "To Validate",
      tabManualReview: "Manual Review",
      tabProcessed: "Processed",
      colClient: "Customer",
      colIntent: "Intent",
      colUrgency: "Urgency",
      colStatus: "Status",
      colItems: "Detected Items",
      colDate: "Received Date",
      colActions: "Actions",
      emptyTitle: "No pending requests",
      emptyDesc: "Use 'New Manual Request' or check the Inbound Simulator in Settings to generate test emails.",
      viewDetails: "Review & Validate",
      deleteTooltip: "Delete this request",
      deletedSuccess: "Request deleted successfully.",
      allClearedSuccess: "All requests have been cleared.",
      modalTitle: "Create New Customer Request",
      modalSubtitle: "Enter customer request details for instant AI quotation & inventory matching",
      formClientName: "Customer / Company Name",
      formClientEmail: "Email Address",
      formClientPhone: "Phone Number (Optional)",
      formIntent: "Request Intent",
      formUrgency: "Priority Level",
      formItemsLabel: "Requested Products & Quantities",
      formItemsHint: "e.g. 2x Cordless Drill 18V, 10x Box 500 Stainless Screws",
      formRawContent: "Raw Email / Message Text",
      formSubmitBtn: "Analyze & Create Quote",
      formSubmitting: "Analyzing with AI...",
    },
    catalog: {
      title: "Product Catalog & Inventory",
      countSuffix: "items",
      subtitle: "Inventory management, unit prices, and automated quote reconciliation",
      searchPlaceholder: "Search by product name, SKU, or category...",
      addProductBtn: "Add Product",
      clearAllBtn: "Clear Catalog",
      clearAllConfirmTitle: "Clear entire product catalog?",
      clearAllConfirmDesc: "This will remove all products from the local database.",
      colSku: "SKU / Reference",
      colName: "Product Name",
      colCategory: "Category",
      colStock: "Available Stock",
      colUnitPrice: "Unit Price (excl. VAT)",
      colStatus: "Stock Status",
      colActions: "Actions",
      emptyTitle: "Catalog is currently empty",
      emptyDesc: "Click 'Add Product' or import your Excel / Google Sheets catalog in Settings.",
      modalTitle: "Add New Product",
      modalSubtitle: "Register a new product in the official commercial catalog",
      formName: "Product Title",
      formSku: "SKU / Part Number",
      formCategory: "Category",
      formPrice: "Price € excl. VAT (e.g. 89.90)",
      formStock: "Initial Stock Quantity",
      formSubmitBtn: "Save Product",
      productAddedSuccess: "Product added successfully.",
      productDeletedSuccess: "Product deleted from catalog.",
    },
    drawer: {
      title: "Review Commercial Request",
      subtitle: "Human-in-the-Loop review: verify prices, stock availability, and email draft before sending",
      aiBadge: "AI Extraction",
      humanReviewBadge: "Human Validation",
      sectionClient: "Customer Information",
      sectionOriginalEmail: "Original Received Message",
      sectionQuoteSummary: "Quote Calculation & Stock Reconciliation",
      colItemName: "Product",
      colQuantity: "Qty",
      colUnitPrice: "Unit Price",
      colLineTotal: "Total excl. VAT",
      colAvailability: "Stock Status",
      colRemove: "Del",
      addItemBtn: "Add Item to Quote",
      totalHT: "Total excl. VAT",
      totalTTC: "Total incl. VAT (20%)",
      stockWarning: "Attention: One or more items exceed current available stock!",
      sectionDraftEmail: "Draft Email Response",
      copyDraftBtn: "Copy Draft",
      copiedText: "Copied!",
      validateAndSendBtn: "Validate & Send Email to Customer",
      validatingBtn: "Sending Email & Deducting Stock...",
      markNeedsManualBtn: "Mark for Manual Handling",
      rejectBtn: "Reject Request",
      saveChangesBtn: "Save Changes",
      savingBtn: "Saving...",
      validatedSuccess: "Quote validated! Email sent and stock deducted.",
      manualSuccess: "Marked for manual handling.",
      rejectedSuccess: "Request rejected.",
      savedSuccess: "Changes saved successfully.",
    },
    settings: {
      title: "Settings & Connectors",
      subtitle: "Configure AI models, professional email sync (IMAP/SMTP), catalog feeds, and storage",
      tabGeneral: "General",
      tabAi: "AI Engine",
      tabMessaging: "Email Sync (IMAP / SMTP)",
      tabCatalog: "Catalog Feeds",
      tabDatabase: "Database",
      tabAbout: "About",
      
      aiTitle: "Artificial Intelligence Engine",
      aiSubtitle: "Select and configure the LLM provider used to parse requests and generate quotes",
      aiProviderLabel: "AI Provider",
      aiApiKeyLabel: "API Key",
      aiModelLabel: "Selected Model",
      aiTestBtn: "⚡ Test AI Connection",
      aiTesting: "Testing Connection...",
      aiTestSuccess: "AI Connection Successful! Models loaded.",
      aiTestError: "Connection failed. Please check your API key.",
      
      msgTitle: "Professional Email Architecture",
      msgSubtitle: "Unified Inbound (IMAP) reception and Outbound (SMTP) quote dispatching",
      
      inboundCardTitle: "📥 1. Customer Email Reception & Reading (IMAP)",
      inboundCardBadge: "Inbound",
      inboundCardDesc: "Securely connect employee email account to automatically detect and extract incoming customer requests",
      inboundProviderLabel: "Email Service Provider",
      inboundEmailLabel: "Employee Email Address",
      inboundAppPassLabel: "Application Password (16 chars)",
      inboundCustomHost: "IMAP Host Server",
      inboundCustomPort: "IMAP Port (SSL)",
      inboundGuideTitle: "Step-by-step connection guide:",
      inboundGuideGmail1: "Enable 2-Step Verification on your Google account.",
      inboundGuideGmail2: "Generate an App Password named 'Cockpit AI' via: myaccount.google.com/apppasswords",
      inboundGuideGmail3: "Paste the 16-character password in the field above.",
      inboundGuideOutlook1: "Create an App Password via: account.live.com/proofs/AppPassword",
      inboundGuideOutlook2: "Paste your Outlook email and App Password above.",
      inboundTestBtn: "⚡ Test IMAP Connection",
      inboundTesting: "Connecting to IMAP...",
      inboundCheckNowBtn: "📥 Fetch New Emails Now (AI)",
      inboundChecking: "Fetching & Analyzing...",
      
      outboundCardTitle: "🚀 2. Quote Dispatch & Customer Responses (SMTP)",
      outboundCardBadge: "Outbound",
      outboundCardDesc: "Configure professional SMTP relay to guarantee 100% email deliverability without spam filters",
      outboundModeLabel: "Sending Method",
      outboundModeTurbo: "turboSMTP (Recommended for High Deliverability)",
      outboundModeSame: "1-Click: Use Same Employee Credentials (Gmail / Outlook)",
      outboundModeCustom: "Custom SMTP Server",
      outboundTurboNotice: "turboSMTP relay (pro.eu.turbo-smtp.com:465) delivers your commercial quotes directly to client inboxes with high reputation.",
      outboundHostLabel: "SMTP Host Server",
      outboundPortLabel: "SMTP Port (SSL/TLS)",
      outboundUserLabel: "SMTP Username",
      outboundPassLabel: "SMTP Password / API Key",
      outboundTestBtn: "⚡ Test SMTP Sending",
      outboundTesting: "Sending Test Email...",
      
      pedagogicalTitle: "💡 Understanding Email Architecture (IMAP vs SMTP)",
      pedagogicalSubtitle: "Why are there two distinct email settings in Cockpit AI?",
      pedagogicalImapTitle: "1. Why IMAP for Reading Inbound Emails?",
      pedagogicalImapDesc: "IMAP (Internet Message Access Protocol) connects directly to the employee's inbox (Gmail, Outlook, Webmail) to read incoming RFQs from clients in real-time.",
      pedagogicalSmtpTitle: "2. Why SMTP / turboSMTP for Sending Quotes?",
      pedagogicalSmtpDesc: "SMTP (Simple Mail Transfer Protocol) is strictly an outbound sending protocol. Specialized relays like turboSMTP ensure your formal PDF quotes and emails never land in client spam filters.",
      
      catTitle: "Product Catalog Synchronization",
      catSubtitle: "Import products from Excel spreadsheets (.xlsx, .csv) or live Google Sheets",
      catUploadLabel: "Excel / CSV File Upload",
      catUploadDropzone: "Click or drag & drop your catalog spreadsheet (.xlsx, .xls, .csv)",
      catSheetsUrlLabel: "Live Google Sheets Public URL",
      catSheetsSyncBtn: "Sync from Google Sheets",
      catSyncing: "Synchronizing...",
      catSyncSuccess: "Catalog synchronized successfully!",
      
      dbTitle: "Storage & Persistence",
      dbSubtitle: "Configure local storage, Supabase cloud database, or custom PostgreSQL instance",
      dbModeLabel: "Database Backend",
      dbModeLocal: "Local SQLite / File Storage (Default)",
      dbModeSupabase: "Supabase Cloud Database",
      dbModePostgres: "Custom PostgreSQL",
      dbSupabaseUrl: "Supabase Project URL",
      dbSupabaseKey: "Supabase Anon Key",
      dbResetTitle: "Reset Demo Data",
      dbResetDesc: "Restore original sample products and customer requests for demonstration purposes.",
      dbResetBtn: "Reset to Default Demo Data",
      dbResetConfirm: "Are you sure you want to reset all data to default demo state?",
      
      aboutTitle: "Cockpit AI Desktop",
      aboutDesc: "Next-generation B2B sales automation and stock reconciliation platform for distributors and SMEs.",
      aboutVersion: "Version",
      aboutReleaseDate: "Release Date",
      aboutLicense: "License",
      
      saveAllBtn: "Save All Settings",
      savedToast: "Settings saved successfully!",
    },
    simulator: {
      title: "Inbound Email Simulator",
      subtitle: "Inject sample customer RFQ emails to test AI parsing, stock matching, and quote generation",
      selectSample: "Choose a realistic B2B customer email scenario:",
      simulateBtn: "Process Email with AI",
      simulating: "Analyzing Email & Building Quote...",
    },
  },
  fr: {
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      close: "Fermer",
      confirm: "Confirmer",
      loading: "Chargement...",
      refresh: "Rafraîchir",
      search: "Rechercher...",
      actions: "Actions",
      status: "Statut",
      total: "Total",
      client: "Client",
      email: "Email",
      phone: "Téléphone",
      date: "Date",
      edit: "Modifier",
      add: "Ajouter",
      success: "Succès",
      error: "Erreur",
      warning: "Attention",
      view: "Consulter",
      all: "Tous",
      none: "Aucun",
      active: "Actif",
      inactive: "Inactif",
      unitPrice: "Prix Unitaire",
      quantity: "Qté",
      category: "Catégorie",
      sku: "Réf / SKU",
      stock: "Stock",
      description: "Description",
      test: "Tester",
      sync: "Synchroniser",
      export: "Exporter",
      import: "Importer",
      required: "Requis",
    },
    header: {
      appName: "Cockpit IA",
      appBeta: "BETA",
      tagline: "Traitement commercial & synchronisation des stocks",
      systemStatus: "Système IA Opérationnel",
      systemStatusSubtitle: "À l'écoute des demandes entrantes",
      refreshTooltip: "Rafraîchir les données",
      settingsTooltip: "Paramètres et connecteurs",
      settingsBtn: "Paramètres",
      langEn: "English",
      langFr: "Français",
      langTitle: "Changer de langue",
    },
    badges: {
      pendingReview: "À Valider",
      needsManual: "Revue Manuelle",
      processed: "Validé & Traité",
      rejected: "Rejeté",
      urgencyHigh: "Haute",
      urgencyMedium: "Moyenne",
      urgencyLow: "Basse",
      intentQuote: "Demande de devis",
      intentInfo: "Information",
      intentComplaint: "Réclamation",
      intentOther: "Autre",
      inStock: "En Stock",
      lowStock: "Stock Faible",
      outOfStock: "Rupture",
    },
    requests: {
      title: "Demandes & Devis en Attente",
      countSuffix: "total",
      subtitle: "Flux d'emails analysés en temps réel par l'IA et prêts pour validation humaine",
      searchPlaceholder: "Rechercher un client, email, référence ou mot-clé...",
      newManualBtn: "Nouvelle Demande Manuelle",
      clearAllBtn: "Tout Vider",
      clearAllConfirmTitle: "Vider toutes les demandes ?",
      clearAllConfirmDesc: "Cette action supprimera définitivement toutes les demandes de devis du tableau de bord.",
      clearConfirmBtn: "Oui, tout effacer",
      tabAll: "Tous",
      tabToValidate: "À Valider",
      tabManualReview: "Revue Manuelle",
      tabProcessed: "Traités",
      colClient: "Client",
      colIntent: "Intention",
      colUrgency: "Urgence",
      colStatus: "Statut",
      colItems: "Articles Détectés",
      colDate: "Date de Réception",
      colActions: "Actions",
      emptyTitle: "Aucune demande en attente",
      emptyDesc: "Utilisez 'Nouvelle Demande Manuelle' ou le simulateur dans les Paramètres pour tester le système.",
      viewDetails: "Vérifier & Valider",
      deleteTooltip: "Supprimer cette demande",
      deletedSuccess: "Demande supprimée avec succès.",
      allClearedSuccess: "Toutes les demandes ont été vidées.",
      modalTitle: "Créer une Demande Client Manuelle",
      modalSubtitle: "Saisissez les informations de la demande pour un chiffrage et rapprochement immédiat",
      formClientName: "Nom du Client / Société",
      formClientEmail: "Adresse Email",
      formClientPhone: "Téléphone (Optionnel)",
      formIntent: "Intention Détectée",
      formUrgency: "Niveau d'Urgence",
      formItemsLabel: "Articles & Quantités Demandés",
      formItemsHint: "ex: 1x Perceuse Visseuse 18V, 5x Boîte 500 Vis Inox",
      formRawContent: "Texte Brut de l'Email / Message",
      formSubmitBtn: "Analyser & Générer le Devis",
      formSubmitting: "Analyse IA en cours...",
    },
    catalog: {
      title: "Catalogue Produits & Stock",
      countSuffix: "réf.",
      subtitle: "Gestion des stocks, prix unitaires et réconciliation automatique des devis",
      searchPlaceholder: "Rechercher un article, référence SKU ou catégorie...",
      addProductBtn: "Ajouter un produit",
      clearAllBtn: "Vider le Catalogue",
      clearAllConfirmTitle: "Vider tout le catalogue ?",
      clearAllConfirmDesc: "Cette action supprimera tous les articles de votre stock local.",
      colSku: "Référence SKU",
      colName: "Désignation Produit",
      colCategory: "Catégorie",
      colStock: "Stock Disponible",
      colUnitPrice: "Prix Unitaire (€ HT)",
      colStatus: "État du Stock",
      colActions: "Actions",
      emptyTitle: "Le catalogue est actuellement vide",
      emptyDesc: "Cliquez sur 'Ajouter un produit' ou importez votre fichier Excel dans les Paramètres.",
      modalTitle: "Ajouter un Nouveau Produit",
      modalSubtitle: "Enregistrez une nouvelle référence dans le catalogue officiel",
      formName: "Désignation de l'article",
      formSku: "Référence SKU",
      formCategory: "Catégorie",
      formPrice: "Prix unitaire € HT (ex: 89.90)",
      formStock: "Quantité en stock",
      formSubmitBtn: "Enregistrer le Produit",
      productAddedSuccess: "Produit ajouté avec succès.",
      productDeletedSuccess: "Produit supprimé du catalogue.",
    },
    drawer: {
      title: "Revue de la Demande Commerciale",
      subtitle: "Validation humaine (Human-in-the-Loop) : vérifiez les prix, le stock et l'email avant expédition",
      aiBadge: "Extraction IA",
      humanReviewBadge: "Validation Humaine",
      sectionClient: "Informations Client",
      sectionOriginalEmail: "Message Original Reçu",
      sectionQuoteSummary: "Calcul du Devis & Rapprochement Stock",
      colItemName: "Article",
      colQuantity: "Qté",
      colUnitPrice: "Prix Unitaire",
      colLineTotal: "Total HT",
      colAvailability: "Stock",
      colRemove: "Suppr.",
      addItemBtn: "Ajouter une ligne au devis",
      totalHT: "Total HT",
      totalTTC: "Total TTC (TVA 20%)",
      stockWarning: "Attention : Un ou plusieurs articles dépassent le stock disponible !",
      sectionDraftEmail: "Proposition de Réponse Email",
      copyDraftBtn: "Copier l'Email",
      copiedText: "Copié !",
      validateAndSendBtn: "Valider & Expédier au Client",
      validatingBtn: "Envoi de l'email & déduction stock...",
      markNeedsManualBtn: "Marquer en Revue Manuelle",
      rejectBtn: "Rejeter la Demande",
      saveChangesBtn: "Enregistrer les Modifications",
      savingBtn: "Enregistrement...",
      validatedSuccess: "Devis validé ! Email envoyé et stock déduit.",
      manualSuccess: "Demande marquée en revue manuelle.",
      rejectedSuccess: "Demande rejetée.",
      savedSuccess: "Modifications enregistrées avec succès.",
    },
    settings: {
      title: "Paramètres & Connecteurs",
      subtitle: "Configuration des moteurs d'IA, de la messagerie (IMAP/SMTP), du catalogue et de la base de données",
      tabGeneral: "Général",
      tabAi: "Moteur IA",
      tabMessaging: "Messagerie Pro (IMAP / SMTP)",
      tabCatalog: "Catalogue Produits",
      tabDatabase: "Base de Données",
      tabAbout: "À Propos",
      
      aiTitle: "Moteur d'Intelligence Artificielle",
      aiSubtitle: "Sélectionnez le fournisseur d'IA pour analyser les demandes et chiffrer les devis",
      aiProviderLabel: "Fournisseur d'IA",
      aiApiKeyLabel: "Clé API",
      aiModelLabel: "Modèle Sélectionné",
      aiTestBtn: "⚡ Tester la Connexion IA",
      aiTesting: "Test en cours...",
      aiTestSuccess: "Connexion IA réussie ! Modèles chargés.",
      aiTestError: "Échec de la connexion. Vérifiez votre clé API.",
      
      msgTitle: "Architecture de Messagerie Professionnelle",
      msgSubtitle: "Gestion scindée de la Réception (IMAP) et de l'Envoi de Devis (SMTP)",
      
      inboundCardTitle: "📥 1. Réception & Lecture des Demandes Clients (IMAP)",
      inboundCardBadge: "Entrant",
      inboundCardDesc: "Connexion sécurisée à la boîte email de l'employé pour relever et extraire automatiquement les demandes entrantes",
      inboundProviderLabel: "Fournisseur de Messagerie",
      inboundEmailLabel: "Adresse Email de l'Employé",
      inboundAppPassLabel: "Mot de passe d'application (16 caractères)",
      inboundCustomHost: "Serveur IMAP Hôte",
      inboundCustomPort: "Port IMAP (SSL)",
      inboundGuideTitle: "Guide de configuration étape par étape :",
      inboundGuideGmail1: "Activez la validation en 2 étapes sur votre compte Google.",
      inboundGuideGmail2: "Créez un Mot de passe d'application nommé 'Cockpit IA' sur : myaccount.google.com/apppasswords",
      inboundGuideGmail3: "Collez les 16 caractères du mot de passe dans le champ ci-dessus.",
      inboundGuideOutlook1: "Générez un mot de passe d'application sur : account.live.com/proofs/AppPassword",
      inboundGuideOutlook2: "Collez votre email Outlook et votre mot de passe d'application ci-dessus.",
      inboundTestBtn: "⚡ Tester la Connexion IMAP",
      inboundTesting: "Connexion IMAP en cours...",
      inboundCheckNowBtn: "📥 Relever les emails maintenant (IA)",
      inboundChecking: "Relève & Analyse IA en cours...",
      
      outboundCardTitle: "🚀 2. Envoi des Devis & Réponses aux Clients (SMTP)",
      outboundCardBadge: "Sortant",
      outboundCardDesc: "Configuration du serveur SMTP pour garantir 100% de délivrabilité sans passer par les spams",
      outboundModeLabel: "Méthode d'Envoi",
      outboundModeTurbo: "turboSMTP (Recommandé pour Délivrabilité Maximale)",
      outboundModeSame: "1 Clic : Utiliser le même compte employé (Gmail / Outlook)",
      outboundModeCustom: "Serveur SMTP Personnalisé",
      outboundTurboNotice: "Le relais turboSMTP (pro.eu.turbo-smtp.com:465) achemine vos devis directement dans la boîte de réception des clients sans risque de blocage anti-spam.",
      outboundHostLabel: "Serveur SMTP Hôte",
      outboundPortLabel: "Port SMTP (SSL/TLS)",
      outboundUserLabel: "Nom d'utilisateur SMTP",
      outboundPassLabel: "Mot de passe SMTP / Clé API",
      outboundTestBtn: "⚡ Tester l'Envoi SMTP",
      outboundTesting: "Envoi d'un email de test...",
      
      pedagogicalTitle: "💡 Comprendre la Messagerie (IMAP vs SMTP)",
      pedagogicalSubtitle: "Pourquoi deux réglages distincts dans Cockpit IA ?",
      pedagogicalImapTitle: "1. Pourquoi IMAP pour lire les emails entrants ?",
      pedagogicalImapDesc: "IMAP (Internet Message Access Protocol) se connecte directement à la boîte de réception de l'employé pour relever les demandes clients en temps réel.",
      pedagogicalSmtpTitle: "2. Pourquoi SMTP / turboSMTP pour envoyer les devis ?",
      pedagogicalSmtpDesc: "SMTP (Simple Mail Transfer Protocol) est dédié uniquement à l'expédition. Des relais certifiés comme turboSMTP évitent tout classement en spam de vos devis officiels.",
      
      catTitle: "Synchronisation du Catalogue Produits",
      catSubtitle: "Importez vos produits depuis un fichier Excel (.xlsx, .csv) ou Google Sheets en direct",
      catUploadLabel: "Import Fichier Excel / CSV",
      catUploadDropzone: "Cliquez ou glissez-déposez votre catalogue (.xlsx, .xls, .csv)",
      catSheetsUrlLabel: "URL Publique Google Sheets",
      catSheetsSyncBtn: "Synchroniser depuis Google Sheets",
      catSyncing: "Synchronisation...",
      catSyncSuccess: "Catalogue synchronisé avec succès !",
      
      dbTitle: "Stockage & Persistance des Données",
      dbSubtitle: "Gestion du stockage local, Supabase Cloud ou instance PostgreSQL dédiée",
      dbModeLabel: "Mode de Base de Données",
      dbModeLocal: "Stockage Local SQLite / Fichier (Par défaut)",
      dbModeSupabase: "Base de Données Supabase Cloud",
      dbModePostgres: "PostgreSQL Personnalisé",
      dbSupabaseUrl: "URL du Projet Supabase",
      dbSupabaseKey: "Clé Anon Supabase",
      dbResetTitle: "Réinitialisation des Données",
      dbResetDesc: "Restaurer les articles de démonstration et les demandes d'exemples initiales.",
      dbResetBtn: "Restaurer les Données de Démo",
      dbResetConfirm: "Êtes-vous sûr de vouloir réinitialiser toutes les données ?",
      
      aboutTitle: "Cockpit IA Bureau",
      aboutDesc: "Plateforme d'automatisation commerciale et de réconciliation de stock pour distributeurs et PME.",
      aboutVersion: "Version",
      aboutReleaseDate: "Date de Sortie",
      aboutLicense: "Licence",
      
      saveAllBtn: "Enregistrer tous les Paramètres",
      savedToast: "Paramètres enregistrés avec succès !",
    },
    simulator: {
      title: "Simulateur d'Email Entrant",
      subtitle: "Injectez des exemples d'emails clients pour tester l'analyse IA et le chiffrage",
      selectSample: "Sélectionnez un scénario réaliste :",
      simulateBtn: "Traiter l'Email avec l'IA",
      simulating: "Analyse IA & Chiffrage...",
    },
  },
};
