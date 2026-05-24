import { useState, useEffect } from 'react';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import './Dashboard.css';
import { 
  Sun, Sword, Sparkles, BookOpen, Zap, ArrowRight, UserPlus, 
  Gamepad2, Coffee, Crown, ChevronLeft, ChevronRight, X, 
  Trophy, Flame, Star, Target, Heart, CheckCircle, Plus,
  Lock, Gift, RotateCcw, TrendingUp, Crown as CrownIcon,
  Cloud, Palette, BarChart3, Check
} from 'lucide-react';

// ==================== DANE ====================

type Badge = {
  icon: any; name: string; desc: string; color: string; earned: boolean; requirement: string;
};

const ALL_BADGES: Badge[] = [
  { icon: Sun, name: 'Early Bird', desc: '5 AM Club', color: 'linear-gradient(135deg, #f97316, #ec4899)', earned: true, requirement: 'Log in and complete a habit at 5:00 AM for 7 days.' },
  { icon: Sword, name: 'Iron Will', desc: 'Daily Streak', color: 'linear-gradient(135deg, #3b82f6, #06b6d4)', earned: true, requirement: 'Maintain a 30-day daily habit streak without missing a day.' },
  { icon: Sparkles, name: 'Zen Master', desc: 'Mindfulness', color: 'linear-gradient(135deg, #22c55e, #10b981)', earned: true, requirement: 'Complete 10 meditation sessions in the Mindfulness module.' },
  { icon: BookOpen, name: 'Polymath', desc: 'Read 5 Books', color: 'linear-gradient(135deg, #a855f7, #7c3aed)', earned: true, requirement: 'Track reading habit and reach 5 finished books in the Library.' },
  { icon: Flame, name: 'Firestarter', desc: '7 Day Streak', color: 'linear-gradient(135deg, #ef4444, #f97316)', earned: false, requirement: 'Start any new habit and keep it for 7 consecutive days.' },
  { icon: Star, name: 'Rising Star', desc: 'Level 10', color: 'linear-gradient(135deg, #eab308, #f97316)', earned: false, requirement: 'Earn enough XP to reach Level 10.' },
  { icon: Target, name: 'Sharpshooter', desc: '100% Week', color: 'linear-gradient(135deg, #06b6d4, #3b82f6)', earned: false, requirement: 'Complete 100% of your weekly goals, every day for 7 days.' },
  { icon: Heart, name: 'Guardian', desc: 'Help a Friend', color: 'linear-gradient(135deg, #ec4899, #a855f7)', earned: false, requirement: 'Send a Challenge to a friend and win the duel.' },
  { icon: Trophy, name: 'Champion', desc: 'Win Challenge', color: 'linear-gradient(135deg, #eab308, #ca8a04)', earned: false, requirement: 'Win 3 friend challenges in a row.' },
];

type RewardItem = {
  key: string; title: string; desc: string; cost: number; tag: string; tagColor: string;
  bg: string; icon: any; iconColor: string; type: 'redeem' | 'premium';
};

