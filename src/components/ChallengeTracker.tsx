import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge, ProofSubmission } from '../types';
import { 
  Lock, 
  Unlock, 
  Clock, 
  MapPin, 
  Camera, 
  Terminal, 
  ArrowLeft, 
  UploadCloud, 
  Smartphone, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle,
  FileText,
  Activity,
  UserCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ChallengeTrackerProps {
  challenge: Challenge;
  onUpdateStatus: (id: string, status: Challenge['status'], submission?: ProofSubmission) => void;
  onBack: () => void;
}

export default function ChallengeTracker({ 
  challenge, 
  onUpdateStatus, 
  onBack 
}: ChallengeTrackerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 99999 });
  const [isExpired, setIsExpired] = useState(false);

  // File upload fields
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [serviceLink, setServiceLink] = useState('');

  // AI Verification workflow states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(-1);
  const [isFraudDetected, setIsFraudDetected] = useState(false); // Can trigger a simulated fraud test
  const [verificationFinished, setVerificationFinished] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);

  // File selector reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logsSequence = [
    { text: "> Initialisation du processus d'arbitrage sécurisé Rise Up...", delay: 600 },
    { text: `> Extraction des paramètres du pacte : "${challenge.title}" - Stake: ${challenge.stakeAmount}€`, delay: 700 },
    { text: `> Analyse de la méthode de validation exigée : [${challenge.proofType.toUpperCase()}]`, delay: 600 },
    { text: "> Vérification de la signature du jeton de séquestre Stripe...", delay: 800 },
    { text: "> Examen de l'empreinte cryptographique de la preuve soumise...", delay: 900 },
    { text: "> Algorithme : Fouille des données EXIF d'origine et analyse de falsification temporelle...", delay: 1000 },
    { text: "> Algorithme : Validation spatiale et géographique des données de capteur...", delay: 800 },
    { text: "> Algorithme : Comparaison sémantique par réseau de neurones face à la description initiale...", delay: 1100 },
    { text: "> Décision finale : Intégrité validée à 100%. Aucune anomalie détectée.", delay: 500 }
  ];

  // Live Timer Count Down
  useEffect(() => {
    if (challenge.status !== 'active') return;

    const calculateTime = () => {
      const difference = new Date(challenge.deadlineAt).getTime() - Date.now();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        setIsExpired(true);
        // Automatically mark as failed if deadline is reached without proof
        onUpdateStatus(challenge.id, 'failed');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: difference });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [challenge, onUpdateStatus]);

  // Simulate verification typewriter logs
  useEffect(() => {
    if (!isVerifying) return;
    if (activeLogIndex < logsSequence.length - 1) {
      const nextIndex = activeLogIndex + 1;
      const timer = setTimeout(() => {
        setVerificationLogs(prev => [...prev, logsSequence[nextIndex].text]);
        setActiveLogIndex(nextIndex);
      }, logsSequence[nextIndex].delay);
      return () => clearTimeout(timer);
    } else {
      // Loop finished, declare final verdict
      setTimeout(() => {
        setVerificationFinished(true);
        if (isFraudDetected) {
          setVerificationResult('failed');
        } else {
          setVerificationResult('success');
        }
      }, 1200);
    }
  }, [isVerifying, activeLogIndex]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const objectUrl = URL.createObjectURL(file);
      setSelectedFileUrl(objectUrl);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setSelectedFileUrl(objectUrl);
    }
  };

  // Preset file samples for quick testing
  const selectMockFile = (url: string) => {
    setSelectedFileUrl(url);
  };

  // Prefill GPS coordinates for simulation
  const fetchMockGPS = () => {
    setGpsLocation("48.8584° N, 2.2945° E (Champ de Mars - Paris)");
  };

  // Prefill API checkout URL
  const fetchMockAPICommit = () => {
    setServiceLink("https://github.com/taapit/riseup/commit/e31f0cfb3f9");
  };

  // Trigger simulated AI arbitration
  const handleStartArbitration = (forceFraud: boolean = false) => {
    setIsFraudDetected(forceFraud);
    setIsVerifying(true);
    setVerificationLogs([]);
    setActiveLogIndex(-1);
    setVerificationFinished(false);
    setVerificationResult(null);

    // Launch submission status and transition styles
    onUpdateStatus(challenge.id, 'pending_verification');
  };

  // Complete simulation
  const applyArbitrationDecision = () => {
    const isSuccess = verificationResult === 'success';
    
    const submission: ProofSubmission = {
      fileUrl: selectedFileUrl || undefined,
      gpsLocation: gpsLocation || undefined,
      comment: comment || undefined,
      timestamp: new Date().toISOString()
    };

    onUpdateStatus(challenge.id, isSuccess ? 'success' : 'failed', submission);
    
    // Clean states
    setIsVerifying(false);
    setVerificationFinished(false);
    setVerificationResult(null);
  };

  const getProofTypeIcon = () => {
    switch (challenge.proofType) {
      case 'gps': return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'api': return <Terminal className="w-5 h-5 text-blue-600" />;
      default: return <Camera className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatDateFrench = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  return (
    <div id="challenge-tracker-root" className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au Tableau de Bord
        </button>
        
        <span className="text-[10px] font-bold font-mono tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2.5 py-1 rounded-lg uppercase">
          ID: {challenge.id.substring(challenge.id.length - 8).toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timer and Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Transition "Curseur à Chrono" style */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="w-24 h-24 stroke-1" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">
                Pacte Actif d&apos;Acier
              </span>
              <h3 className="text-xl font-bold tracking-tight mt-1 leading-tight">{challenge.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">{challenge.description}</p>
            </div>

            {/* Countdown layout */}
            {challenge.status === 'active' && (
              <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                <div className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                  Temps de réalisation restant
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center select-none font-mono">
                  
                  {/* Days */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="block text-xl font-black text-white">{timeLeft.days}</span>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">jours</span>
                  </div>

                  {/* Hours */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="block text-xl font-black text-white">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">heures</span>
                  </div>

                  {/* Mins */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 animate-pulse">
                    <span className="block text-xl font-black text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">mins</span>
                  </div>

                  {/* Secs */}
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="block text-xl font-black text-blue-500">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">secs</span>
                  </div>

                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Échéance: {formatDateFrench(challenge.deadlineAt)}</span>
                </div>
              </div>
            )}

            {/* Inactive details */}
            {challenge.status !== 'active' && (
              <div className="pt-6 mt-6 border-t border-white/5 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Créé le:</span>
                  <span className="font-mono text-slate-350">{challenge.createdAt.split('T')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold font-mono ${
                    challenge.status === 'success' ? 'text-emerald-400' :
                    challenge.status === 'failed' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {challenge.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Séquestre Stripe:</span>
                  <span className={`font-bold font-mono ${
                    challenge.escrowStatus === 'refunded' ? 'text-emerald-400' :
                    challenge.escrowStatus === 'forfeited' ? 'text-rose-500' : 'text-amber-500'
                  }`}>
                    {challenge.escrowStatus === 'refunded' ? 'RESTITUÉ' :
                     challenge.escrowStatus === 'forfeited' ? 'CONFISQUÉ' : 'SÉQUESTRE BLOQUÉ'}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Locked Vault Visual Frame */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                challenge.status === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' :
                challenge.status === 'failed' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500' :
                'bg-amber-50 dark:bg-amber-950/20 text-amber-500 animate-pulse'
              }`}>
                {challenge.status === 'success' ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-850 dark:text-white">Trésor Séquestre</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Coffre-fort de caution</div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="block text-lg font-mono font-black text-slate-800 dark:text-slate-100">
                {challenge.stakeAmount} €
              </span>
              <span className={`text-[9px] font-bold uppercase font-mono ${
                challenge.status === 'success' ? 'text-emerald-500' :
                challenge.status === 'failed' ? 'text-rose-500' : 'text-amber-500'
              }`}>
                {challenge.status === 'success' ? 'SÉCURISÉ' :
                 challenge.status === 'failed' ? 'PERDU' : 'VERROUILLÉ'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Proof and AI Arbitration */}
        <div id="arbitration-column" className="lg:col-span-8">
          
          <AnimatePresence mode="wait">

            {/* Form layout: Submit proof */}
            {challenge.status === 'active' && !isVerifying && (
              <motion.div 
                key="proof-submission-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6"
              >
                <div>
                  <h4 className="text-base font-extrabold text-slate-850 dark:text-white">Validation du Pacte</h4>
                  <p className="text-xs text-slate-400 mt-1">Vous devez déposer votre preuve formelle de réussite avant la fin de l&apos;échéance temporelle.</p>
                </div>

                {/* Form dynamic inputs based on challenge.proofType */}
                <div className="space-y-4">
                  
                  {/* Photo Field type */}
                  {challenge.proofType === 'photo' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-slate-400" />
                        Ajouter la photo de validation exigée
                      </label>
                      
                      {/* Interactive Drag & Drop Box */}
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors h-48 relative overflow-hidden ${
                          dragActive 
                            ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20' 
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 hover:border-slate-300 cursor-pointer'
                        }`}
                        onClick={triggerFileSelect}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden" 
                        />

                        {selectedFileUrl ? (
                          <div className="absolute inset-0 w-full h-full">
                            <img 
                              referrerPolicy="no-referrer"
                              src={selectedFileUrl} 
                              alt="Aperçu de la preuve" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold">Remplacer la photo</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-300">Glissez-déposez votre preuve visuelle</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">ou cliquez pour ouvrir vos dossiers</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Presets to make visual preview easy for MVP */}
                      {!selectedFileUrl && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                            Exemples de preuves prêtes pour test MVP :
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => selectMockFile("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80")}
                              className="px-2.5 py-1.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors font-medium"
                            >
                              Photo Travail / Notes
                            </button>
                            <button 
                              onClick={() => selectMockFile("https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80")}
                              className="px-2.5 py-1.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors font-medium"
                            >
                              Running extérieur
                            </button>
                            <button 
                              onClick={() => selectMockFile("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80")}
                              className="px-2.5 py-1.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors font-medium"
                            >
                              Livre ouvert
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* GPS Field type */}
                  {challenge.proofType === 'gps' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Coordonnées géographiques GPS du capteur
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          required
                          placeholder="Relevé GPS (ex: 48.858 N, 2.294 E)"
                          value={gpsLocation}
                          onChange={(e) => setGpsLocation(e.target.value)}
                          className="flex-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm font-mono focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                        <button 
                          type="button"
                          onClick={fetchMockGPS}
                          className="h-11 px-4 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-xs font-bold rounded-xl hover:bg-blue-100 cursor-pointer transition-all duration-200"
                        >
                          Géolocaliser l&apos;App
                        </button>
                      </div>
                    </div>
                  )}

                  {/* API Field type */}
                  {challenge.proofType === 'api' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-slate-400" />
                        ID unique d&apos;autorisation API ou Jeton d&apos;exercice
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          required
                          placeholder="Identifiant Jeton (ex: https://github.com/commit/...)"
                          value={serviceLink}
                          onChange={(e) => setServiceLink(e.target.value)}
                          className="flex-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm font-mono focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                        <button 
                          type="button"
                          onClick={fetchMockAPICommit}
                          className="h-11 px-4 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-xs font-bold rounded-xl hover:bg-blue-100 cursor-pointer transition-all duration-200"
                        >
                          Lier Commit Git
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comment / Note Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Commentaire justificatif additionnel</label>
                    <textarea 
                      rows={2}
                      placeholder="Indiquez des détails supplémentaires à destination du robot d'arbitrage..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                </div>

                {/* Submit button block and options */}
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 space-y-3">
                  <div className="flex gap-3">
                    
                    {/* Normal validation trigger */}
                    <button 
                      onClick={() => handleStartArbitration(false)}
                      disabled={challenge.proofType === 'photo' ? !selectedFileUrl : challenge.proofType === 'gps' ? !gpsLocation : !serviceLink}
                      className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs transition-transform transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
                    >
                      <Cpu className="w-4 h-4 animate-slow-spin" />
                      Soumettre Preuve Pour Arbitrage IA
                    </button>

                    {/* Fraud Test trigger to display both trajectories (Success / Failure) */}
                    <button 
                      onClick={() => handleStartArbitration(true)}
                      disabled={challenge.proofType === 'photo' ? !selectedFileUrl : challenge.proofType === 'gps' ? !gpsLocation : !serviceLink}
                      className="h-12 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 rounded-2xl font-bold text-xs transition-transform transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      title="Forcer un test de fraude IA pour visualiser la trajectoire d'échec"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Forcer Échec IA
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500/80 leading-relaxed text-center">
                    En cliquant, vous initiez le protocole d&apos;intelligence artificielle de validation d&apos;EXIF et d&apos;analyse de l&apos;image. Toute triche entraînera la perte définitive immédiate de la caution financière.
                  </div>
                </div>

              </motion.div>
            )}

            {/* Verification Stage (Immersive AI console analyzer with typewriter simulation!) */}
            {isVerifying && (
              <motion.div 
                key="ai-arbitration-panel"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-900 relative overflow-hidden"
              >
                {/* Background scanning laser visual effect */}
                {!verificationFinished && (
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse shadow-sm shadow-cyan-400" style={{ animationDuration: '1s' }} />
                )}

                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-sky-500/15 text-sky-400 rounded-lg shrink-0">
                      <Cpu className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold">Arbitrage IA Rise Up v1.0</h4>
                      <p className="text-[10px] text-slate-400">Analyse de signature de preuve en temps réel</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] bg-slate-900 text-slate-400 px-2 py-1 rounded border border-white/5">
                    STATUS: VAL_RUNNING
                  </span>
                </div>

                {/* Interactive Console logs */}
                <div className="min-h-[220px] bg-black/40 border border-white/5 rounded-2xl p-4 my-6 font-mono text-[11px] leading-relaxed text-slate-350 overflow-y-auto space-y-1.5 select-none h-48 scrollbar-none">
                  {verificationLogs.map((log, idx) => {
                    const isLast = idx === verificationLogs.length - 1;
                    return (
                      <div 
                        key={idx} 
                        className={`${
                          isLast && !verificationFinished ? 'text-sky-400 font-bold' : 
                          isLast && verificationFinished && verificationResult === 'success' ? 'text-emerald-400 font-bold' :
                          isLast && verificationFinished && verificationResult === 'failed' ? 'text-rose-400 font-bold' : ''
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })}
                  
                  {/* Mock flashing cursor while writing */}
                  {!verificationFinished && (
                    <div className="inline-block w-2 h-3.5 bg-sky-400 animate-pulse ml-0.5" />
                  )}

                  {/* Ultimate fraud test visual lines */}
                  {verificationFinished && isFraudDetected && (
                    <div className="text-rose-400 space-y-1 border-t border-rose-500/10 pt-2 mt-2">
                      <div>[!CRITICAL] ANALYSE DES PIXELS &amp; MÉTADONNÉES EXIF : FRAUDE DÉTECTÉE.</div>
                      <div>&gt; Les dimensions temporelles de la preuve ne correspondent pas au pacte.</div>
                      <div>&gt; Verdict : Tentative d&apos;escroquerie au seau séquestre. Décision irrévocable.</div>
                    </div>
                  )}
                </div>

                {/* Ultimate Decision UI panel */}
                <AnimatePresence>
                  {verificationFinished && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t border-white/5 text-center space-y-4"
                    >
                      {verificationResult === 'success' ? (
                        <div className="space-y-3">
                          <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-white">Validation IA Approuvée !</h4>
                            <p className="text-xs text-slate-300">Votre intégrité est confirmée. La caution de {challenge.stakeAmount}€ est débloquée et restituée.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="inline-flex p-3 bg-rose-500/20 text-rose-400 rounded-full animate-shake">
                            <AlertTriangle className="w-8 h-8" />
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-white">Arbitrage Rejeté (Forfait / Fraude)</h4>
                            <p className="text-xs text-slate-300">
                              Le protocole d&apos;acier a échoué. La somme de {challenge.stakeAmount}€ est confisquée de manière irrévocable.
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <button 
                          onClick={applyArbitrationDecision}
                          className={`w-full h-11 font-bold text-xs rounded-xl cursor-pointer transition-transform transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                            verificationResult === 'success' 
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg' 
                              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg'
                          }`}
                        >
                          Consigner le Résultat
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* Locked Visuals when challenge has resolved */}
            {challenge.status === 'success' && (
              <motion.div 
                key="success-conclusion-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/20 rounded-3xl p-6 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="text-lg font-extrabold text-slate-850 dark:text-white">Pacte Validé avec Succès !</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                    Félicitations. Votre caution de <strong className="text-emerald-500">{challenge.stakeAmount}€</strong> a été reversée à votre banque d&apos;origine via notre sandbox de simulation.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left max-w-md mx-auto space-y-2 text-xs text-slate-500 leading-relaxed">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    Rapport de validation IA d&apos;acier
                  </div>
                  {challenge.proofSubmission?.comment && (
                    <div><strong>Commentaires :</strong> &quot;{challenge.proofSubmission.comment}&quot;</div>
                  )}
                  {challenge.proofSubmission?.gpsLocation && (
                    <div><strong>Coordonnées GPS captées :</strong> {challenge.proofSubmission.gpsLocation}</div>
                  )}
                  <div><strong>Heure de validation :</strong> {formatDateFrench(challenge.proofSubmission?.timestamp || challenge.deadlineAt)}</div>
                </div>

                <div>
                  <button 
                    onClick={onBack}
                    className="h-10 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Retour aux engagements
                  </button>
                </div>
              </motion.div>
            )}

            {/* Failed state resolved */}
            {challenge.status === 'failed' && (
              <motion.div 
                key="failure-conclusion-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/20 rounded-3xl p-6 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 animate-shake" />
                </div>
                
                <div>
                  <h4 className="text-lg font-extrabold text-slate-850 dark:text-white">Pacte d&apos;acier rompu</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                    Le délai imposé de réalisation est écoulé ou une fraude flagrante a été interceptée par l&apos;IA d&apos;arbitrage. 
                    Mise de <strong className="text-rose-500">{challenge.stakeAmount}€</strong> définitivement absorbée.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left max-w-md mx-auto space-y-1.5 text-xs text-slate-500 leading-relaxed">
                  <div className="font-bold text-slate-750 dark:text-slate-300 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    Conséquence Séquestre Stripe
                  </div>
                  <div><strong>Prélèvement :</strong> Validé et capturé sur carte bancaire.</div>
                  <div><strong>Destinataire :</strong> Trésor collectif environnemental.</div>
                  <div><strong>Verdict de clotûre :</strong> Forfait sans preuve valide sous clé.</div>
                </div>

                <div>
                  <button 
                    onClick={onBack}
                    className="h-10 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Retour aux engagements
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
