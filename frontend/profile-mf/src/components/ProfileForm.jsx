import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchProfile } from '../store/profileSlice';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.profile);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profile: {
      phone: '',
      dateOfBirth: '',
      gender: ''
    },
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        sms: false
      }
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profile: {
          phone: user.profile?.phone || '',
          dateOfBirth: user.profile?.dateOfBirth ? 
            new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
          gender: user.profile?.gender || ''
        },
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? false
          }
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'notifications') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            notifications: {
              ...prev.preferences.notifications,
              [child]: type === 'checkbox' ? checked : value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (formData.profile.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.profile.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profile: {
          phone: user.profile?.phone || '',
          dateOfBirth: user.profile?.dateOfBirth ? 
            new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
          gender: user.profile?.gender || ''
        },
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? false
          }
        }
      });
    }
  };

  if (!user && loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-form">
      <div className="form-header">
        <h2>Profile Information</h2>
        {!isEditing && (
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={validationErrors.firstName ? 'error' : ''}
                required
              />
              {validationErrors.firstName && (
                <span className="field-error">{validationErrors.firstName}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={validationErrors.lastName ? 'error' : ''}
                required
              />
              {validationErrors.lastName && (
                <span className="field-error">{validationErrors.lastName}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={validationErrors.email ? 'error' : ''}
              required
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile.phone">Phone</label>
              <input
                type="tel"
                id="profile.phone"
                name="profile.phone"
                value={formData.profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={validationErrors.phone ? 'error' : ''}
              />
              {validationErrors.phone && (
                <span className="field-error">{validationErrors.phone}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="profile.dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="profile.dateOfBirth"
                name="profile.dateOfBirth"
                value={formData.profile.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="profile.gender">Gender</label>
            <select
              id="profile.gender"
              name="profile.gender"
              value={formData.profile.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Preferences</h3>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.preferences.newsletter}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              Subscribe to newsletter
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="notifications.email"
                checked={formData.preferences.notifications.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              Email notifications
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="notifications.sms"
                checked={formData.preferences.notifications.sms}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              SMS notifications
            </label>
          </div>
        </div>
        
        {isEditing && (
          <div className="form-actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;