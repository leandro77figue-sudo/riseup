import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProofType, Challenge } from '../types';
import { DURATION_STEPS, STAKE_STEPS, formatMinutes } from '../data';
import { 
  Lock, 
  Unlock, 
  Clock, 
  Coins, 
  Camera, 
  MapPin, 
  Terminal, 
  AlertCircle, 
  Info, 
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface ChallengeCreatorProps {
  onChallengeCreated: (challenge: Challenge) => void;
  onCancel: () => void;
}

export default function ChallengeCreator({ 
  onChallengeCreated, 
  onCancel 
}: ChallengeCreatorProps) {
  // Core Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationIdx, setDurationIdx] = useState(2); // Default to index 2 ("1 heure")
  const [stakeIdx, setStakeIdx] = useState(3); // Default to index 3 ("20€")
  const [proofType, setProofType] = useState<ProofType>('photo');

  // Stripe simulated visual drawer state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [checkoutError, setCheckoutError] = useState('');

  // Local validation shake
  const [shouldShake, setShouldShake] = useState(false);

  const selectedDuration = DURATION_STEPS[durationIdx];
  const selectedStake = STAKE_STEPS[stakeIdx];

  // Action: Launch simulated credit card checkout
  const handleInitiatePact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    // Open payment drawer
    setIsCheckoutOpen(true);
    setCheckoutStatus('idle');
    setCheckoutError('');
  };

  // Action: Complete simulated Stripe authorization & capture
  const handleCompletePayment = () => {
    if (!cardNumber || !cardExpiry || !cardCvc) {
      setCheckoutError('Veuillez remplir toutes les informations bancaires fictives.');
      return;
    }

    setCheckoutStatus('processing');
    setCheckoutError('');

    // Simulate high speed response/processing
    setTimeout(() => {
      // Validate simulated card numbers: allow anything, but show how neat 4242 is
      setCheckoutStatus('success');
      
      setTimeout(() => {
        // Create full challenge object
        const activeMinutes = selectedDuration.minutes;
        const now = new Date();
        const deadline = new Date(now.getTime() + activeMinutes * 60 * 1000);

        const newChallenge: Challenge = {
          id: `challenge-${Date.now()}`,
          title: title.trim(),
          description: description.trim(),
          durationMinutes: activeMinutes,
          durationLabel: selectedDuration.label,
          stakeAmount: selectedStake,
          proofType: proofType,
          status: 'active',
          createdAt: now.toISOString(),
          deadlineAt: deadline.toISOString(),
          escrowStatus: 'locked'
        };

        onChallengeCreated(newChallenge);
      }, 1500);

    }, 2000);
  };

  const autofillSandboxDetails = () => {
    setCardNumber('4242  4242  4242  4242');
    setCardExpiry('12/28');
    setCardCvc('421');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    // Format with spaces
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardNumber(parts.join('  '));
  };

  return (
    <div id="challenge-creator-root" className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au Tableau de Bord
        </button>
        <span className="text-[10px] font-bold font-mono tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase border border-blue-100">
          Nouveau Pacte d&apos;Acier
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Parameters Form */}
        <motion.form 
          onSubmit={handleInitiatePact}
          animate={shouldShake ? { x: [-4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
        >
          {/* Header Title */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">Rise Up.</h3>
            <p className="text-xs text-slate-500 mt-1">Définissez vos conditions. Engagez vos capitaux pour aligner vos actions avec votre esprit.</p>
          </div>

          {/* Section 1: Definition */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Intitulé du pacte</label>
              <input 
                type="text" 
                required
                maxLength={60}
                placeholder="Ex: Finir le chapitre 2 d'algorithmique"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm font-semibold focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description détaillée des critères d&apos;évaluation</label>
              <textarea 
                required
                rows={3}
                placeholder="Décrivez précisément ce que vous devez valider pour récupérer votre mise (ex: capture de code fonctionnel avec test, relevé d'activité de course à pied...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-semibold focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-600">L&apos;IA utilisera ces consignes strictes pour analyser votre soumission en fin de délai.</p>
            </div>
          </div>

          {/* Section 2: Progressive Sliders / Power Glide */}
          <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
            
            {/* Slider Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Durée du Défi
                </span>
                <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-lg border border-blue-105">
                  {selectedDuration.label.toUpperCase()}
                </span>
              </div>
              <div className="relative pt-2">
                <input 
                  type="range"
                  min="0"
                  max={DURATION_STEPS.length - 1}
                  step="1"
                  value={durationIdx}
                  onChange={(e) => setDurationIdx(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-hidden transition-all duration-150"
                />
                <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 dark:text-slate-600 px-1 mt-2">
                  <span>15 MIN</span>
                  <span>1 MOIS</span>
                  <span>1 AN</span>
                </div>
              </div>
            </div>

            {/* Slider Stake */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-slate-400" />
                  Mise Séquestre
                </span>
                <span className="text-sm font-mono font-bold text-slate-950 dark:text-white bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  {selectedStake}€
                </span>
              </div>
              <div className="relative pt-2">
                <input 
                  type="range"
                  min="0"
                  max={STAKE_STEPS.length - 1}
                  step="1"
                  value={stakeIdx}
                  onChange={(e) => setStakeIdx(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-white outline-hidden transition-all duration-150"
                />
                <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 dark:text-slate-600 px-1 mt-2">
                  <span>5€</span>
                  <span>100€</span>
                  <span>200€</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Select Proof Type */}
          <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800/50">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Méthode de validation exigée</label>
            
            <div className="grid grid-cols-3 gap-3">
              
              {/* Photo */}
              <button 
                type="button"
                onClick={() => setProofType('photo')}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 h-16 cursor-pointer transition-all duration-200 w-full ${
                  proofType === 'photo'
                    ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 shadow-md'
                    : 'border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${proofType === 'photo' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Photo IA</span>
              </button>

              {/* GPS */}
              <button 
                type="button"
                onClick={() => setProofType('gps')}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 h-16 cursor-pointer transition-all duration-200 w-full ${
                  proofType === 'gps'
                    ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 shadow-md'
                    : 'border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${proofType === 'gps' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Localisation</span>
              </button>

              {/* API */}
              <button 
                type="button"
                onClick={() => setProofType('api')}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 h-16 cursor-pointer transition-all duration-200 w-full ${
                  proofType === 'api'
                    ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 shadow-md'
                    : 'border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${proofType === 'api' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">API / Connect</span>
              </button>

            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-3 group shadow-lg shadow-blue-200/50 dark:shadow-none transition-all duration-200 cursor-pointer font-bold text-sm"
            >
              <span>ENGAGER MON PACTE</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coins className="w-4.5 h-4.5 text-white" />
              </div>
            </button>
          </div>

        </motion.form>

        {/* Right column: Interactive Visual Card (Explanatory card explaining Stripe and IA) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-900 overflow-hidden relative">
            <div className="absolute right-0 top-0 translate-x-5 -translate-y-5 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono">Simulateur de Conséquences</h4>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">En cas de succés (Preuve IA acceptée)</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    Votre caution de <strong className="text-emerald-400">{selectedStake}€</strong> est immédiatement restituée à 100% sur votre carte bancaire sans aucun frais d&apos;arbitrage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">En cas d&apos;échec (Délai dépassé ou fraude)</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    La caution de <strong className="text-rose-400">{selectedStake}€</strong> est définitivement confisquée, mise à mort et investie dans les projets de protection de la planète ou reversée au pot de la communauté.
                  </p>
                </div>
              </div>

              {/* Lock Visual Frame */}
              <div className="border border-white/5 bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sky-400">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">Séquestre Stripe activable</div>
                    <div className="text-[9px] text-sky-400 font-mono">Sandbox ID: ready_sandbox_3000</div>
                  </div>
                </div>
                <div className="text-xs font-bold font-mono text-emerald-400">
                  ACTIF
                </div>
              </div>

              {/* Dynamic Note */}
              <div className="text-[10px] text-slate-500 leading-relaxed pt-2 border-t border-white/5">
                Note pédagogique: L&apos;architecture de Rise Up suit les principes fondamentaux de l&apos;Aura de Discipline de Taap.it. L&apos;IA valide vos actions avec impartialité absolue.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* STRIPE ESCROW SIMULATOR FULL SCREEN MODAL SCREEN (GLASSMORPHISM SHEETS) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-100 dark:border-slate-800 p-6 shadow-2xl relative overflow-hidden"
            >
              
              {/* Checkout Close Button */}
              {checkoutStatus !== 'processing' && checkoutStatus !== 'success' && (
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute right-4 top-4 w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  &times;
                </button>
              )}

              {/* Checkout Idle State */}
              {checkoutStatus === 'idle' && (
                <div className="space-y-5 font-sans">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Séquestre Stripe (Test Sandbox)</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Mise sous clé d&apos;acier temporaire de {selectedStake}€</p>
                    </div>
                  </div>

                  {/* Sandbox tip banner */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 rounded-xl p-3 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed">
                      <span>Remplissez n&apos;importe quelle coordonnée ou cliquez ci-dessous pour utiliser des identifiants Stripe de test sécurisés.</span>
                      <button 
                        type="button"
                        onClick={autofillSandboxDetails}
                        className="block underline font-bold mt-1 text-blue-600 dark:text-blue-400 text-left hover:text-blue-550"
                      >
                        Autocompléter avec une carte Stripe de test
                      </button>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Numéro de carte</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="4242  4242  4242  4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 text-sm font-mono focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                        <div className="absolute right-3.5 top-3.5 flex gap-1 items-center">
                          <span className="w-5 h-3 bg-slate-200 rounded-sm block text-[6px] font-bold text-center leading-3 text-slate-600 font-sans tracking-tight">VISA</span>
                          <span className="w-5 h-3 bg-amber-200 rounded-sm block text-[6px] font-bold text-center leading-3 text-amber-800 font-sans tracking-tight">MC</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Expiration</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 text-sm font-mono focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Code CVC</label>
                        <input 
                          type="password" 
                          placeholder="***"
                          maxLength={3}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 text-sm font-mono focus:outline-hidden focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {checkoutError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setIsCheckoutOpen(false)}
                      className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={handleCompletePayment}
                      className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Autoriser {selectedStake}€
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout Processing State */}
              {checkoutStatus === 'processing' && (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 font-sans">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
                    <Lock className="absolute inset-0 m-auto w-5 h-5 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Séquestre Stripe en cours...</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Génération du reçu temporaire, verrouillage des clefs...</p>
                  </div>
                  <div className="font-mono text-[9px] text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    POST https://api.stripe.com/v3/intents/capture
                  </div>
                </div>
              )}

              {/* Checkout Success / Vault Locked State */}
              {checkoutStatus === 'success' && (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fonds sécurisés d&apos;acier !</h4>
                    <p className="text-[11px] text-slate-400 mt-1">La somme de {selectedStake}€ est bloquée jusqu&apos;à preuve de votre réussite.</p>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    PACT_ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
