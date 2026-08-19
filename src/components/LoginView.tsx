import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginView() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter your Officer ID and password.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 700));
    const ok = login(username, password);
    if (!ok) {
      setError('Invalid credentials. Access denied.');
    }
    setLoading(false);
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0b0e1a] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M0%200h1v40H0zM0%200h40v1H0z%22%20fill%3D%22rgba(40%2C210%2C230%2C0.04)%22%2F%3E%3C%2Fsvg%3E')]" />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(40,210,230,0.08)_0%,transparent_60%)]" />
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dedff]/60 to-transparent" />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 flex items-center gap-3 opacity-50">
        <span className="material-symbols-outlined text-[#6dedff] text-[18px]">security</span>
        <span className="font-label-caps text-[10px] text-[#859396] tracking-widest">SECURE TERMINAL</span>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span className="font-code-sm text-[11px] text-[#859396]">NODE: CHANDIGARH-HQ</span>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glow behind card */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#28d2e6]/20 to-[#6620bd]/15 blur-xl opacity-60" />

        <div className="relative bg-[#0e1220]/95 backdrop-blur-2xl border border-[#6dedff]/20 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#6dedff]/60 to-transparent rounded-full" />

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#28d2e6]/30 to-[#6620bd]/40 flex items-center justify-center border border-[#6dedff]/40 shadow-[0_0_30px_rgba(40,210,230,0.4)] mb-4">
              <span className="material-symbols-outlined text-[#6dedff] text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <div className="absolute -inset-0.5 rounded-2xl bg-[#6dedff]/10 blur-sm -z-10" />
            </div>
            <h1 className="font-headline-sm text-[22px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#6dedff] to-[#95f1ff] tracking-wider mb-1">
              POLICE NEXUS
            </h1>
            <p className="font-label-caps text-[10px] text-[#859396] tracking-widest">
              INVESTIGATIVE ANALYTICS PLATFORM
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Officer ID */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-[10px] text-[#859396] tracking-widest block">
                OFFICER ID
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#859396] group-focus-within:text-[#6dedff] transition-colors">
                  badge
                </span>
                <input
                  id="login-officer-id"
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="e.g. admin"
                  autoComplete="username"
                  className="w-full bg-[#131726]/90 border border-[#3c494b]/50 focus:border-[#6dedff] focus:ring-1 focus:ring-[#6dedff]/40 text-[#dfe2f4] rounded-xl pl-10 pr-4 py-3 font-body-sm text-[13px] outline-none transition-all placeholder:text-[#859396]/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-[10px] text-[#859396] tracking-widest block">
                PASSWORD
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#859396] group-focus-within:text-[#6dedff] transition-colors">
                  lock
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#131726]/90 border border-[#3c494b]/50 focus:border-[#6dedff] focus:ring-1 focus:ring-[#6dedff]/40 text-[#dfe2f4] rounded-xl pl-10 pr-4 py-3 font-body-sm text-[13px] outline-none transition-all placeholder:text-[#859396]/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-body-sm text-[12px]">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#28d2e6] to-[#00a8bd] hover:from-[#36d9ed] hover:to-[#28d2e6] text-[#00363d] py-3 px-4 rounded-xl font-label-caps text-[12px] font-bold tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(40,210,230,0.4)] hover:shadow-[0_0_35px_rgba(54,217,237,0.6)] transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  SECURE LOGIN
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5">
            <button
              id="toggle-demo-creds"
              onClick={() => setShowHints(h => !h)}
              className="w-full flex items-center justify-between text-[#859396] hover:text-[#dfe2f4] transition-colors py-2 cursor-pointer"
            >
              <span className="font-label-caps text-[10px] tracking-widest">DEMO CREDENTIALS</span>
              <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: showHints ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                expand_more
              </span>
            </button>

            {showHints && (
              <div className="mt-2 space-y-2 border border-[#3c494b]/30 rounded-xl p-3 bg-[#131726]/50">
                {[
                  { u: 'admin', p: 'admin123', role: 'ADMIN', color: 'text-red-400', icon: 'admin_panel_settings' },
                  { u: 'investigator', p: 'investigator123', role: 'INVESTIGATOR', color: 'text-amber-400', icon: 'manage_search' },
                  { u: 'analyst', p: 'analyst123', role: 'ANALYST', color: 'text-sky-400', icon: 'analytics' },
                ].map(acc => (
                  <button
                    key={acc.u}
                    id={`demo-login-${acc.u}`}
                    onClick={() => fillDemo(acc.u, acc.p)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#1f263c]/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`material-symbols-outlined text-[16px] ${acc.color}`}>{acc.icon}</span>
                      <div className="text-left">
                        <span className={`font-code-sm text-[11px] font-bold ${acc.color} block`}>{acc.u}</span>
                        <span className="font-code-sm text-[10px] text-[#859396]">{acc.p}</span>
                      </div>
                    </div>
                    <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded-full border ${acc.color} border-current opacity-70 tracking-wider`}>
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[#859396]">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
            <span className="font-label-caps text-[9px] tracking-widest">TLS-ENCRYPTED CONNECTION • PROTOTYPE SECURITY</span>
          </div>
        </div>

        {/* Scanning animation */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dedff]/70 to-transparent rounded-full animate-[scan_3s_linear_infinite]" />
      </div>

      <style>{`
        @keyframes scan {
          0%   { transform: translateY(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
