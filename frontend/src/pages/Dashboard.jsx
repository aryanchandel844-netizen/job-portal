import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.user_type === 'seeker') {
          const res = await API.get('/jobs/my-applications/')
          setApplications(res.data)
        } else {
          const res = await API.get('/jobs/employer/applications/')
          setApplications(res.data)
        }
      } catch (err) {
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await API.put(`/jobs/applications/${appId}/status/`, {
        status: newStatus,
      })
      setApplications(applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      ))
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'reviewed': return 'bg-blue-100 text-blue-700'
      case 'accepted': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.username}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.user_type === 'seeker'
              ? 'Track your job applications here'
              : 'Manage applications for your jobs'}
          </p>
        </div>

        {/* Applications */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          {user?.user_type === 'seeker'
            ? 'My Applications'
            : 'Received Applications'}
        </h2>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            No applications yet
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {app.job_detail?.title}
                    </h3>
                    <p className="text-blue-600 font-semibold">
                      {app.job_detail?.employer_detail?.company_name}
                    </p>

                    {/* Employer view — applicant info */}
                    {user?.user_type === 'employer' && (
                      <p className="text-gray-600 mt-1">
                        Applicant:{' '}
                        <span className="font-semibold">
                          {app.applicant_detail?.username}
                        </span>{' '}
                        ({app.applicant_detail?.email})
                      </p>
                    )}

                    {app.cover_letter && (
                      <p className="text-gray-500 text-sm mt-2">
                        Cover Letter: {app.cover_letter}
                      </p>
                    )}

                    <p className="text-gray-400 text-sm mt-1">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>

                    {/* Employer can update status */}
                    {user?.user_type === 'employer' && (
                      <div className="mt-3 flex gap-2 justify-end">
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'accepted')}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard