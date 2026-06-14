import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const JobList = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    job_type: '',
    location: '',
    experience: '',
  })

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.job_type) params.append('job_type', filters.job_type)
      if (filters.location) params.append('location', filters.location)
      if (filters.experience) params.append('experience', filters.experience)

      const res = await API.get(`/jobs/?${params.toString()}`)
      setJobs(res.data)
    } catch (err) {
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-lg opacity-80">
          Thousands of jobs waiting for you
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4">
          <select
            name="job_type"
            value={filters.job_type}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Job Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>

          <select
            name="experience"
            value={filters.experience}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience</option>
            <option value="fresher">Fresher</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search by location..."
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No jobs found
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {job.title}
                    </h2>
                    <p className="text-blue-600 font-semibold mt-1">
                      {job.employer_detail?.company_name}
                    </p>
                    <div className="flex gap-3 mt-2 flex-wrap">
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
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">
                      ₹{job.salary_min} - ₹{job.salary_max}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Deadline: {job.deadline}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList