export type ProofType = 'photo' | 'gps' | 'api';

export type ChallengeStatus = 'active' | 'pending_verification' | 'success' | 'failed';

export interface ProofSubmission {
  fileUrl?: string;
  gpsLocation?: string;
  comment?: string;
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  durationLabel: string;
  stakeAmount: number;
  proofType: ProofType;
  status: ChallengeStatus;
  createdAt: string;
  deadlineAt: string;
  escrowStatus: 'locked' | 'refunded' | 'forfeited';
  proofSubmission?: ProofSubmission;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  status: 'empty' | 'success' | 'failed' | 'mixed';
  count: number;
  amount: number;
}
