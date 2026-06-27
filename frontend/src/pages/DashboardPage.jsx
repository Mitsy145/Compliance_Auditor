import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../services/api'
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data.history))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center mt-20">
      <div className="text-slate-400 animate-pulse text-lg">Loading dashboard...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Audit Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          + New Audit
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg">No audits yet. Run your first compliance check!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            Start Auditing
          </button>
        </div>
      ) : (
        <Dashboard history={history} />
      )}
    </div>
  )
}