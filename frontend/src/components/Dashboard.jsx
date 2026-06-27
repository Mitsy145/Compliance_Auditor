import { useNavigate } from 'react-router-dom'

export default function Dashboard({ history }) {
  const navigate = useNavigate()

  const avg = history.length
    ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
    : 0

  const best = history.length
    ? Math.max(...history.map((r) => r.score))
    : 0

  const getScoreColor = (s) => {
    if (s >= 75) return 'text-green-400'
    if (s >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (s) => {
    if (s >= 75) return 'bg-green-500'
    if (s >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div>
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-blue-400">{history.length}</div>
          <div className="text-slate-400 text-sm mt-1">Total Audits</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 text-center">
          <div className={`text-3xl font-bold ${getScoreColor(avg)}`}>{avg}</div>
          <div className="text-slate-400 text-sm mt-1">Avg Score</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 text-center">
          <div className={`text-3xl font-bold ${getScoreColor(best)}`}>{best}</div>
          <div className="text-slate-400 text-sm mt-1">Best Score</div>
        </div>
      </div>

      {/* Score Chart (CSS bars) */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
        <h3 className="text-white font-semibold mb-4">Score History</h3>
        <div className="flex items-end gap-2 h-32">
          {history.slice().reverse().slice(0, 10).map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-xs font-bold ${getScoreColor(r.score)}`}>{r.score}</span>
              <div
                className={`w-full rounded-t-md ${getScoreBg(r.score)} transition-all`}
                style={{ height: `${r.score}%` }}
              />
            </div>
          ))}
        </div>
        <div className="text-slate-500 text-xs mt-2 text-center">Last {Math.min(history.length, 10)} audits</div>
      </div>

      {/* History Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">All Audits</h3>
        </div>
        <div className="divide-y divide-slate-700">
          {history.map((r) => (
            <div
              key={r.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 cursor-pointer transition"
              onClick={() => navigate(`/results/${r.id}`)}
            >
              <div>
                <p className="text-white font-medium">{r.standard}</p>
                <p className="text-slate-500 text-sm mt-0.5">
                  {new Date(r.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                  {' · '}{r.gaps_count} gaps found
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${getScoreColor(r.score)}`}>{r.score}</span>
                <span className="text-slate-500">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}