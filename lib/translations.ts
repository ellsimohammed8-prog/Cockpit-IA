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
    aiSysPromptTitle: string;
    aiSysPromptDesc: string;
    aiSysPromptResetBtn: string;
    aiBaseUrlLabel: string;
    aiCustomModelLabel: string;
    aiChooseFromList: string;
    aiEnterManually: string;
    aiDetectedModels: string;
    aiMockActiveMsg: string;
    aiSimulatedFallbackNotice: string;
    
    // Messaging Tab
    msgTitle: string;
    msgSubtitle: string;
    
    inboundCardTitle: string;
    inboundCardBadge: string;
    inboundCardDesc: string;
    inboundProviderLabel: string;
    inboundEmailLabel: string;
    inboundAppPassLabel: string;
    inboundCreateGoogle: string;
    inboundCreateMicrosoft: string;
    inboundCustomHost: string;
    inboundCustomPort: string;
    inboundGuideTitle: string;
    inboundGuideGmail1: string;
    inboundGuideGmail2: string;
    inboundGuideGmail3: string;
    inboundGuideOutlook1: string;
    inboundGuideOutlook2: string;
    inboundGuideCustom: string;
    inboundTestBtn: string;
    inboundTesting: string;
    inboundCheckNowBtn: string;
    inboundChecking: string;
    inboundAutoSyncLabel: string;
    
    outboundCardTitle: string;
    outboundCardBadge: string;
    outboundCardDesc: string;
    outboundModeLabel: string;
    outboundModeTurbo: string;
    outboundModeTurboDesc: string;
    outboundModeSame: string;
    outboundModeSameDesc: string;
    outboundModeCustom: string;
    outboundModeCustomDesc: string;
    outboundTurboNotice: string;
    outboundSameNotice: string;
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
    catUploadHint: string;
    catBrowseBtn: string;
    catSheetsUrlLabel: string;
    catSheetsSyncBtn: string;
    catSheetsHint: string;
    catSyncing: string;
    catSyncSuccess: string;
    catAutoDeductLabel: string;
    
    // Database Tab
    dbTitle: string;
    dbSubtitle: string;
    dbModeLabel: string;
    dbModeLocal: string;
    dbModeLocalDesc: string;
    dbModeSupabase: string;
    dbModeSupabaseDesc: string;
    dbModePostgres: string;
    dbModePostgresDesc: string;
    dbSupabaseUrl: string;
    dbSupabaseKey: string;
    dbPgHost: string;
    dbPgPort: string;
    dbPgDatabase: string;
    dbPgUser: string;
    dbPgPassword: string;
    dbPgUri: string;
    dbTestBtn: string;
    dbTesting: string;
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
    
    activeModelBadge: string;
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
      aiProviderLabel: "Select your Artificial Intelligence Provider:",
      aiApiKeyLabel: "API Key",
      aiModelLabel: "Selected Model",
      aiTestBtn: "⚡ Test AI Connection",
      aiTesting: "Testing Connection...",
      aiTestSuccess: "AI Connection Successful! Models loaded.",
      aiTestError: "Connection failed. Please check your API key.",
      aiSysPromptTitle: "System Prompt & Business Instructions",
      aiSysPromptDesc: "Customize analysis instructions and AI behavior for quotation extraction.",
      aiSysPromptResetBtn: "Reset to Default",
      aiBaseUrlLabel: "API Base URL:",
      aiCustomModelLabel: "Custom Model Name:",
      aiChooseFromList: "Choose from list",
      aiEnterManually: "+ Enter manually",
      aiDetectedModels: "model(s) detected via API",
      aiMockActiveMsg: "Demo / Mock Mode Active (No key)",
      aiSimulatedFallbackNotice: "In the absence of a key, the intelligent simulation engine seamlessly handles all operations.",
      
      msgTitle: "Professional Email Architecture: Intelligent Ingestion & Guaranteed Deliverability",
      msgSubtitle: "The system operates in 2 clear steps: 1. Inbound IMAP to fetch and analyze customer requests sent to your employee, and 2. Outbound SMTP to dispatch official quotes and invoices directly to inboxes without spam.",
      
      inboundCardTitle: "📥 1. Customer Email Reception & Reading (IMAP)",
      inboundCardBadge: "Inbound IMAP",
      inboundCardDesc: "Securely connect employee email account (Google Workspace, Gmail, Outlook, or Webmail)",
      inboundProviderLabel: "Employee Email Box Type:",
      inboundEmailLabel: "Employee Email Address:",
      inboundAppPassLabel: "Application Password (16 characters):",
      inboundCreateGoogle: "Generate on Google ↗",
      inboundCreateMicrosoft: "Generate on Microsoft ↗",
      inboundCustomHost: "IMAP Host Server:",
      inboundCustomPort: "IMAP Port (SSL):",
      inboundGuideTitle: "Step-by-step connection guide in 3 steps:",
      inboundGuideGmail1: "Enable 2-Step Verification on your Google account.",
      inboundGuideGmail2: "Open the App Passwords page:",
      inboundGuideGmail3: "Generate an app password named 'Cockpit AI' and paste the 16 letters above.",
      inboundGuideOutlook1: "Log in to Microsoft security page: account.live.com/proofs/AppPassword",
      inboundGuideOutlook2: "Generate an app password for 'Cockpit AI' and paste it above.",
      inboundGuideCustom: "Enter your corporate IMAP server address (e.g. mail.your-company.com:993) and standard credentials.",
      inboundTestBtn: "⚡ Test IMAP Connection",
      inboundTesting: "Connecting to IMAP...",
      inboundCheckNowBtn: "📥 Fetch New Emails Now (AI)",
      inboundChecking: "Fetching & Analyzing...",
      inboundAutoSyncLabel: "Automatic background sync every minute",
      
      outboundCardTitle: "🚀 2. Quote Dispatch & Customer Responses (SMTP)",
      outboundCardBadge: "Outbound SMTP",
      outboundCardDesc: "Dispatches validated quotes automatically to customers with guaranteed deliverability",
      outboundModeLabel: "Quote Dispatching Method:",
      outboundModeTurbo: "👑 turboSMTP (Recommended)",
      outboundModeTurboDesc: "Zero Spam & Guaranteed Deliverability for SMEs.",
      outboundModeSame: "⚡ Same Employee Account",
      outboundModeSameDesc: "Directly uses the account configured in Step 1.",
      outboundModeCustom: "🖥️ Dedicated SMTP Server / cPanel",
      outboundModeCustomDesc: "Advanced setup with custom host and port.",
      outboundTurboNotice: "turboSMTP relay (pro.eu.turbo-smtp.com:465) delivers your commercial quotes directly to client inboxes with high sender reputation.",
      outboundSameNotice: "Quotes will be sent using your employee address via the official SMTP server.",
      outboundHostLabel: "SMTP Host Server:",
      outboundPortLabel: "SMTP Port (SSL/TLS):",
      outboundUserLabel: "SMTP Username (Consumer Key):",
      outboundPassLabel: "SMTP Password (Consumer Secret):",
      outboundTestBtn: "⚡ Test SMTP Sending (Test Email)",
      outboundTesting: "Sending Test Email...",
      
      pedagogicalTitle: "💡 Understanding the Architecture: Why Two Separate Protocols?",
      pedagogicalSubtitle: "Why are there two distinct email settings in Cockpit AI?",
      pedagogicalImapTitle: "📥 IMAP (Reading & Ingestion):",
      pedagogicalImapDesc: "Connects directly to the employee's inbox (Gmail, Outlook, Webmail) so AI can read customer emails, extract items, and prepare quotes.",
      pedagogicalSmtpTitle: "🚀 SMTP / turboSMTP (Dispatching):",
      pedagogicalSmtpDesc: "Delivers quotes to the customer. Professional relays like turboSMTP ensure your formal PDF quotes and emails never land in client spam folders.",
      
      catTitle: "Product Catalog & Stock Synchronization",
      catSubtitle: "Import products from Excel spreadsheets (.xlsx, .csv) or live Google Sheets",
      catUploadLabel: "1. Import an Excel (.xlsx, .xls) or CSV file:",
      catUploadDropzone: "Drag and drop your spreadsheet file here, or click to browse",
      catUploadHint: "Supports .xlsx, .xls, and .csv formats (SKU, Name, Quantity, Price excl. VAT, Category)",
      catBrowseBtn: "Browse files",
      catSheetsUrlLabel: "2. Or sync via a public Google Sheets or online Excel / CSV link:",
      catSheetsSyncBtn: "Sync Catalog",
      catSheetsHint: "💡 Compatible with public Google Sheets, OneDrive, SharePoint, or hosted .xlsx / .csv files.",
      catSyncing: "Synchronizing...",
      catSyncSuccess: "Catalog synchronized successfully!",
      catAutoDeductLabel: "Automatically deduct quantities from stock upon order approval",
      
      dbTitle: "Storage & Persistence",
      dbSubtitle: "Configure local storage, Supabase cloud database, or custom PostgreSQL instance",
      dbModeLabel: "Choose your Data Storage Mode:",
      dbModeLocal: "1. Local Storage",
      dbModeLocalDesc: "Zero configuration required. Ideal for local testing and standalone usage.",
      dbModeSupabase: "2. Supabase Cloud",
      dbModeSupabaseDesc: "REST API connection via official Supabase SDK.",
      dbModePostgres: "3. Dedicated PostgreSQL",
      dbModePostgresDesc: "Direct PostgreSQL pooler connection for enterprise databases.",
      dbSupabaseUrl: "Supabase Project URL:",
      dbSupabaseKey: "Supabase Anon Key:",
      dbPgHost: "PostgreSQL Host:",
      dbPgPort: "Port:",
      dbPgDatabase: "Database Name:",
      dbPgUser: "Username:",
      dbPgPassword: "Password:",
      dbPgUri: "PostgreSQL Connection String (URI):",
      dbTestBtn: "⚡ Test DB Connection",
      dbTesting: "Testing DB Connection...",
      dbResetTitle: "Reset Demo Data",
      dbResetDesc: "Restore original sample products and customer requests for demonstration purposes.",
      dbResetBtn: "Reset Local Data (Reset)",
      dbResetConfirm: "Are you sure you want to reset all data to default demo state?",
      
      aboutTitle: "Cockpit AI Desktop",
      aboutDesc: "Next-generation B2B sales automation and stock reconciliation platform for distributors and SMEs.",
      aboutVersion: "Version",
      aboutReleaseDate: "Release Date",
      aboutLicense: "License",
      
      activeModelBadge: "Active model:",
      saveAllBtn: "Save Settings",
      savedToast: "Saved!",
    },
    simulator: {
      title: "Inbound Customer Simulator",
      subtitle: "Test the AI engine live with 3 realistic B2B scenarios or free-form text.",
      selectSample: "Choose a scenario:",
      simulateBtn: "Simulate Inbound & Analyze",
      simulating: "AI Extraction in progress...",
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
      aiProviderLabel: "Sélectionnez votre Fournisseur d'Intelligence Artificielle :",
      aiApiKeyLabel: "Clé d'API",
      aiModelLabel: "Modèle Sélectionné",
      aiTestBtn: "⚡ Tester la Connexion IA",
      aiTesting: "Test en cours...",
      aiTestSuccess: "Connexion IA réussie ! Modèles chargés.",
      aiTestError: "Échec de la connexion. Vérifiez votre clé API.",
      aiSysPromptTitle: "Prompt Système & Instructions Métier",
      aiSysPromptDesc: "Personnalisez les consignes d'analyse et le comportement de l'IA pour l'extraction de vos devis.",
      aiSysPromptResetBtn: "Rétablir par défaut",
      aiBaseUrlLabel: "Base URL de l'API :",
      aiCustomModelLabel: "Modèle Custom :",
      aiChooseFromList: "Choisir dans la liste",
      aiEnterManually: "+ Saisir manuellement",
      aiDetectedModels: "modèle(s) détecté(s) via l'API",
      aiMockActiveMsg: "Mode Démo / Mock Actif (Sans clé)",
      aiSimulatedFallbackNotice: "En l'absence de clé, le moteur intelligent de simulation prend le relais de manière fluide.",
      
      msgTitle: "Messagerie Professionnelle : Réception Intelligente & Envoi Haute Délivrabilité",
      msgSubtitle: "Le système fonctionne en 2 étapes claires : 1. Lecture IMAP pour récupérer et analyser les demandes des clients envoyées à votre employé, et 2. Envoi SMTP pour expédier les devis et factures officiels sans passer par les spams.",
      
      inboundCardTitle: "📥 1. Réception & Lecture des Demandes Clients (IMAP)",
      inboundCardBadge: "Inbound IMAP",
      inboundCardDesc: "Connectez la boîte de réception de l'employé (Google Workspace, Gmail, Outlook ou Webmail)",
      inboundProviderLabel: "Type de Boîte Email de l'Employé :",
      inboundEmailLabel: "Adresse Email de l'Employé :",
      inboundAppPassLabel: "Mot de Passe d'Application (16 lettres) :",
      inboundCreateGoogle: "Créer sur Google ↗",
      inboundCreateMicrosoft: "Créer sur Microsoft ↗",
      inboundCustomHost: "Hôte IMAP (Serveur de Réception) :",
      inboundCustomPort: "Port IMAP (SSL) :",
      inboundGuideTitle: "Comment activer la lecture du compte en 3 étapes :",
      inboundGuideGmail1: "Activez la validation en 2 étapes sur votre compte Google.",
      inboundGuideGmail2: "Ouvrez directement la page :",
      inboundGuideGmail3: "Créez un mot de passe nommé « Cockpit IA » et collez les 16 lettres ci-dessus.",
      inboundGuideOutlook1: "Connectez-vous à la page de sécurité Microsoft : account.live.com/proofs/AppPassword",
      inboundGuideOutlook2: "Générez un mot de passe d'application pour « Cockpit IA » et collez-le ci-dessus.",
      inboundGuideCustom: "Renseignez l'adresse de votre serveur IMAP d'entreprise (ex: mail.votre-entreprise.fr:993) et vos identifiants habituels.",
      inboundTestBtn: "⚡ Tester IMAP",
      inboundTesting: "Test IMAP...",
      inboundCheckNowBtn: "📥 Relever les emails (IA)",
      inboundChecking: "Relève en cours...",
      inboundAutoSyncLabel: "Relève automatique toutes les minutes",
      
      outboundCardTitle: "🚀 2. Envoi des Devis & Réponses aux Clients (SMTP)",
      outboundCardBadge: "Outbound SMTP",
      outboundCardDesc: "Expédie les devis validés automatiquement aux clients avec haute délivrabilité",
      outboundModeLabel: "Méthode d'Expédition des Devis :",
      outboundModeTurbo: "👑 turboSMTP (Recommandé)",
      outboundModeTurboDesc: "Zéro Spam & Délivrabilité garantie pour PME.",
      outboundModeSame: "⚡ Même compte",
      outboundModeSameDesc: "Utilise directement le compte configuré à l'étape 1.",
      outboundModeCustom: "🖥️ Serveur SMTP Dédié / cPanel",
      outboundModeCustomDesc: "Configuration avancée avec hôte et port personnalisés.",
      outboundTurboNotice: "Le relais turboSMTP (pro.eu.turbo-smtp.com:465) achemine vos devis directement dans la boîte de réception des clients sans risque de blocage anti-spam.",
      outboundSameNotice: "Les devis seront expédiés avec l'adresse de votre employé via le serveur SMTP officiel.",
      outboundHostLabel: "Hôte SMTP :",
      outboundPortLabel: "Port SMTP :",
      outboundUserLabel: "Identifiant SMTP (Consumer Key) :",
      outboundPassLabel: "Mot de Passe SMTP (Consumer Secret) :",
      outboundTestBtn: "⚡ Tester l'Envoi SMTP (Email de test)",
      outboundTesting: "Envoi du test SMTP...",
      
      pedagogicalTitle: "💡 Comprendre l'Architecture : Pourquoi Deux Protocoles ?",
      pedagogicalSubtitle: "Pourquoi deux réglages distincts dans Cockpit IA ?",
      pedagogicalImapTitle: "📥 IMAP (Lecture & Réception) :",
      pedagogicalImapDesc: "Sert à ouvrir la boîte de réception de l'employé pour que l'IA puisse lire les emails des clients, extraire les articles demandés et préparer les devis.",
      pedagogicalSmtpTitle: "🚀 SMTP / turboSMTP (Expédition) :",
      pedagogicalSmtpDesc: "Sert à déposer les devis chez le client. Des services comme turboSMTP garantissent que le devis arrive directement dans la boîte de réception du client sans passer par les spams.",
      
      catTitle: "Synchronisation du Catalogue Produits",
      catSubtitle: "Importez vos produits depuis un fichier Excel (.xlsx, .csv) ou Google Sheets en direct",
      catUploadLabel: "1. Importer un fichier Excel (.xlsx, .xls) ou CSV :",
      catUploadDropzone: "Glissez-déposez votre fichier ici, ou cliquez pour parcourir",
      catUploadHint: "Prend en charge les formats .xlsx, .xls et .csv (SKU, Nom, Quantité, Prix HT, Catégorie)",
      catBrowseBtn: "Parcourir les fichiers",
      catSheetsUrlLabel: "2. Ou synchroniser via un lien Google Sheets ou fichier Excel / CSV en ligne :",
      catSheetsSyncBtn: "Synchroniser le Catalogue",
      catSheetsHint: "💡 Compatible avec les liens publics Google Sheets, OneDrive, SharePoint ou fichiers .xlsx / .csv hébergés.",
      catSyncing: "Synchronisation...",
      catSyncSuccess: "Catalogue synchronisé avec succès !",
      catAutoDeductLabel: "Déduire automatiquement les quantités du stock lors de l'approbation d'une commande",
      
      dbTitle: "Stockage & Persistance des Données",
      dbSubtitle: "Choisissez votre Mode de Stockage des Données :",
      dbModeLabel: "Choisissez votre Mode de Stockage des Données :",
      dbModeLocal: "1. Stockage Local",
      dbModeLocalDesc: "Zéro configuration requise. Idéal pour tester immédiatement en local.",
      dbModeSupabase: "2. Supabase Cloud",
      dbModeSupabaseDesc: "Connexion API REST via SDK Supabase officiel.",
      dbModePostgres: "3. PostgreSQL Dédié",
      dbModePostgresDesc: "Connexion directe par pooler pour bases de données entreprise.",
      dbSupabaseUrl: "URL du Projet Supabase :",
      dbSupabaseKey: "Clé Publique / Anon Key :",
      dbPgHost: "Hôte PostgreSQL :",
      dbPgPort: "Port :",
      dbPgDatabase: "Base de Données :",
      dbPgUser: "Utilisateur (User) :",
      dbPgPassword: "Mot de Passe :",
      dbPgUri: "Chaîne de Connexion PostgreSQL (Connection URI) :",
      dbTestBtn: "⚡ Tester la connexion BDD",
      dbTesting: "Test de connexion en cours...",
      dbResetTitle: "Réinitialiser les données locales",
      dbResetDesc: "Rétablit les articles de démonstration et les demandes d'exemple.",
      dbResetBtn: "Réinitialiser les données locales (Reset)",
      dbResetConfirm: "Êtes-vous sûr de vouloir réinitialiser la base de données ?",
      
      aboutTitle: "Cockpit IA Bureau",
      aboutDesc: "Plateforme d'automatisation commerciale et réconciliation de stock pour PME et distributeurs.",
      aboutVersion: "Version",
      aboutReleaseDate: "Date de Sortie",
      aboutLicense: "Licence",
      
      activeModelBadge: "Modèle actif :",
      saveAllBtn: "Enregistrer la configuration",
      savedToast: "Enregistré !",
    },
    simulator: {
      title: "Simulateur d'Entrée Client (Inbound Ingestion)",
      subtitle: "Testez la robustesse du moteur IA en direct avec les 3 cas d'usage ou un message libre.",
      selectSample: "Sélectionnez un scénario :",
      simulateBtn: "Simuler la Réception & Analyser",
      simulating: "Extraction IA en cours...",
    },
  },
};
