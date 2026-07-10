/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Wifi, 
  Battery, 
  Signal, 
  Droplet, 
  RotateCcw, 
  Plus, 
  Copy, 
  Check, 
  Code, 
  Sparkles, 
  Info,
  Layers,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { kotlinFiles, KotlinFile } from "./kotlinCode";

// Interface pour les logs simulés
interface MockLog {
  id: string;
  amountMl: number;
  timeFormatted: string;
}

export default function App() {
  // --- ÉTAT DE L'ÉMULATEUR (SIMULATEUR DE L'APPLICATION ANDROID) ---
  const [currentVolume, setCurrentVolume] = useState<number>(1250); // initialisé à 1250ml conformément à la maquette élégante
  const goalVolume = 2000;
  const [logs, setLogs] = useState<MockLog[]>([
    { id: "1", amountMl: 250, timeFormatted: "08:15" },
    { id: "2", amountMl: 500, timeFormatted: "09:30" },
    { id: "3", amountMl: 500, timeFormatted: "10:45" },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<number>(250);

  // Calcule le pourcentage actuel
  const percentage = Math.min(Math.round((currentVolume / goalVolume) * 100), 250);
  const isGoalReached = currentVolume >= goalVolume;
  const remainingVolume = Math.max(0, goalVolume - currentVolume);

  // Déclencher un toast Android simulé
  const showAndroidToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Ajouter de l'eau
  const handleAddWater = (amount: number) => {
    const nextVolume = Math.min(currentVolume + amount, 5000); // Max 5L
    setCurrentVolume(nextVolume);
    
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    const newLog: MockLog = {
      id: Date.now().toString(),
      amountMl: amount,
      timeFormatted,
    };
    
    setLogs([newLog, ...logs]);
    
    // Toast Android
    if (currentVolume < goalVolume && nextVolume >= goalVolume) {
      showAndroidToast("🎉 Objectif atteint ! Bravo pour votre hydratation aujourd'hui !");
    } else {
      showAndroidToast(`+${amount} ml ajouté avec succès !`);
    }
  };

  // Réinitialiser le tracker
  const handleReset = () => {
    setCurrentVolume(0);
    setLogs([]);
    showAndroidToast("Tracker réinitialisé à 0 ml");
  };

  // Copier le code dans le presse-papiers
  const handleCopyCode = (file: KotlinFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFile(file.name);
    setTimeout(() => {
      setCopiedFile(null);
    }, 2000);
  };

  // --- HIGHLIGHTER DE KOTLIN ULTRA-SIMPLE ET ÉLÉGANT ---
  const highlightKotlinCode = (code: string) => {
    const keywords = [
      "package", "import", "class", "fun", "val", "var", "private", "data class", 
      "return", "when", "is", "as", "by", "emptyList", "listOf", "this", "override", 
      "super", "else", "if", "for", "while"
    ];
    
    const annotations = ["@Composable", "@OptIn", "@ExperimentalMaterial3Api", "@Override"];
    
    const types = [
      "String", "Int", "Boolean", "List", "StateFlow", "MutableStateFlow", "ViewModel", 
      "Modifier", "Color", "Canvas", "Scaffold", "Text", "Button", "IconButton", "Icon", 
      "Box", "Column", "Row", "LazyColumn", "Card", "Spacer", "Unit", "HydrationLog", 
      "HydrationUiState", "HydrationViewModel", "HydrationTrackerTheme", "Surface", 
      "Bundle", "ComponentActivity", "Typography", "Icons", "Default", "Refresh",
      "Float", "Double", "TopAppBar", "ButtonDefaults", "CardDefaults"
    ];

    let highlighted = code;

    // Échapper le HTML d'abord
    highlighted = highlighted
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Strings (oranges)
    highlighted = highlighted.replace(/("(.*?)")/g, '<span class="text-amber-300">$1</span>');

    // Commentaires (gris-vert)
    highlighted = highlighted.replace(/(\/\/.*)/g, '<span class="text-slate-500 italic">$1</span>');

    // Annotations (turquoise vif)
    annotations.forEach(ann => {
      const regex = new RegExp(`(${ann})`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-cyan-400 font-semibold">$1</span>');
    });

    // Mots clés (rose/violet)
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-fuchsia-400 font-medium">$1</span>');
    });

    // Types (bleu ciel)
    types.forEach(type => {
      const regex = new RegExp(`\\b(${type})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-emerald-300 font-medium">$1</span>');
    });

    // Chiffres / Nombres (turquoise clair)
    highlighted = highlighted.replace(/\b(\d+L?)\b/g, '<span class="text-[#80EFDB]">$1</span>');
    highlighted = highlighted.replace(/\b(\d+f)\b/g, '<span class="text-[#80EFDB]">$1</span>');

    return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <div className="min-h-screen bg-[#111318] text-[#E2E2E6] flex flex-col font-sans selection:bg-[#80EFDB] selection:text-slate-900">
      
      {/* HEADER DE L'APPLICATION */}
      <header className="border-b border-white/5 bg-[#111318]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-[#80EFDB] to-[#00D7C0] rounded-2xl shadow-lg shadow-[#80EFDB]/20">
              <Droplet className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#23262B] text-[#80EFDB] px-2 py-0.5 rounded border border-white/10">
                  Android &bull; Jetpack Compose
                </span>
              </div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">
                HydroCompose <span className="text-[#80EFDB] font-medium text-xs">Material 3 Elegant</span>
              </h1>
            </div>
          </div>

          <p className="text-xs text-white/55 text-center sm:text-right max-w-md leading-relaxed">
            Émulateur interactif Android de suivi d'hydratation avec cercle de progression dynamique SVG et architecture MVVM en Kotlin / Compose.
          </p>
        </div>
      </header>

      {/* ZONE PRINCIPALE DE GRILLE */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNE GAUCHE : ÉMULATEUR DE SMARTPHONE (SPAN 5) */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[370px]">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                Émulateur Mobile Interactif
              </span>
            </div>

            {/* LE CORPS DU TÉLÉPHONE (ELEGANT DARK STYLE FRAME) */}
            <div className="relative mx-auto bg-[#1A1C1E] rounded-[48px] p-4 shadow-2xl shadow-black/80 border-8 border-[#2E3032] aspect-[9/19] w-full flex flex-col justify-between overflow-hidden">
              
              {/* Écouteur supérieur du téléphone */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#2E3032] rounded-full z-20"></div>
              
              {/* Caméra poinçon */}
              <div className="absolute top-7 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-900 rounded-full"></div>
              </div>

              {/* ÉCRAN INTERNE DE L'APPLICATION */}
              <div className={`relative w-full h-[585px] rounded-[34px] overflow-hidden flex flex-col select-none transition-colors duration-300 ${isDarkTheme ? 'bg-[#121212] text-[#E2E2E6]' : 'bg-[#F9F9F9] text-[#111318]'}`}>
                
                {/* 1. STATUS BAR ANDROID */}
                <div className="h-10 px-6 pt-3.5 flex items-center justify-between text-xs font-semibold z-10 opacity-90">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3.5 h-3.5" />
                    <Wifi className="w-3.5 h-3.5" />
                    <div className="flex items-center gap-0.5 bg-current/20 rounded px-1 py-0.5 text-[9px] font-bold">
                      <span>87%</span>
                      <Battery className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 2. APP BAR (TOPAPPBAR JETPACK COMPOSE) */}
                <div className={`h-14 px-5 flex items-center justify-between border-b ${isDarkTheme ? 'border-neutral-800/80 bg-[#121212]' : 'border-neutral-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#80EFDB]/10 flex items-center justify-center">
                      <Droplet className="w-4 h-4 text-[#80EFDB] fill-[#80EFDB]" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white">Hydratation</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Switcher de Thème (Ajout pour démo de composabilité) */}
                    <button 
                      onClick={() => {
                        setIsDarkTheme(!isDarkTheme);
                        showAndroidToast(isDarkTheme ? "Thème clair activé" : "Thème sombre activé");
                      }}
                      className="p-1.5 rounded-full hover:bg-current/10 transition-colors"
                      title="Changer de thème"
                    >
                      {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#00D7C0]" />}
                    </button>

                    {/* Reset Button */}
                    <button 
                      onClick={handleReset}
                      className="p-1.5 rounded-full hover:bg-red-500/15 text-red-400/80 transition-colors"
                      title="Réinitialiser l'hydratation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. SCROLLABLE CONTAINER FOR SCREEN CONTENT */}
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6 scrollbar-none">
                  
                  {/* PROGRESS CIRCLE SECTION (ELEGANT DARK PATTERN) */}
                  <div className="flex flex-col items-center justify-center my-1">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      
                      {/* SVG pour le cercle de progression fluide */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          className={isDarkTheme ? 'stroke-neutral-800' : 'stroke-neutral-200'}
                          strokeWidth="8"
                        />
                        {/* Progress Arc */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="#80EFDB"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_6px_rgba(128,239,219,0.35)]"
                          initial={{ strokeDasharray: "276.46", strokeDashoffset: "276.46" }}
                          animate={{ 
                            strokeDashoffset: 276.46 - (276.46 * Math.min(percentage, 100)) / 100 
                          }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </svg>

                      {/* Center Text Area */}
                      <div className="z-10 text-center">
                        <motion.div 
                          key={currentVolume}
                          initial={{ scale: 0.9, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`text-3xl font-black tracking-tight ${isDarkTheme ? 'text-white' : 'text-neutral-900'}`}
                        >
                          {currentVolume}
                          <span className={`text-sm font-normal ml-1 ${isDarkTheme ? 'text-white/50' : 'text-neutral-500'}`}>ml</span>
                        </motion.div>
                        <div className="text-[10px] text-[#80EFDB] font-semibold tracking-wider mt-1 uppercase">
                          OBJECTIF: {(goalVolume / 1000).toFixed(1)}L
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* QUICK STATS CARD (ELEGANT DESIGN CARD) */}
                  <div className={`w-full ${isDarkTheme ? 'bg-[#23262B]' : 'bg-white border border-neutral-200'} rounded-[24px] p-4 flex justify-between items-center shadow-sm`}>
                    <div className="text-left">
                      <div className={`text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-white/50' : 'text-neutral-500'}`}>Progression</div>
                      <div className={`text-xl font-bold ${isDarkTheme ? 'text-[#E2E2E6]' : 'text-neutral-800'}`}>{percentage}%</div>
                    </div>
                    <div className={`h-8 w-px ${isDarkTheme ? 'bg-white/10' : 'bg-neutral-200'}`}></div>
                    <div className="text-right">
                      <div className={`text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-white/50' : 'text-neutral-500'}`}>Restant</div>
                      <div className={`text-xl font-bold ${isDarkTheme ? 'text-[#E2E2E6]' : 'text-neutral-800'}`}>
                        {remainingVolume}
                        <span className={`text-xs font-medium ${isDarkTheme ? 'text-white/50' : 'text-neutral-500'} ml-0.5`}>ml</span>
                      </div>
                    </div>
                  </div>

                  {/* MESSAGE SI OBJECTIF ATTEINT */}
                  <AnimatePresence>
                    {isGoalReached && (
                      <motion.div
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.92, opacity: 0 }}
                        className="bg-[#80EFDB]/10 border border-[#80EFDB]/20 rounded-2xl p-3 text-center"
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[#80EFDB] font-bold text-xs mb-1">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>Félicitations !</span>
                        </div>
                        <p className="text-[10.5px] opacity-90 leading-relaxed text-[#80EFDB]">
                          Objectif de 2.0L atteint ! Vous êtes parfaitement hydraté aujourd'hui.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CONTROLES ET AJOUT RAPIDE */}
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[150, 250, 500].map((vol) => (
                        <button
                          key={vol}
                          onClick={() => setSelectedQuickAdd(vol)}
                          className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedQuickAdd === vol 
                              ? 'bg-[#80EFDB]/15 border-[#80EFDB] text-[#80EFDB]' 
                              : isDarkTheme 
                                ? 'bg-[#1C1B1F] border-neutral-800/80 text-neutral-400 hover:bg-neutral-850' 
                                : 'bg-neutral-100 border-neutral-200 text-neutral-650 hover:bg-neutral-200'
                          }`}
                        >
                          {vol} ml
                        </button>
                      ))}
                    </div>

                    {/* BOUTON D'ACTION PRINCIPAL ELEGANT */}
                    <button
                      onClick={() => handleAddWater(selectedQuickAdd)}
                      className="w-full h-14 bg-[#80EFDB] hover:bg-[#68d7c4] text-[#111318] rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all font-bold text-sm shadow-md shadow-[#80EFDB]/10"
                    >
                      <Plus className="w-4 h-4 stroke-[3.5]" />
                      <span>Ajouter {selectedQuickAdd}ml</span>
                    </button>
                  </div>

                  {/* SECTION HISTORIQUE DE L'EMULATEUR */}
                  <div className="flex-1 flex flex-col gap-2 min-h-[110px]">
                    <span className={`text-[11px] font-bold opacity-60 ${isDarkTheme ? 'text-white' : 'text-neutral-900'}`}>Aujourd'hui</span>
                    
                    {logs.length === 0 ? (
                      <div className={`flex-1 flex items-center justify-center rounded-2xl border border-dashed ${isDarkTheme ? 'border-neutral-800' : 'border-neutral-200'}`}>
                        <span className="text-xs opacity-40">Aucune boisson</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto scrollbar-none pr-1">
                        {logs.slice(0, 3).map((log) => (
                          <div 
                            key={log.id} 
                            className={`flex items-center justify-between p-2 rounded-xl border text-[11px] ${isDarkTheme ? 'bg-[#1C1B1F] border-neutral-800/85' : 'bg-white border-neutral-200'}`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">💧</span>
                              <span className="font-medium">Eau ajoutée</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#80EFDB]">+{log.amountMl} ml</span>
                              <span className="opacity-45 text-[9px]">{log.timeFormatted}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* TOAST ANDROID SIMULÉ */}
                <AnimatePresence>
                  {toastMessage && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 15, opacity: 0 }}
                      className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#2E3032] text-white text-[11px] px-4 py-2 rounded-xl shadow-xl z-50 text-center max-w-[85%] border border-white/5"
                    >
                      {toastMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4. BARRE DE NAVIGATION SIMULÉE EN BAS */}
                <div className={`h-16 flex justify-around items-center px-6 border-t ${isDarkTheme ? 'bg-[#121212] border-white/5' : 'bg-white border-neutral-200'}`}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-12 h-6 bg-[#3E4745] rounded-full flex items-center justify-center text-[#80EFDB]">
                      <Droplet className="w-4 h-4 fill-current" />
                    </div>
                    <span className={`text-[9px] font-bold ${isDarkTheme ? 'text-[#E2E2E6]' : 'text-neutral-850'}`}>Aujourd'hui</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 opacity-40">
                    <Code className="w-4 h-4" />
                    <span className="text-[9px] font-medium">Logs</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full"></div>

              </div>
            </div>
            
            {/* Design Metadata Box */}
            <div className="mt-4 p-4 bg-[#1A1C1E] border border-white/5 rounded-[24px] text-xs text-white/40">
              <span className="font-bold text-[#80EFDB] block uppercase tracking-wider mb-1 text-[10px]">Material 3 Specs</span>
              <p className="leading-relaxed text-[11px]">
                Teinte accentuée turquoise <span className="text-[#80EFDB] font-mono">#80EFDB</span> combinée avec un fond d'écran sombre élégant <span className="text-white/60 font-mono">#111318</span> et des surfaces de carte structurées <span className="text-white/60 font-mono">#23262B</span>.
              </p>
            </div>
          </div>
        </section>

        {/* COLONNE DROITE : EXPLORATEUR DE CODE KOTLIN (SPAN 7) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-[#1A1C1E] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl">
            
            {/* Header du bloc de code */}
            <div className="bg-[#111318] p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#80EFDB]/10 rounded-lg text-[#80EFDB]">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/45 font-mono block">Code Source Jetpack Compose</span>
                  <span className="text-sm font-bold text-white font-mono">{kotlinFiles[activeTab].name}</span>
                </div>
              </div>

              {/* Sélecteurs de fichiers */}
              <div className="flex flex-wrap gap-1.5">
                {kotlinFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      activeTab === idx 
                        ? 'bg-[#80EFDB]/15 text-[#80EFDB] font-bold border border-[#80EFDB]/20' 
                        : 'text-white/45 hover:text-white/90 hover:bg-[#111318] border border-transparent'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Path & Description */}
            <div className="bg-[#111318]/50 px-4 py-2.5 border-b border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
              <span className="truncate">📁 {kotlinFiles[activeTab].path}</span>
              <button
                onClick={() => handleCopyCode(kotlinFiles[activeTab])}
                className="flex items-center gap-1.5 text-[#80EFDB] hover:text-[#80EFDB]/80 font-sans font-semibold transition-colors shrink-0 ml-4 bg-[#111318] px-2.5 py-1 rounded-xl border border-white/5"
              >
                {copiedFile === kotlinFiles[activeTab].name ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>

            {/* Description du rôle du fichier */}
            <div className="p-4 bg-[#1A1C1E] border-b border-white/5 text-xs text-white/70 flex gap-3 items-start">
              <Info className="w-4 h-4 text-[#80EFDB] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11.5px]">
                <span className="font-bold text-white">Rôle : </span>
                {kotlinFiles[activeTab].explanation}
              </p>
            </div>

            {/* Visualiseur de code avec coloration syntaxique */}
            <div className="p-5 bg-[#111318] overflow-x-auto font-mono text-[11.5px] leading-relaxed max-h-[480px] overflow-y-auto scrollbar-thin">
              <pre className="text-slate-300 select-all">
                {highlightKotlinCode(kotlinFiles[activeTab].code)}
              </pre>
            </div>

          </div>

          {/* SECTION ANALYSE ARCHITECTURALE */}
          <div className="bg-[#1A1C1E] border border-white/5 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-[#80EFDB]" />
              <span className="uppercase tracking-wider">Architecture Compose de Production</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 bg-[#111318] rounded-2xl border border-white/5">
                <span className="font-bold text-[#80EFDB] block mb-1.5">Unidirectional Data Flow (UDF)</span>
                <p className="text-white/50 leading-relaxed text-[11px]">
                  L'état est géré au sein de <code className="text-[#80EFDB] font-semibold">HydrationViewModel</code> par un <code className="text-emerald-300">StateFlow</code> immuable de type <code className="text-emerald-300">HydrationUiState</code>. L'interface recompose l'UI à chaque mise à jour.
                </p>
              </div>

              <div className="p-4 bg-[#111318] rounded-2xl border border-white/5">
                <span className="font-bold text-[#80EFDB] block mb-1.5">Tracé Vectoriel Canvas</span>
                <p className="text-white/50 leading-relaxed text-[11px]">
                  Le cercle est dessiné par <code className="text-[#80EFDB] font-semibold">Canvas</code> pour une performance optimale. L'arc de progression est animé dynamiquement par le moteur d'animation natif de Jetpack Compose.
                </p>
              </div>

              <div className="p-4 bg-[#111318] rounded-2xl border border-white/5">
                <span className="font-bold text-[#80EFDB] block mb-1.5">Thème Sombre & Turquoise</span>
                <p className="text-white/50 leading-relaxed text-[11px]">
                  Le fichier <code className="text-[#80EFDB] font-semibold">Theme.kt</code> injecte un <code className="text-emerald-300">darkColorScheme</code> où le turquoise est défini comme couleur primaire, assurant la parfaite adéquation esthétique.
                </p>
              </div>

              <div className="p-4 bg-[#111318] rounded-2xl border border-white/5">
                <span className="font-bold text-[#80EFDB] block mb-1.5">Mises à jour atomiques</span>
                <p className="text-white/50 leading-relaxed text-[11px]">
                  L'utilisation de la fonction d'extension <code className="text-emerald-300 font-semibold">update</code> garantit la concurrence et l'asynchronisme sécurisés de l'état, conformément aux prérequis de production.
                </p>
              </div>

            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#111318]/50 text-center py-6 text-xs text-white/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Simulation Android Jetpack Compose interactive &bull; Material Design 3</span>
          <span>Google AI Studio Build &bull; 2026</span>
        </div>
      </footer>

    </div>
  );
}
