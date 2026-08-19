import { useState, useMemo } from 'react';
import type { FC } from 'react';
import type { SocialPost, SocialPlatform, SocialSentiment } from '../types/forensic';

interface SocialMediaViewProps {
  posts: SocialPost[];
  onNavigateTab: (tab: string) => void;
}

const PLATFORM_CONFIG: Record<SocialPlatform, { color: string; bg: string; border: string; icon: string; short: string }> = {
  Instagram: { color: 'text-pink-300',   bg: 'bg-pink-500/15',   border: 'border-pink-500/40',   icon: 'photo_camera',  short: 'IG' },
  Twitter:   { color: 'text-sky-300',    bg: 'bg-sky-500/15',    border: 'border-sky-500/40',    icon: 'tag',           short: 'TW' },
  WhatsApp:  { color: 'text-emerald-300',bg: 'bg-emerald-500/15',border: 'border-emerald-500/40',icon: 'chat_bubble',   short: 'WA' },
};

const SENTIMENT_CONFIG: Record<SocialSentiment, { color: string; bg: string; border: string; label: string }> = {
  SUSPICIOUS: { color: 'text-red-300',    bg: 'bg-red-500/15',    border: 'border-red-500/40',    label: 'SUSPICIOUS' },
  ALERT:      { color: 'text-amber-300',  bg: 'bg-amber-500/15',  border: 'border-amber-500/40',  label: 'ALERT'      },
  NORMAL:     { color: 'text-sky-300',    bg: 'bg-sky-500/15',    border: 'border-sky-500/40',    label: 'NORMAL'     },
  NEUTRAL:    { color: 'text-[#859396]',  bg: 'bg-[#1b1f2c]',     border: 'border-[#3c494b]/30',  label: 'NEUTRAL'    },
};

