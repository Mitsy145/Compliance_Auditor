export default function ResultCard({ score, gaps }) {
  const getScoreColor = (s) => {
    if (s >= 75) return 'text-green-400'
    if (s >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (s) => {
    if (s >= 75) return 'border-green-500'
    if (s >= 50) return 'border-yellow-500'
    return 'border-red-500'
  }

  const getLabel = (s) => {
    if (s >= 75) return '✅ Compliant'
    if (s >= 50) return '⚠️ Partially Compliant'
    return '❌ Non-Compliant'
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
      {/* Score */}
      <div className={`flex items-center justify-center w-36 h-36 rounded-full border-4 ${getScoreBg(score)} mx-auto mb-6`}>
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="text-slate-400 text-sm">/ 100</div>
        </div>
      </div>

      <div className={`text-center text-lg font-semibold mb-6 ${getScoreColor(score)}`}>
        {getLabel(score)}
      </div>

      {/* Gaps */}
      <div>
        <h3 className="text-white font-semibold mb-3 text-lg">🔍 Detected Gaps</h3>
        <div className="space-y-3">
          {gaps.map((gap, i) => (
            <div key={i} className="flex gap-3 bg-slate-700/50 rounded-xl p-4">
              <span className="text-red-400 font-bold shrink-0">#{i + 1}</span>
              <p className="text-slate-300 text-sm">{gap}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}