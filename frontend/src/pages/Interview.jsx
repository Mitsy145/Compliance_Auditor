import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { generateInterview, submitAnswers } from '../services/api'

export default function Interview() {
  const { auditId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [interviewId, setInterviewId] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  // Load questions
  useEffect(() => {
    generateInterview(auditId)
      .then((res) => {
        setQuestions(res.data.questions)
        setInterviewId(res.data.id)
        setAnswers(new Array(res.data.questions.length).fill(''))
      })
      .catch(() => setError('Failed to generate interview questions'))
      .finally(() => setLoading(false))
  }, [auditId])

  // Speak question using TTS
  const speakQuestion = (text) => {
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.9
    utter.pitch = 1
    window.speechSynthesis.speak(utter)
  }

  useEffect(() => {
    if (questions.length > 0) {
      speakQuestion(questions[currentQ].question)
    }
  }, [currentQ, questions])

  // Start listening
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Use Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        }
      }
      if (final) {
        setTranscript(final)
        const updated = [...answers]
        updated[currentQ] = final
        setAnswers(updated)
      }
    }

    recognition.onerror = (e) => {
      setListening(false)
      setError(`Mic error: ${e.error}`)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const nextQuestion = () => {
    setTranscript(answers[currentQ + 1] || '')
    setCurrentQ((prev) => prev + 1)
  }

  const prevQuestion = () => {
    setTranscript(answers[currentQ - 1] || '')
    setCurrentQ((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    const unanswered = answers.filter((a) => !a.trim()).length
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return
    }

    setSubmitting(true)
    try {
      const res = await submitAnswers(interviewId, answers)
      setResults(res.data)
      window.speechSynthesis.cancel()
    } catch {
      setError('Failed to submit answers')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center mt-20">
      <div className="text-slate-400 animate-pulse text-lg">Generating interview questions with AI...</div>
    </div>
  )

  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-red-900/40 border border-red-500 text-red-300 rounded-lg px-4 py-3">{error}</div>
    </div>
  )

  // Results screen
  if (results) return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Interview Complete! 🎉</h1>
      <p className="text-slate-400 mb-8">Here's how you performed</p>

      {/* Total Score */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700 text-center">
        <div className="text-6xl font-bold text-white mb-2">{results.total_score}%</div>
        <div className={`text-lg font-medium ${
          results.total_score >= 70 ? 'text-green-400' :
          results.total_score >= 40 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {results.total_score >= 70 ? '✅ Great Performance' :
           results.total_score >= 40 ? '⚠️ Needs Improvement' : '❌ Needs More Study'}
        </div>
      </div>

      {/* Per question results */}
      <div className="space-y-4 mb-8">
        {results.results.map((r, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-start justify-between mb-2">
              <p className="text-white font-medium flex-1 pr-4">Q{i + 1}. {r.question}</p>
              <span className={`text-lg font-bold shrink-0 ${
                r.score >= 7 ? 'text-green-400' :
                r.score >= 4 ? 'text-yellow-400' : 'text-red-400'
              }`}>{r.score}/10</span>
            </div>
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-slate-500">Your answer: </span>{r.answer || '(no answer)'}
            </p>
            <p className="text-blue-300 text-sm">💡 {r.feedback}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition"
        >
          🔄 New Audit
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-xl transition"
        >
          📊 Dashboard
        </button>
      </div>
    </div>
  )

  // Interview screen
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Voice Interview</h1>
        <span className="text-slate-400 bg-slate-800 px-3 py-1 rounded-full text-sm">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <p className="text-slate-400 text-sm mb-2">Question {currentQ + 1}</p>
        <p className="text-white text-xl font-medium mb-3">{questions[currentQ]?.question}</p>
        <p className="text-slate-500 text-sm">💡 {questions[currentQ]?.context}</p>

        <button
          onClick={() => speakQuestion(questions[currentQ].question)}
          className="mt-4 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          🔊 Read question aloud
        </button>
      </div>

      {/* Voice Controls */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <p className="text-slate-400 text-sm mb-4">Your Answer (speak or type)</p>

        <div className="flex gap-3 mb-4">
          <button
            onClick={listening ? stopListening : startListening}
            className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              listening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {listening ? '⏹ Stop Recording' : '🎤 Start Speaking'}
          </button>
        </div>

        {listening && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-3 animate-pulse">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            Listening...
          </div>
        )}

        <textarea
          className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 resize-none"
          rows={4}
          placeholder="Your spoken answer will appear here, or type your answer..."
          value={answers[currentQ] || ''}
          onChange={(e) => {
            const updated = [...answers]
            updated[currentQ] = e.target.value
            setAnswers(updated)
            setTranscript(e.target.value)
          }}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={prevQuestion}
          disabled={currentQ === 0}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-xl transition"
        >
          ← Prev
        </button>

        {currentQ < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Next Question →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            {submitting ? 'Submitting...' : '✅ Submit All Answers'}
          </button>
        )}
      </div>
    </div>
  )
}