const REWARD_PAGES: RewardItem[][] = [
  // Strona 1
  [
    { key: 'gaming', title: '3hr Gaming Session', desc: 'Redeem for an uninterrupted night of gaming after completing all tasks.', cost: 500, tag: 'Personal Unlock', tagColor: '#a855f7', bg: 'linear-gradient(135deg, #1e1b4b, #312e81)', icon: Gamepad2, iconColor: '#a78bfa', type: 'redeem' },
    { key: 'coffee', title: 'Artisan Coffee', desc: 'Treat yourself to a specialty coffee at your favorite local roastery.', cost: 250, tag: 'Boost', tagColor: '#3b82f6', bg: 'linear-gradient(135deg, #0c4a6e, #075985)', icon: Coffee, iconColor: '#7dd3fc', type: 'redeem' },
    { key: 'pro', title: 'Kinetic Pro Lifetime', desc: 'Unlock all advanced statistics, custom themes, and cloud sync forever.', cost: 0, tag: 'Premium Unlock', tagColor: '#22c55e', bg: 'linear-gradient(135deg, #064e3b, #065f46)', icon: Crown, iconColor: '#34d399', type: 'premium' },
  ],
  // Strona 2
  [
    { key: 'movie', title: 'Movie Night Pass', desc: 'Get a cinema voucher for any movie of your choice on a Friday evening.', cost: 400, tag: 'Personal', tagColor: '#f97316', bg: 'linear-gradient(135deg, #7c2d12, #9a3412)', icon: Gift, iconColor: '#fdba74', type: 'redeem' },
    { key: 'dayoff', title: 'Lazy Sunday', desc: 'Skip all habits for one Sunday without breaking your streak. One-time use.', cost: 800, tag: 'Rare', tagColor: '#ef4444', bg: 'linear-gradient(135deg, #450a0a, #7f1d1d)', icon: TrendingUp, iconColor: '#fca5a5', type: 'redeem' },
    { key: 'theme', title: 'Neon Theme Pack', desc: 'Exclusive dark UI theme with neon accents for your dashboard.', cost: 350, tag: 'Cosmetic', tagColor: '#a855f7', bg: 'linear-gradient(135deg, #4c1d95, #5b21b6)', icon: Palette, iconColor: '#c4b5fd', type: 'redeem' },
  ],
  // Strona 3
  [
    { key: 'coming1', title: 'Coming Soon', desc: 'More exciting rewards are on the way. Keep earning points!', cost: 9999, tag: 'Soon', tagColor: '#71717a', bg: 'linear-gradient(135deg, #18181b, #27272a)', icon: Lock, iconColor: '#52525b', type: 'redeem' },
    { key: 'coming2', title: 'Coming Soon', desc: 'Stay tuned for premium partner rewards and exclusive drops.', cost: 9999, tag: 'Soon', tagColor: '#71717a', bg: 'linear-gradient(135deg, #18181b, #27272a)', icon: Lock, iconColor: '#52525b', type: 'redeem' },
    { key: 'coming3', title: 'Coming Soon', desc: 'Higher tier rewards unlock as you reach Level 30 and beyond.', cost: 9999, tag: 'Soon', tagColor: '#71717a', bg: 'linear-gradient(135deg, #18181b, #27272a)', icon: Lock, iconColor: '#52525b', type: 'redeem' },
  ],
];

type Notif = { msg: string; ok: boolean } | null;

// ==================== KOMPONENT ====================

