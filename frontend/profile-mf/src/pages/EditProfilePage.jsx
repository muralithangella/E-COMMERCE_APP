import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile, fetchProfile } from '../store/profileSlice'
import ProfileForm from '../components/ProfileForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const EditProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.profile)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile())
    } else {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      })
    }
  }, [dispatch, user])

  const handleSubmit = async (data) => {
    const result = await dispatch(updateProfile(data))
    if (updateProfile.fulfilled.match(result)) {
      navigate('/')
    }
  }

  if (loading && !user) return <LoadingSpinner />

  return (
    <div className="edit-profile-page">
      <div className="page-header">
        <h1>Edit Profile</h1>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Back to Profile
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
      <ProfileForm 
        initialData={formData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default EditProfilePage