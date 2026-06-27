export default function ActionPlan({ actions }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4 text-lg">📋 AI-Generated Action Plan</h3>
      <div className="space-y-3">
        {actions.map((action, i) => (
          <div key={i} className="flex gap-3 bg-slate-700/50 rounded-xl p-4">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <p className="text-slate-300 text-sm">{action}</p>
          </div>
        ))}
      </div>
    </div>
  )
}