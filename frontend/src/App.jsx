import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import Interview from './pages/Interview'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-400">
              🏛️ Compliance Auditor
            </a>
            <div className="flex gap-6">
              <a href="/" className="text-slate-300 hover:text-white transition">Audit</a>
              <a href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</a>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results/:auditId" element={<Results />} />
          <Route path="/interview/:auditId" element={<Interview />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App