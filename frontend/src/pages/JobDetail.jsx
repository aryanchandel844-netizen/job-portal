import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const JobDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}/`)
        setJob(res.data)
      } catch (err) {
        console.error('Job fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setApplying(true)
    setError('')
    setMessage('')
    try {
      await API.post(`/jobs/${id}/apply/`, {
        cover_letter: coverLetter,
      })
      setMessage('Application submitted successfully!')
      setCoverLetter('')
    } catch (err) {
      setError(
        err.response?.data?.error || 'Already applied or error occurred'
      )
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading job details...
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Job not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        {/* Job Header */}
        <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
        <p className="text-blue-600 text-lg font-semibold mt-1">
          {job.employer_detail?.company_name}
        </p>

        {/* Tags */}
        <div className="flex gap-3 mt-3 flex-wrap">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {job.job_type.replace('_', ' ')}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {job.location}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {job.experience}
          </span>
        </div>

        {/* Salary & Deadline */}
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-gray-500 text-sm">Salary Range</p>
            <p className="text-green-600 font-bold text-lg">
              ₹{job.salary_min} - ₹{job.salary_max}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Deadline</p>
            <p className="text-red-500 font-semibold">{job.deadline}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Job Description
          </h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Skills Required
          </h2>
          <p className="text-gray-600">{job.skills_required}</p>
        </div>

        {/* Apply Section */}
        {user?.user_type === 'seeker' && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-700 mb-3">
              Apply for this Job
            </h2>

            {message && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a short cover letter (optional)..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleApply}
              disabled={applying}
              className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        )}

        {!user && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-3">Login to apply for this job</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail