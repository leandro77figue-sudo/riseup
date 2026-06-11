/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Challenge, ProofSubmission } from './types';
import { loadChallenges, saveChallenges } from './data';
import Dashboard from './components/Dashboard';
import ChallengeCreator from './components/ChallengeCreator';
import ChallengeTracker from './components/ChallengeTracker';
import { 
  Lock, 
  HelpCircle, 
  Plus, 
  Shield, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'new_challenge' | 'challenge_tracker'>('dashboard');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  // Load initial challenges on boot
  useEffect(() => {
    const loaded = loadChallenges();
    setChallenges(loaded);
  }, []);

  const handleChallengeCreated = (newChallenge: Challenge) => {
    const updated = [newChallenge, ...challenges];
    setChallenges(updated);
    saveChallenges(updated);
    
    // Auto redirect to tracker for the newly created challenge immediately
    setSelectedChallengeId(newChallenge.id);
    setActiveScreen('challenge_tracker');
  };

  const handleUpdateStatus = (id: string, status: Challenge['status'], submission?: ProofSubmission) => {
    const updated = challenges.map(c => {
      if (c.id === id) {
        let escrow: Challenge['escrowStatus'] = c.escrowStatus;
        if (status === 'success') escrow = 'refunded';
        if (status === 'failed') escrow = 'forfeited';

        return {
          ...c,
          status,
          escrowStatus: escrow,
          proofSubmission: submission || c.proofSubmission
        };
      }
      return c;
    });

    setChallenges(updated);
    saveChallenges(updated);
  };

  const selectedChallenge = challenges.find(c => c.id === selectedChallengeId);

  // Prototyping helper: Reset back to fresh seed data
  const handleResetApplication = () => {
    if (window.confirm("Voulez-vous réinitialiser l'application avec les données de démonstration ? Vos défis personnalisés seront effacés.")) {
      localStorage.removeItem('riseup_challenges');
      const loaded = loadChallenges();
      setChallenges(loaded);
      setActiveScreen('dashboard');
      setSelectedChallengeId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-blue-500/10 text-slate-900 dark:text-slate-100">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo visual */}
          <div 
            onClick={() => {
              setActiveScreen('dashboard');
              setSelectedChallengeId(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-transform duration-200 group-hover:scale-105">
              <Lock className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Rise Up</span>
              <span className="text-[9px] font-bold block leading-none text-blue-600 dark:text-blue-400 font-mono tracking-widest uppercase">Pacte d&apos;acier</span>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveScreen('dashboard');
                setSelectedChallengeId(null);
              }}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'dashboard' 
                  ? 'bg-slate-150/80 dark:bg-slate-800 text-slate-900 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Tableau de Bord
            </button>

            {/* Quick button to create from header */}
            {activeScreen !== 'new_challenge' && (
              <button 
                onClick={() => {
                  setActiveScreen('new_challenge');
                  setSelectedChallengeId(null);
                }}
                className="inline-flex items-center gap-1.5 h-8.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3.5 rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouveau Défi
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Primary Workspace Viewport Container */}
      <main className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        
        {activeScreen === 'dashboard' && (
          <Dashboard 
            challenges={challenges}
            onSelectChallenge={(c) => {
              setSelectedChallengeId(c.id);
              setActiveScreen('challenge_tracker');
            }}
            onNavigateToNew={() => {
              setActiveScreen('new_challenge');
              setSelectedChallengeId(null);
            }}
          />
        )}

        {activeScreen === 'new_challenge' && (
          <ChallengeCreator 
            onChallengeCreated={handleChallengeCreated}
            onCancel={() => {
              setActiveScreen('dashboard');
              setSelectedChallengeId(null);
            }}
          />
        )}

        {activeScreen === 'challenge_tracker' && selectedChallenge && (
          <ChallengeTracker 
            challenge={selectedChallenge}
            onUpdateStatus={handleUpdateStatus}
            onBack={() => {
              setActiveScreen('dashboard');
              setSelectedChallengeId(null);
            }}
          />
        )}

      </main>

      {/* Footer System Credits */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-black/20 py-8 select-none">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-center sm:text-left space-y-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Rise Up &bull; Le Pacte d&apos;Engagement IA
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Inspiré par l&apos;Aura de Clarté Taap.it. Simulation sécurisée bac à sable Stripe.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleResetApplication}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-705 dark:hover:text-slate-350 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-slate-100"
              title="Réinitialiser l'application avec les défis historiques pré-remplis."
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser Démo
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-300 dark:text-slate-600">
              v1.0 (Sandbox Sandbox)
            </span>
          </div>

        </div>
      </footer>

      {/* Fixed bottom floating trigger block (Only on dashboard screen) */}
      {activeScreen === 'dashboard' && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setActiveScreen('new_challenge')}
            className="w-14 h-14 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Créer un nouveau pacte d'acier"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      )}

    </div>
  );
}
