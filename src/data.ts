import { Challenge, DailyActivity, ProofType } from './types';

// Progressive steps for duration
export interface DurationStep {
  minutes: number;
  label: string;
}

export const DURATION_STEPS: DurationStep[] = [
  { minutes: 15, label: "15 min" },
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 heure" },
  { minutes: 120, label: "2 heures" },
  { minutes: 240, label: "4 heures" },
  { minutes: 480, label: "8 heures" },
  { minutes: 720, label: "12 heures" },
  { minutes: 1440, label: "1 jour" },
  { minutes: 2880, label: "2 jours" },
  { minutes: 4320, label: "3 jours" },
  { minutes: 7200, label: "5 jours" },
  { minutes: 10080, label: "7 jours" },
  { minutes: 20160, label: "14 jours" },
  { minutes: 43200, label: "30 jours" },
  { minutes: 129600, label: "90 jours" },
  { minutes: 259200, label: "6 mois" },
  { minutes: 525600, label: "1 an" }
];

// Progressive steps for stake
export const STAKE_STEPS = [5, 10, 15, 20, 35, 50, 75, 100, 125, 150, 175, 200];

// Dynamic helper to format durations nicely
export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) return `${Math.round(mins / 60)} h`;
  const days = Math.round(mins / 1440);
  if (days < 30) return `${days} j`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} mois`;
  return `${Math.round(months / 12)} an`;
}

// Prefill challenges history for aesthetic and dense dashboard representation
export const INITIAL_MOCK_CHALLENGES: Challenge[] = [
  {
    id: "hist-1",
    title: "Séance de running matinale",
    description: "Courir au moins 5km avant de commencer le travail pour relancer le cardio.",
    durationMinutes: 60,
    durationLabel: "1 heure",
    stakeAmount: 15,
    proofType: "gps",
    status: "success",
    createdAt: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 31.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      gpsLocation: "48.8566° N, 2.3522° E (Paris centre - 5.4 km)",
      comment: "Session bouclée en 28 minutes ! Très bonne sensation.",
      timestamp: new Date(Date.now() - 31.95 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "hist-2",
    title: "1h sans écran avant de dormir",
    description: "Aucun smartphone, tablette ou TV pendant une heure complète avant de m'endormir pour maximiser la qualité du sommeil profond.",
    durationMinutes: 60,
    durationLabel: "1 heure",
    stakeAmount: 10,
    proofType: "photo",
    status: "success",
    createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 27.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      fileUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      comment: "Livre posé à côté d'une tisane infusée.",
      timestamp: new Date(Date.now() - 27.95 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "hist-3",
    title: "Finaliser la maquette Figma Taap.it",
    description: "Compléter les retours de l'écran d'achat et le checkout de notre MVP.",
    durationMinutes: 240,
    durationLabel: "4 heures",
    stakeAmount: 50,
    proofType: "photo",
    status: "failed", // Oups, un échec !
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 19.8 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "forfeited"
  },
  {
    id: "hist-4",
    title: "Session d'apprentissage Rust lang",
    description: "Écrire un parseur JSON de base à blanc en Rust pour se familiariser avec l'ownership.",
    durationMinutes: 120,
    durationLabel: "2 heures",
    stakeAmount: 20,
    proofType: "photo",
    status: "success",
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 14.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      fileUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
      comment: "Code rust d'un parser fonctionnel avec gestion des erreurs via Result.",
      timestamp: new Date(Date.now() - 14.92 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "hist-5",
    title: "Préparation des repas de la semaine",
    description: "Batch cooking sain : 5 déjeuners riches en protéines pour éviter le fast food.",
    durationMinutes: 120,
    durationLabel: "2 heures",
    stakeAmount: 35,
    proofType: "photo",
    status: "success",
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 11.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      fileUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      comment: "5 boîtes tupperware prêtes dans le frigo : riz basmati, poulet mariné et brocolis.",
      timestamp: new Date(Date.now() - 11.95 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "hist-6",
    title: "Pas d'excès de caféine aujourd'hui",
    description: "Limiter ma consommation maraîchère à une seule tasse ce matin. Ne rien boire d'autre que du thé vert l'après-midi.",
    durationMinutes: 720,
    durationLabel: "12 heures",
    stakeAmount: 15,
    proofType: "photo",
    status: "success",
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 7.5 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      fileUrl: "https://images.unsplash.com/photo-1533038590840-1cde6b668731?auto=format&fit=crop&w=600&q=80",
      comment: "Remplacement par une délicieuse tisane à la menthe fleurie.",
      timestamp: new Date(Date.now() - 7.6 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "hist-7",
    title: "Lecture : Dev Perso en profondeur",
    description: "Lire au moins 3 chapitres du livre 'Atomic Habits' de James Clear.",
    durationMinutes: 120,
    durationLabel: "2 heures",
    stakeAmount: 10,
    proofType: "photo",
    status: "success",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 4.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      fileUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      comment: "Surlignages dans le chapitre sur la construction des habitudes d'acier.",
      timestamp: new Date(Date.now() - 4.93 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "hist-8",
    title: "100 flexions de jambes non-stop",
    description: "Défi sportif intense : effectuer des squats continus en vidéo/photo.",
    durationMinutes: 30,
    durationLabel: "30 min",
    stakeAmount: 20,
    proofType: "photo",
    status: "failed", // un autre échec
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 2.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "forfeited"
  },
  {
    id: "hist-9",
    title: "Méditation en pleine conscience",
    description: "Séance d'ancrage avec calme absolu, pas de téléphone, pas de pensées parasites.",
    durationMinutes: 15,
    durationLabel: "15 min",
    stakeAmount: 5,
    proofType: "photo",
    status: "success",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    deadlineAt: new Date(Date.now() - 0.9 * 24 * 3600 * 1000).toISOString(),
    escrowStatus: "refunded",
    proofSubmission: {
      fileUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
      comment: "Zafu de méditation installé avec encens léger.",
      timestamp: new Date(Date.now() - 0.95 * 24 * 3600 * 1000).toISOString()
    }
  }
];

// Load from LocalStorage or initialize
export function loadChallenges(): Challenge[] {
  const data = localStorage.getItem('riseup_challenges');
  if (!data) {
    localStorage.setItem('riseup_challenges', JSON.stringify(INITIAL_MOCK_CHALLENGES));
    return INITIAL_MOCK_CHALLENGES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_MOCK_CHALLENGES;
  }
}

export function saveChallenges(challenges: Challenge[]) {
  localStorage.setItem('riseup_challenges', JSON.stringify(challenges));
}

// Generate activities matching the format for a git-like calendar over the last N days
export function getDailyActivityMap(challenges: Challenge[], daysCount: number = 56): DailyActivity[] {
  const result: DailyActivity[] = [];
  const map: Record<string, { successCount: number; failedCount: number; sumStake: number }> = {};

  // Parse challenges
  challenges.forEach(challenge => {
    const formattedDate = challenge.createdAt.split('T')[0]; // YYYY-MM-DD
    if (!map[formattedDate]) {
      map[formattedDate] = { successCount: 0, failedCount: 0, sumStake: 0 };
    }
    if (challenge.status === 'success') {
      map[formattedDate].successCount += 1;
      map[formattedDate].sumStake += challenge.stakeAmount;
    } else if (challenge.status === 'failed') {
      map[formattedDate].failedCount += 1;
      map[formattedDate].sumStake += challenge.stakeAmount;
    }
  });

  // Today's date relative to timezone
  const today = new Date();
  
  // Fill the grid for the last `daysCount` days in historical order
  for (let i = daysCount - 1; i >= 0; i--) {
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - i);
    const dateStr = priorDate.toISOString().split('T')[0];
    
    const stats = map[dateStr];
    let status: 'empty' | 'success' | 'failed' | 'mixed' = 'empty';
    let count = 0;
    let amount = 0;

    if (stats) {
      count = stats.successCount + stats.failedCount;
      amount = stats.sumStake;
      
      if (stats.successCount > 0 && stats.failedCount > 0) {
        status = 'mixed';
      } else if (stats.successCount > 0) {
        status = 'success';
      } else if (stats.failedCount > 0) {
        status = 'failed';
      }
    }

    result.push({
      date: dateStr,
      status,
      count,
      amount
    });
  }

  return result;
}

// Calculate summary statistics
export interface GlobalStats {
  challengesSucceeded: number;
  challengesFailed: number;
  totalFundsEngaged: number;
  fundsRefunded: number;
  fundsForfeited: number;
  successRate: number;
  currentStreak: number;
}

export function calculateStats(challenges: Challenge[]): GlobalStats {
  let challengesSucceeded = 0;
  let challengesFailed = 0;
  let totalFundsEngaged = 0;
  let fundsRefunded = 0;
  let fundsForfeited = 0;

  challenges.forEach(c => {
    if (c.status === 'success') {
      challengesSucceeded++;
      fundsRefunded += c.stakeAmount;
      totalFundsEngaged += c.stakeAmount;
    } else if (c.status === 'failed') {
      challengesFailed++;
      fundsForfeited += c.stakeAmount;
      totalFundsEngaged += c.stakeAmount;
    } else if (c.status === 'active' || c.status === 'pending_verification') {
      totalFundsEngaged += c.stakeAmount;
    }
  });

  const totalCompleted = challengesSucceeded + challengesFailed;
  const successRate = totalCompleted > 0 ? Math.round((challengesSucceeded / totalCompleted) * 100) : 100;

  // Let's compute a simple current streak based on completion history sorted by date
  const completedSorted = [...challenges]
    .filter(c => c.status === 'success' || c.status === 'failed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  let currentStreak = 0;
  for (const c of completedSorted) {
    if (c.status === 'success') {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    challengesSucceeded,
    challengesFailed,
    totalFundsEngaged,
    fundsRefunded,
    fundsForfeited,
    successRate,
    currentStreak
  };
}
