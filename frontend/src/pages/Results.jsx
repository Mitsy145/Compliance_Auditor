import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getRecord } from '../services/api'
import ResultCard from '../components/ResultCard'
import ActionPlan from '../components/ActionPlan'

export default function Results() {
  const { auditId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState(location.state || null)
  const [loading, setLoading] = useState(!location.state)

  useEffect(() => {
    if (!location.state) {
      getRecord(auditId)
        .then((res) => setData(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [auditId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-64 mt-20">
      <div className="text-slate-400 text-lg animate-pulse">Loading results...</div>
    </div>
  )

  if (!data) return (
    <div className="text-center mt-20 text-red-400">Failed to load results.</div>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Audit Results</h1>
        <span className="text-slate-400 text-sm bg-slate-800 px-3 py-1 rounded-full">
          #{auditId} · {data.standard}
        </span>
      </div>

      <ResultCard score={data.score} gaps={data.gaps} />

      <ActionPlan actions={data.action_plan} />

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(`/interview/${auditId}`)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition text-lg"
        >
          🎤 Start Voice Interview
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-xl transition text-lg"
        >
          🔄 New Audit
        </button>
      </div>
    </div>
  )
}