export const SocialMediaView: FC<SocialMediaViewProps> = ({ posts, onNavigateTab }) => {
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'All'>('All');
  const [sentimentFilter, setSentimentFilter] = useState<SocialSentiment | 'All'>('All');
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  const filtered = useMemo(() => posts.filter(p => {
    const platOk = platformFilter === 'All' || p.platform === platformFilter;
    const sentOk = sentimentFilter === 'All' || p.sentiment === sentimentFilter;
    return platOk && sentOk;
  }), [posts, platformFilter, sentimentFilter]);

  const stats = {
    accounts: [...new Set(posts.map(p => p.handle))].length,
    posts: posts.length,
    entities: [...new Set(posts.flatMap(p => p.mentionedEntities))].length,
    anomalies: posts.filter(p => p.sentiment === 'SUSPICIOUS').length,
  };

  // Entity mention frequency
  const mentionFreq = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach(p => p.mentionedEntities.forEach(e => { freq[e] = (freq[e] ?? 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden glass-panel p-5 rounded-xl border border-purple-500/30">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="flex items-center gap-3 relative z-10">
          <span className="material-symbols-outlined text-purple-300 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          <div>
            <h2 className="font-headline-md text-[22px] font-bold text-[#dfe2f4]">Social Media Intelligence</h2>
            <p className="font-body-sm text-[13px] text-[#859396] mt-0.5">
              OSINT analysis of social media content linked to active investigation entities.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Accounts',       value: stats.accounts,  icon: 'manage_accounts', color: 'text-purple-300',   bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
          { label: 'Posts Scraped',  value: stats.posts,     icon: 'feed',            color: 'text-sky-300',      bg: 'bg-sky-500/10',    border: 'border-sky-500/30'    },
          { label: 'Linked Entities',value: stats.entities,  icon: 'hub',             color: 'text-[#6dedff]',    bg: 'bg-[#6dedff]/10',  border: 'border-[#6dedff]/30'  },
          { label: 'Anomalies',      value: stats.anomalies, icon: 'crisis_alert',    color: 'text-red-300',      bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
        ].map(s => (
          <div key={s.label} className={`glass-panel p-4 rounded-xl border ${s.border}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
              <div className={`font-headline-sm text-[26px] font-extrabold ${s.color}`}>{s.value}</div>
            </div>
            <div className="font-label-caps text-[10px] text-[#859396]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Platform tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0f131f] border border-[#3c494b]/30">
          {(['All', 'Instagram', 'Twitter', 'WhatsApp'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-md font-label-caps text-[10px] transition-all cursor-pointer ${
                platformFilter === p
                  ? 'bg-[#6dedff]/20 text-[#6dedff] border border-[#6dedff]/40'
                  : 'text-[#859396] hover:text-[#dfe2f4]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {/* Sentiment filter */}
        <div className="flex items-center gap-1">
          {(['All', 'SUSPICIOUS', 'ALERT', 'NORMAL', 'NEUTRAL'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSentimentFilter(s)}
              className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] border transition-all cursor-pointer ${
                sentimentFilter === s
                  ? 'bg-[#6dedff]/15 text-[#6dedff] border-[#6dedff]/40'
                  : 'text-[#859396] border-[#3c494b]/30 hover:text-[#dfe2f4]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Post Feed (left 60%) */}
        <div className="lg:col-span-3 space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {filtered.map(post => {
            const plat = PLATFORM_CONFIG[post.platform];
            const sent = SENTIMENT_CONFIG[post.sentiment];
            const isSelected = selectedPost?.id === post.id;
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(isSelected ? null : post)}
                className={`glass-panel p-5 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'border-[#6dedff]/50 shadow-[0_0_15px_rgba(109,237,255,0.2)]' : 'border-[#3c494b]/30 hover:border-[#3c494b]/60'
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Platform badge */}
                    <div className={`w-10 h-10 rounded-full ${plat.bg} border ${plat.border} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined text-[18px] ${plat.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{plat.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-[13px] text-[#dfe2f4] font-bold">{post.handle}</span>
                        <span className={`font-label-caps text-[9px] px-1.5 py-0.5 rounded border ${plat.color} ${plat.border} ${plat.bg}`}>{plat.short}</span>
                      </div>
                      <span className="font-body-sm text-[11px] text-[#859396]">{post.author} • {post.platform}</span>
                    </div>
                  </div>
                  <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded border ${sent.color} ${sent.border} ${sent.bg} shrink-0`}>{sent.label}</span>
                </div>

                {/* Post text */}
                <div className={`p-3 rounded-lg border ${post.sentiment === 'SUSPICIOUS' ? 'border-red-500/20 bg-red-500/5' : 'border-[#3c494b]/20 bg-[#0f131f]/50'} mb-3`}>
                  <p className="font-body-sm text-[13px] text-[#dfe2f4] leading-relaxed italic">
                    "{post.text}"
                  </p>
                </div>

                {/* Timestamp */}
                <div className="font-code-sm text-[11px] text-[#859396] mb-3">
                  {post.timestamp}{post.location && ` • ${post.location}`}
                </div>

                {/* Metadata chips */}
                <div className="space-y-2">
                  {post.mentionedEntities.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-label-caps text-[9px] text-[#859396]">MENTIONED:</span>
                      {post.mentionedEntities.map(e => (
                        <span key={e} className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-code-sm text-[10px]">{e}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {post.linkedIp && (
                      <div className="flex items-center gap-1">
                        <span className="font-label-caps text-[9px] text-[#859396]">LINKED IP:</span>
                        <span className="font-code-sm text-[10px] text-rose-300">{post.linkedIp}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="font-label-caps text-[9px] text-[#859396]">EVIDENCE:</span>
                      <span className="font-code-sm text-[10px] text-[#6dedff]">{post.evidenceId}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#3c494b]/20 flex gap-3">
                    <button
                      onClick={e => { e.stopPropagation(); onNavigateTab('entity_dna'); }}
                      className="font-label-caps text-[10px] text-[#6dedff] hover:text-[#95f1ff] flex items-center gap-1 cursor-pointer group/btn"
                    >
                      View Entity <span className="material-symbols-outlined text-[13px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    {post.linkedIp && (
                      <button
                        onClick={e => { e.stopPropagation(); onNavigateTab('graph'); }}
                        className="font-label-caps text-[10px] text-rose-300 hover:text-rose-200 flex items-center gap-1 cursor-pointer group/btn"
                      >
                        Map IP <span className="material-symbols-outlined text-[13px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); onNavigateTab('alerts'); }}
                      className="font-label-caps text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer group/btn"
                    >
                      <span className="material-symbols-outlined text-[13px]">flag</span> Flag
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="glass-panel p-12 rounded-xl border border-[#3c494b]/20 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#3c494b] block mb-3">public_off</span>
              <p className="font-body-md text-[#859396]">No posts match current filters.</p>
            </div>
          )}
        </div>

        {/* Right panel — Analytics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Entity mention frequency */}
          <div className="glass-panel p-5 rounded-xl border border-[#3c494b]/30">
            <h4 className="font-label-caps text-[11px] text-[#859396] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-purple-300">bar_chart</span>
              ENTITY MENTION FREQUENCY
            </h4>
            <div className="space-y-2.5">
              {mentionFreq.map(([entity, count]) => {
                const maxCount = mentionFreq[0]?.[1] ?? 1;
                const pct = (count / maxCount) * 100;
                return (
                  <div key={entity}>
                    <div className="flex justify-between mb-1">
                      <span className="font-code-sm text-[11px] text-[#dfe2f4] truncate">{entity}</span>
                      <span className="font-code-sm text-[11px] text-purple-300 shrink-0 ml-2">{count}×</span>
                    </div>
                    <div className="h-1.5 bg-[#1b1f2c] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sentiment distribution */}
          <div className="glass-panel p-5 rounded-xl border border-[#3c494b]/30">
            <h4 className="font-label-caps text-[11px] text-[#859396] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-300">donut_large</span>
              SENTIMENT DISTRIBUTION
            </h4>
            <div className="space-y-2">
              {(['SUSPICIOUS', 'ALERT', 'NORMAL', 'NEUTRAL'] as SocialSentiment[]).map(s => {
                const cnt = posts.filter(p => p.sentiment === s).length;
                const pct = Math.round((cnt / posts.length) * 100);
                const cfg = SENTIMENT_CONFIG[s];
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className={`font-label-caps text-[9px] w-20 shrink-0 ${cfg.color}`}>{s}</span>
                    <div className="flex-1 h-2 bg-[#1b1f2c] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          s === 'SUSPICIOUS' ? 'bg-red-400' :
                          s === 'ALERT' ? 'bg-amber-400' :
                          s === 'NORMAL' ? 'bg-sky-400' : 'bg-[#3c494b]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-code-sm text-[10px] text-[#859396] w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="glass-panel p-5 rounded-xl border border-[#3c494b]/30">
            <h4 className="font-label-caps text-[11px] text-[#859396] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-sky-300">apps</span>
              PLATFORM BREAKDOWN
            </h4>
            <div className="space-y-3">
              {(['Instagram', 'Twitter', 'WhatsApp'] as SocialPlatform[]).map(p => {
                const cnt = posts.filter(post => post.platform === p).length;
                const cfg = PLATFORM_CONFIG[p];
                return (
                  <div key={p} className={`flex items-center gap-3 p-3 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                    <span className={`material-symbols-outlined text-[20px] ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                    <span className={`font-label-caps text-[11px] flex-1 ${cfg.color}`}>{p}</span>
                    <span className={`font-headline-sm text-[18px] font-bold ${cfg.color}`}>{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross-link to correlation */}
          <button
            onClick={() => onNavigateTab('correlation')}
            className="w-full glass-panel p-4 rounded-xl border border-[#6dedff]/25 hover:border-[#6dedff]/50 transition-all cursor-pointer flex items-center gap-3 group"
          >
            <span className="material-symbols-outlined text-[#6dedff] text-[20px]">link</span>
            <div className="text-left">
              <p className="font-label-caps text-[11px] text-[#6dedff]">CROSS-DOMAIN CORRELATION</p>
              <p className="font-body-sm text-[12px] text-[#859396]">See how social activity links to CDR, Banking & IP data</p>
            </div>
            <span className="material-symbols-outlined text-[#6dedff] text-[18px] ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
