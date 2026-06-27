import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeRoom } from '../services/api'

const STANDARDS = [
  'Workplace Safety (OSHA)',
  'Kitchen Hygiene (FSSAI)',
  'Hospital Infection Control',
  'Fire Safety Standards',
  'Office Ergonomics',
  'School Safety Standards',
  'Hostel Cleanliness',
  'Custom Standard',
]

export default function Home() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [standard, setStandard] = useState(STANDARDS[0])
  const [customStandard, setCustomStandard] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async () => {
    if (!file) return setError('Please upload an image first')
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('standard', standard === 'Custom Standard' ? customStandard : standard)

      const response = await analyzeRoom(formData)
      navigate(`/results/${response.data.id}`, { state: response.data })
    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Room Compliance Checker</h1>
        <p className="text-slate-400">Upload a photo of any space and get an AI-powered compliance report instantly</p>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <label className="block text-sm font-medium text-slate-300 mb-3">Upload Room Photo</label>
        <div
          className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
          onClick={() => document.getElementById('fileInput').click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
          ) : (
            <div>
              <div className="text-5xl mb-3">📷</div>
              <p className="text-slate-400">Click to upload an image</p>
              <p className="text-slate-500 text-sm mt-1">JPG, PNG, WEBP supported</p>
            </div>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {file && (
          <p className="text-green-400 text-sm mt-2">✓ {file.name} selected</p>
        )}
      </div>

      {/* Standard Selection */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <label className="block text-sm font-medium text-slate-300 mb-3">Compliance Standard</label>
        <select
          className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
        >
          {STANDARDS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {standard === 'Custom Standard' && (
          <input
            type="text"
            placeholder="Describe your compliance standard..."
            className="w-full mt-3 bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
            value={customStandard}
            onChange={(e) => setCustomStandard(e.target.value)}
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-500 text-red-300 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-4 rounded-xl transition text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analyzing with AI...
          </span>
        ) : '🔍 Analyze Compliance'}
      </button>
    </div>
  )
}