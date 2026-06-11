import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge, DailyActivity } from '../types';
import { getDailyActivityMap, calculateStats, formatMinutes, GlobalStats } from '../data';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Settings, 
  ChevronRight,
  Info
} from 'lucide-react';

interface DashboardProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  onNavigateToNew: () => void;
}

export default function Dashboard({ 
  challenges, 
  onSelectChallenge, 
  onNavigateToNew 
}: DashboardProps) {
  const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const stats = calculateStats(challenges);
  const recentDays = getDailyActivityMap(challenges, 56); // 8 weeks = 56 days

  // Generate SVG dynamic path for trend curve (cumulative saved balance over time)
  const completedChallenges = [...challenges]
    .filter(c => c.status === 'success' || c.status === 'failed')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let cumulativeBalance = 0;
  const balancePoints = completedChallenges.map((c, i) => {
    if (c.status === 'success') {
      // In success we got our money back,, but for visual tracker let's trace "accumulated success" or just total funds managed/saved
      cumulativeBalance += c.stakeAmount;
    } else {
      // Forfeited money
      cumulativeBalance -= c.stakeAmount;
    }
    return { name: c.title, value: cumulativeBalance, date: c.createdAt.split('T')[0] };
  });

  // Calculate SVG dimensions
  const svgWidth = 500;
  const svgHeight = 120;
  const padding = 15;

  let pathData = '';
  let areaData = '';
  if (balancePoints.length > 0) {
    const minVal = Math.min(...balancePoints.map(p => p.value), 0);
    const maxVal = Math.max(...balancePoints.map(p => p.value), 10);
    const valRange = maxVal - minVal;

    const coords = balancePoints.map((p, index) => {
      const x = padding + (index / (balancePoints.length - 1 || 1)) * (svgWidth - padding * 2);
      const valPercent = valRange === 0 ? 0.5 : (p.value - minVal) / valRange;
      const y = svgHeight - padding - valPercent * (svgHeight - padding * 2);
      return { x, y };
    });

    pathData = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    areaData = `${pathData} L ${coords[coords.length - 1].x} ${svgHeight - padding} L ${coords[0].x} ${svgHeight - padding} Z`;
  }

  // Group days into 7-day columns (weeks) for the thermal grid
  const weeks: DailyActivity[][] = [];
  for (let i = 0; i < recentDays.length; i += 7) {
    weeks.push(recentDays.slice(i, i + 7));
  }

  const handleDayHover = (e: React.MouseEvent, day: DailyActivity) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + window.scrollX + 12,
      y: rect.top + window.scrollY - 45
    });
    setHoveredDay(day);
  };

  const getHeatmapColor = (status: DailyActivity['status']) => {
    switch (status) {
      case 'success': return 'bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/20';
      case 'failed': return 'bg-rose-500 hover:bg-rose-400 shadow-sm shadow-rose-500/20';
      case 'mixed': return 'bg-amber-500 hover:bg-amber-400';
      default: return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700';
    }
  };

  const formatDateFrench = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  return (
    <div id="riseup-dashboard-root" className="space-y-6">
      {/* Overview Cards Grid */}
      <div id="stats-summary" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Success rate */}
        <motion.div 
          id="stat-success-rate"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Taux de Réussite</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.successRate}%
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Sur {stats.challengesSucceeded + stats.challengesFailed} pactes conclus
            </p>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
        </motion.div>

        {/* Card 2: Safe Money vs Forfeited */}
        <motion.div 
          id="stat-funds-managed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Escrow Trésorerie</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white flex items-baseline">
              {stats.fundsRefunded}€
              <span className="text-xs font-semibold text-emerald-600 ml-1">sauvés</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
              <span>Engagé : {stats.totalFundsEngaged}€</span>
              <span className="text-rose-500 font-medium">Perdu : {stats.fundsForfeited}€</span>
            </p>
          </div>
          <div className="mt-3 flex gap-1 h-1.5 w-full rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${stats.totalFundsEngaged > 0 ? (stats.fundsRefunded / stats.totalFundsEngaged) * 100 : 100}%` }}
            />
            <div 
              className="bg-rose-500 h-full" 
              style={{ width: `${stats.totalFundsEngaged > 0 ? (stats.fundsForfeited / stats.totalFundsEngaged) * 100 : 0}%` }}
            />
          </div>
        </motion.div>

        {/* Card 3: Hot Streak */}
        <motion.div 
          id="stat-streak"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 font-sans">Série de Succès</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-500 animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white flex items-baseline">
              {stats.currentStreak}
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1 font-mono">à la suite</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {stats.currentStreak > 0 
                ? "Excellent niveau d'engagement. Ne rompez pas la série !" 
                : "Lancez votre prochain pacte pour démarrer une série !"}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`flex-1 h-1 rounded-full ${
                  i < stats.currentStreak 
                    ? 'bg-amber-500' 
                    : 'bg-slate-100 dark:bg-slate-800'
                }`} 
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Grid Content: Heatmap & Core Graph */}
      <div id="interactive-grids" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Grid Content: Heatmap Calendar (8/12 blocks) */}
        <div id="heatmap-calendar" className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Discipline Thermique</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Calendrier d'activité style &quot;GitHub&quot; consolidé sur les 8 dernières semaines</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
              <span className="uppercase">Moins</span>
              <div className="w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-blue-105 dark:bg-blue-900/30 rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-blue-300 dark:bg-blue-650/60 rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
              <span className="uppercase">Plus</span>
            </div>
          </div>

          {/* Grid Wrapper */}
          <div className="relative pt-2 pb-1 overflow-x-auto select-none scrollbar-none">
            <div className="flex gap-1.5 min-w-[500px] justify-between">
              
              {/* Row indicator labels inside heatmap */}
              <div className="grid grid-rows-7 text-[10px] text-slate-300 dark:text-slate-600 pr-2 font-mono text-right justify-between select-none leading-none h-[110px]">
                <span>Lun</span>
                <span>Mer</span>
                <span>Ven</span>
                <span>Dim</span>
              </div>

              {/* Weekly columns of 7 squares */}
              <div className="flex flex-1 justify-between gap-1.5 h-[110px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-1.5 flex-1">
                    {week.map((day, dIdx) => (
                      <div 
                        key={dIdx}
                        onMouseEnter={(e) => handleDayHover(e, day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-full h-full rounded-[3.5px] transition-all duration-200 cursor-pointer ${getHeatmapColor(day.status)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Cumulative Balance Curve */}
        <div id="progress-curve-panel" className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Courbe de Performance</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Solde cumulatif de vos pactes d&apos;acier (€ sécurisés vs € confisqués)</p>
          </div>

          {balancePoints.length < 2 ? (
            <div className="h-[140px] flex flex-col items-center justify-center p-4 border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl my-4">
              <Info className="w-6 h-6 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                Cumulez au moins 2 pactes terminés pour afficher la courbe de croissance en temps réel.
              </p>
            </div>
          ) : (
            <div className="relative h-[130px] my-3 w-full">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-full overflow-visible"
              >
                {/* Area Gradient */}
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="15" y1={svgHeight/2} x2={svgWidth-15} y2={svgHeight/2} stroke="#e2e8f0" strokeDasharray="3,3" className="dark:stroke-slate-800/60" />
                
                {/* Area fill */}
                <motion.path 
                  d={areaData} 
                  fill="url(#curveGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Line Path */}
                <motion.path 
                  d={pathData} 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Active Dots */}
                {balancePoints.map((point, idx) => {
                  const x = padding + (idx / (balancePoints.length - 1 || 1)) * (svgWidth - padding * 2);
                  const minVal = Math.min(...balancePoints.map(p => p.value), 0);
                  const maxVal = Math.max(...balancePoints.map(p => p.value), 10);
                  const valRange = maxVal - minVal;
                  const valPercent = valRange === 0 ? 0.5 : (point.value - minVal) / valRange;
                  const y = svgHeight - padding - valPercent * (svgHeight - padding * 2);

                  const isLast = idx === balancePoints.length - 1;

                  return (
                    <g key={idx}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isLast ? "5" : "3.5"} 
                        fill={point.value >= 0 ? "#2563eb" : "#f43f5e"} 
                        className="transition-all duration-300 stroke-white dark:stroke-slate-900 stroke-[1.5]"
                      />
                      {isLast && (
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="10" 
                          fill="none" 
                          stroke={point.value >= 0 ? "#2563eb" : "#f43f5e"} 
                          className="animate-ping stroke-1"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between px-2 text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                <span>{balancePoints[0].date}</span>
                <span>{balancePoints[balancePoints.length - 1].date}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800">
            <span>Discipline Capital</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
              Solde: {cumulativeBalance >= 0 ? `+${cumulativeBalance}` : cumulativeBalance}€
            </span>
          </div>
        </div>

        {/* Right Content: Quick action box & active info (5/12 blocks) */}
        <div id="quick-action-panel" className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex p-2 bg-white/10 rounded-xl">
              <Lock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold tracking-tight">Le Pacte Financier d&apos;Acier</h4>
              <p className="text-xs text-slate-300/80 leading-relaxed mt-1">
                Verrouillez une mise entre 5€ et 200€ sous clé sécurisée. Notre IA certifie votre preuve pour exécuter le remboursement ou reverser la mise non-aboutie.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] text-slate-300">
                Fonds gérés via un compte séquestre de simulation (bac à sable Stripe certifié).
              </div>
            </div>

            <button 
              onClick={onNavigateToNew}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              Créer un Nouveau Pacte
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Challenges list feed */}
      <div id="challenges-feed" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-between">
          <span>Historique des Pactes d&apos;Engagement</span>
          <span className="text-xs font-mono font-normal text-slate-400">Total : {challenges.length}</span>
        </h4>

        {challenges.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Aucun défi créé</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Engagez votre argent pour matérialiser votre motivation.</p>
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-55 dark:divide-slate-800/50">
            {[...challenges]
              .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((c, idx) => (
                <div 
                  key={c.id} 
                  onClick={() => onSelectChallenge(c)}
                  className={`pt-3 first:pt-0 group flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer transition-colors`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                        {c.title}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-medium">
                        {formatMinutes(c.durationMinutes)}
                      </span>
                      {c.proofType === 'photo' && <ImageIcon className="w-3.5 h-3.5 text-slate-400" />}
                      {c.proofType === 'gps' && <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 max-w-xl">
                      {c.description}
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">
                      Engagé le {formatDateFrench(c.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                      {c.stakeAmount}€
                    </span>
                    
                    {/* Status badge */}
                    {c.status === 'success' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Succès
                      </span>
                    )}

                    {c.status === 'failed' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Échoué
                      </span>
                    )}

                    {c.status === 'active' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        En cours
                      </span>
                    )}

                    {c.status === 'pending_verification' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        Vérification IA
                      </span>
                    )}
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating heat map tooltip node details */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
            className="fixed z-50 pointer-events-none bg-slate-950 text-white rounded-lg px-3 py-2 shadow-xl border border-slate-805 text-xs space-y-0.5 -translate-x-1/2"
          >
            <div className="font-bold text-slate-300 font-mono text-[9px] uppercase tracking-wide">
              {formatDateFrench(hoveredDay.date)}
            </div>
            {hoveredDay.count > 0 ? (
              <div className="space-y-0.5">
                <div className="font-semibold text-white">
                  {hoveredDay.count} pacte{hoveredDay.count > 1 ? 's' : ''} conclu{hoveredDay.count > 1 ? 's' : ''}
                </div>
                <div className="text-sky-400 font-bold font-mono">
                  {hoveredDay.amount}€ investis
                </div>
                <div className={`font-medium ${
                  hoveredDay.status === 'success' ? 'text-emerald-400' : 
                  hoveredDay.status === 'failed' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {hoveredDay.status === 'success' && '100% Réussi'}
                  {hoveredDay.status === 'failed' && 'Forfaité'}
                  {hoveredDay.status === 'mixed' && 'Succès et Forfait'}
                </div>
              </div>
            ) : (
              <div className="text-slate-400">Aucun engagement</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
