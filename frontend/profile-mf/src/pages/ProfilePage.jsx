import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../store/profileSlice'
import ProfileCard from '../components/ProfileCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.profile)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          <Link to="/edit" className="btn btn-primary">Edit Profile</Link>
          <Link to="/orders" className="btn btn-secondary">Order History</Link>
        </div>
      </div>
      {user && <ProfileCard user={user} />}
    </div>
  )
}

export default ProfilePage