export default function Rewards() {
  // --- GLOBALNE PUNKTY (współdzielone z resztą appki przez localStorage) ---
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('kinetic_user_points');
    return saved ? parseInt(saved) : 1250;
  });

  const [redeemed, setRedeemed] = useState<string[]>(() => {
    const saved = localStorage.getItem('kinetic_rewards_redeemed');
    return saved ? JSON.parse(saved) : [];
  });

  const [claimedRewards, setClaimedRewards] = useState<{key: string, code: string, date: string}[]>(() => {
    const saved = localStorage.getItem('kinetic_rewards_claimed');
    return saved ? JSON.parse(saved) : [];
  });

  const [challenges, setChallenges] = useState<{ name: string; date: string }[]>(() => {
    const saved = localStorage.getItem('kinetic_rewards_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = REWARD_PAGES.length;

  // Modals
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [rewardDetail, setRewardDetail] = useState<{key: string, title: string, code: string, desc: string} | null>(null);
  const [showProPlans, setShowProPlans] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [notif, setNotif] = useState<Notif>(null);

  // Zapis
  useEffect(() => { localStorage.setItem('kinetic_user_points', userPoints.toString()); }, [userPoints]);
  useEffect(() => { localStorage.setItem('kinetic_rewards_redeemed', JSON.stringify(redeemed)); }, [redeemed]);
  useEffect(() => { localStorage.setItem('kinetic_rewards_claimed', JSON.stringify(claimedRewards)); }, [claimedRewards]);
  useEffect(() => { localStorage.setItem('kinetic_rewards_challenges', JSON.stringify(challenges)); }, [challenges]);

  useEffect(() => {
    if (notif) { const t = setTimeout(() => setNotif(null), 3000); return () => clearTimeout(t); }
  }, [notif]);

  const handleRedeem = (cost: number, key: string, title: string) => {
    if (key.startsWith('coming')) { setNotif({ msg: 'This reward is not available yet!', ok: false }); return; }
    if (redeemed.includes(key)) {
      const existing = claimedRewards.find(r => r.key === key);
      if (existing) setRewardDetail({ key, title, code: existing.code, desc: getRewardDesc(key) });
      return;
    }
    if (userPoints < cost) { setNotif({ msg: `Not enough points! Need ${cost - userPoints} PTS more.`, ok: false }); return; }

    setUserPoints(p => p - cost);
    setRedeemed(r => [...r, key]);
    const code = generateCode(key);
    const entry = { key, code, date: new Date().toLocaleDateString() };
    setClaimedRewards(c => [...c, entry]);
    setNotif({ msg: `Claimed: ${title}! View your reward code.`, ok: true });
    setRewardDetail({ key, title, code, desc: getRewardDesc(key) });
  };

  const getRewardDesc = (key: string) => {
    if (key === 'gaming') return 'Present this code at the Gaming Lounge reception to unlock your 3-hour pass. Valid for 30 days from claim date.';
    if (key === 'coffee') return 'Show this voucher at any partner roastery (Starbucks, Costa, Blue Bottle) to get your free artisan coffee. One-time use only.';
    if (key === 'movie') return 'Redeem at Cinema City or Multikino box office for any standard 2D screening. Valid for 14 days.';
    if (key === 'dayoff') return 'Activate this pass from your Habit List to freeze all habits for one Sunday without losing streak.';
    if (key === 'theme') return 'Theme will be automatically applied to your Dashboard after claiming. You can switch it in Settings.';
    return 'Your reward is ready! Code is valid and stored in your account.';
  };

  const generateCode = (key: string) => {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    if (key === 'gaming') return `GAME-${rand}-3H`;
    if (key === 'coffee') return `BREW-${rand}-ART`;
    if (key === 'movie') return `CINE-${rand}-2D`;
    if (key === 'dayoff') return `OFF-${rand}-SUN`;
    if (key === 'theme') return `THM-${rand}-NEO`;
    return `RWD-${rand}`;
  };

  const resetProgress = () => {
    if (!confirm('Reset all rewards and points to default?')) return;
    setUserPoints(1250);
    setRedeemed([]);
    setClaimedRewards([]);
    setChallenges([]);
    setCurrentPage(0);
    setNotif({ msg: 'Progress reset! You have 1,250 PTS again.', ok: true });
  };

  const simulateEarn = () => {
    setUserPoints(p => p + 100);
    setNotif({ msg: '+100 PTS earned! (Simulated from habit completion)', ok: true });
  };

  const sendChallenge = () => {
    if (!friendName.trim()) return;
    const entry = { name: friendName.trim(), date: new Date().toLocaleDateString() };
    setChallenges(c => [...c, entry]);
    setFriendName('');
    setNotif({ msg: `Challenge sent to ${entry.name}!`, ok: true });
  };

  // UI Helpers
  const ModalCard = ({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={onClose}>
      <div style={{ background: '#18181b', borderRadius: '20px', padding: '32px', maxWidth: wide ? '640px' : '520px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', border: '1px solid #27272a' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}><X size={22} /></button>
        {children}
      </div>
    </div>
  );

  const pageRewards = REWARD_PAGES[currentPage];

  return (
    <div className="dashboard-container">
      <AppSidebar />
      <div className="dashboard-main">
        <AppHeader />
        <div style={{ padding: '32px', overflowY: 'auto', position: 'relative' }}>

          {/* Toast */}
          {notif && (
            <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 2000, padding: '14px 22px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: notif.ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${notif.ok ? '#22c55e' : '#ef4444'}`, color: notif.ok ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '14px', backdropFilter: 'blur(8px)' }}>
              {notif.ok ? <CheckCircle size={18} /> : <X size={18} />}
              {notif.msg}
            </div>
          )}

          {/* ===== GÓRA: Level + Streak ===== */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', color: '#52525b' }}><Sparkles size={28} /></div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 700 }}>Level 24</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Master Architect • 840 XP to Level 25</p>
              <div style={{ height: '8px', background: '#27272a', borderRadius: '4px', marginBottom: '8px' }}>
                <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #a855f7)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#71717a' }}><span>12,400 XP</span><span>13,240 XP</span></div>
            </div>

            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', position: 'relative' }}>
                <Zap size={28} color="#22c55e" fill="#22c55e" />
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#22c55e', color: '#000', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>new</span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Consistency King</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#a1a1aa' }}>30 Day Streak Achieved</p>
            </div>
          </div>

          {/* ===== BADGES + LEADERBOARD ===== */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Badges */}
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Unlocked Badges</h3>
                <button onClick={() => setShowAllBadges(true)} style={{ color: '#a855f7', fontSize: '14px', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ArrowRight size={16} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {ALL_BADGES.filter(b => b.earned).map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.name} onClick={() => setSelectedBadge(badge)} style={{ textAlign: 'center', cursor: 'pointer', padding: '8px', borderRadius: '12px', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#27272a')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: badge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                        <Icon size={24} color="#fff" />
                      </div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600 }}>{badge.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#71717a' }}>{badge.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>Leaderboard</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#71717a', fontSize: '14px', fontWeight: 700, width: '20px' }}>1</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Alex Chen</p></div>
                <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>18.2k</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', marginBottom: '8px' }}>
                <span style={{ color: '#71717a', fontSize: '14px', fontWeight: 700, width: '20px' }}>2</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>You</p><p style={{ margin: 0, fontSize: '11px', color: '#a855f7' }}>Level 24</p></div>
                <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>12.4k</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#71717a', fontSize: '14px', fontWeight: 700, width: '20px' }}>3</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Sarah Jay</p></div>
                <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>11.9k</span>
              </div>
              <button onClick={() => setShowChallenge(true)} style={{ width: '100%', marginTop: '8px', padding: '10px', background: 'transparent', border: '1px solid #27272a', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <UserPlus size={14} /> Challenge Friend
              </button>
            </div>
          </div>

          {/* ===== REWARD SHOP ===== */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600 }}>Reward Shop</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#71717a' }}>Trade your hard-earned points for custom rewards.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Symulacja zarobku + Reset */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={simulateEarn} style={{ padding: '6px 12px', background: '#27272a', border: '1px solid #3f3f46', color: '#22c55e', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +100 PTS
                  </button>
                  <button onClick={resetProgress} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #27272a', color: '#71717a', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>

                <span style={{ fontSize: '14px', fontWeight: 700, color: '#a855f7', background: 'rgba(168,85,247,0.12)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} fill="currentColor" /> {userPoints.toLocaleString()} PTS
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #27272a', background: 'transparent', color: currentPage === 0 ? '#52525b' : '#fff', cursor: currentPage === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #27272a', background: 'transparent', color: currentPage === totalPages - 1 ? '#52525b' : '#fff', cursor: currentPage === totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentPage ? '#a855f7' : '#3f3f46', transition: 'background 0.2s' }} />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {pageRewards.map((reward) => {
                const Icon = reward.icon;
                const isClaimed = redeemed.includes(reward.key);
                const isLocked = reward.key.startsWith('coming');

                if (reward.type === 'premium') {
                  return (
                    <div key={reward.key} onClick={() => setShowProPlans(true)} style={{ background: '#18181b', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                      <div style={{ height: '140px', background: reward.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '16px' }}>
                        <Crown size={32} color={reward.iconColor} style={{ marginBottom: '8px' }} />
                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: reward.tagColor, color: '#000', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{reward.tag}</span>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', textAlign: 'center', color: '#fff' }}>{reward.title}</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: '#a1a1aa', textAlign: 'center' }}>{reward.desc}</p>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{ flex: 1, height: '6px', background: '#27272a', borderRadius: '3px' }}>
                            <div style={{ width: '48%', height: '100%', background: '#22c55e', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>48% Done</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#71717a' }}>Goal: 50 LVL</span>
                          <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>Click to view plans</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={reward.key} style={{ background: '#18181b', borderRadius: '16px', overflow: 'hidden', opacity: isClaimed ? 0.55 : 1, transition: 'opacity 0.3s' }}>
                    <div style={{ height: '140px', background: reward.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <Icon size={48} color={reward.iconColor} />
                      <span style={{ position: 'absolute', top: '12px', left: '12px', background: reward.tagColor, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{reward.tag}</span>
                      {isClaimed && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={40} color="#22c55e" /></div>}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{reward.title}</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#71717a', lineHeight: '1.4' }}>{reward.desc}</p>
                      <button 
                        onClick={() => !isLocked && handleRedeem(reward.cost, reward.key, reward.title)}
                        style={{ width: '100%', padding: '10px', background: isClaimed ? '#27272a' : isLocked ? '#18181b' : '#a855f7', color: '#fff', border: isLocked ? '1px dashed #3f3f46' : 'none', borderRadius: '8px', cursor: isClaimed || isLocked ? 'default' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: isClaimed ? 0.7 : 1 }}
                        disabled={isClaimed || isLocked}
                      >
                        {isClaimed ? '✓ Claimed — View Code' : isLocked ? 'Coming Soon' : `Redeem Reward • ${reward.cost} PTS`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========== MODAL: Badge Detail ========== */}
      {selectedBadge && (
        <ModalCard onClose={() => setSelectedBadge(null)}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: selectedBadge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <selectedBadge.icon size={36} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>{selectedBadge.name}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa' }}>{selectedBadge.desc}</p>
          </div>
          <div style={{ background: '#27272a', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>How to earn</h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#e4e4e7' }}>{selectedBadge.requirement}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            {selectedBadge.earned ? <CheckCircle size={18} color="#22c55e" /> : <Lock size={18} color="#ef4444" />}
            <span style={{ fontSize: '14px', fontWeight: 600, color: selectedBadge.earned ? '#22c55e' : '#ef4444' }}>
              {selectedBadge.earned ? 'Unlocked! You have this badge.' : 'Locked — complete the requirement to unlock.'}
            </span>
          </div>
        </ModalCard>
      )}

      {/* ========== MODAL: All Badges ========== */}
      {showAllBadges && (
        <ModalCard onClose={() => setShowAllBadges(false)}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>All Badges</h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#a1a1aa' }}>Earned: {ALL_BADGES.filter(b => b.earned).length} / {ALL_BADGES.length}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {ALL_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.name} onClick={() => { setShowAllBadges(false); setSelectedBadge(badge); }} style={{ textAlign: 'center', padding: '16px 12px', borderRadius: '14px', background: badge.earned ? '#27272a' : '#18181b', opacity: badge.earned ? 1 : 0.4, border: `1px solid ${badge.earned ? '#3f3f46' : '#27272a'}`, cursor: 'pointer' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: badge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Icon size={20} color="#fff" />
                  </div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600 }}>{badge.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#71717a' }}>{badge.desc}</p>
                  {!badge.earned && <span style={{ fontSize: '10px', color: '#ef4444', marginTop: '6px', display: 'block' }}>LOCKED</span>}
                </div>
              );
            })}
          </div>
        </ModalCard>
      )}

      {/* ========== MODAL: Reward Code ========== */}
      {rewardDetail && (
        <ModalCard onClose={() => setRewardDetail(null)}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Gift size={28} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{rewardDetail.title}</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Claimed on {new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ background: '#27272a', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Reward Code</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#a855f7', letterSpacing: '2px', fontFamily: 'monospace' }}>{rewardDetail.code}</p>
          </div>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#d4d4d8', lineHeight: '1.5', textAlign: 'center' }}>{rewardDetail.desc}</p>
          <button onClick={() => setRewardDetail(null)} style={{ width: '100%', padding: '12px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Got it!</button>
        </ModalCard>
      )}

      {/* ========== MODAL: Kinetic Pro Plans ========== */}
      {showProPlans && (
        <ModalCard onClose={() => setShowProPlans(false)} wide>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CrownIcon size={28} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>Kinetic Pro</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa' }}>Unlock the full potential of your habits.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {/* Monthly */}
            <div style={{ background: '#27272a', borderRadius: '14px', padding: '24px 16px', textAlign: 'center', border: '1px solid #3f3f46' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 700, color: '#fff' }}>$9.99<span style={{ fontSize: '14px', color: '#71717a', fontWeight: 400 }}>/mo</span></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#d4d4d8', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Advanced Statistics</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Cloud Sync</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> 3 Custom Themes</div>
              </div>
              <button onClick={() => { setNotif({ msg: 'Monthly plan selected! (Demo)', ok: true }); setShowProPlans(false); }} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #3f3f46', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Choose Monthly</button>
            </div>

            {/* Yearly */}
            <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))', borderRadius: '14px', padding: '24px 16px', textAlign: 'center', border: '2px solid #a855f7', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#a855f7', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>BEST VALUE</span>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Yearly</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 700, color: '#fff' }}>$79.99<span style={{ fontSize: '14px', color: '#71717a', fontWeight: 400 }}>/yr</span></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#d4d4d8', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Everything in Monthly</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Unlimited Themes</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Priority Support</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 600, color: '#a855f7' }}>Save 33%</div>
              </div>
              <button onClick={() => { setNotif({ msg: 'Yearly plan selected! (Demo)', ok: true }); setShowProPlans(false); }} style={{ width: '100%', padding: '10px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Choose Yearly</button>
            </div>

            {/* Lifetime */}
            <div style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))', borderRadius: '14px', padding: '24px 16px', textAlign: 'center', border: '1px solid #eab308' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#eab308', textTransform: 'uppercase', letterSpacing: '1px' }}>Lifetime</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 700, color: '#fff' }}>$199.99<span style={{ fontSize: '14px', color: '#71717a', fontWeight: 400 }}> once</span></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#d4d4d8', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Everything Forever</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> All Future Updates</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={14} color="#22c55e" /> Beta Access</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 600, color: '#eab308' }}>Pay once, keep forever</div>
              </div>
              <button onClick={() => { setNotif({ msg: 'Lifetime plan selected! (Demo)', ok: true }); setShowProPlans(false); }} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #eab308', color: '#eab308', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Choose Lifetime</button>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: '#71717a', textAlign: 'center' }}>
            Or reach <strong>Level 50</strong> to unlock Kinetic Pro for free automatically.
          </p>
        </ModalCard>
      )}

      {/* ========== MODAL: Challenge Friend ========== */}
      {showChallenge && (
        <ModalCard onClose={() => setShowChallenge(false)}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>Challenge Friend</h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#a1a1aa' }}>Wyzwij znajomego na pojedynek w nawykach!</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              type="text" 
              placeholder="Friend's name..."
              value={friendName}
              onChange={e => setFriendName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChallenge()}
              style={{ flex: 1, padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
            <button onClick={sendChallenge} style={{ padding: '12px 20px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={18} /> Send
            </button>
          </div>
          {challenges.length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Sent Challenges</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {challenges.map((c, i) => (
                  <div key={i} style={{ padding: '12px 14px', background: '#27272a', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sword size={14} color="#fff" /></div>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#f59e0b' }}>{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ModalCard>
      )}
    </div>
  );
}
