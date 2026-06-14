import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        JobPortal
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">
          Jobs
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>

            {user.user_type === 'employer' && (
              <Link
                to="/post-job"
                className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100"
              >
                Post Job
              </Link>
            )}

            <span className="text-sm opacity-80">
              Hi, {user.username}!
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar