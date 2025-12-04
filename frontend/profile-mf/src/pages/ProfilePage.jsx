import React from 'react'
import { Link } from 'react-router-dom'
import { useGetProfileQuery } from '../../../shared/services/usersApi'
import ProfileCard from '../components/ProfileCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const ProfilePage = () => {
  const { data: user, isLoading, error } = useGetProfileQuery()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

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