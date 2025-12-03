import React from 'react'

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        <img 
          src={user.avatar || '/default-avatar.png'} 
          alt="Profile" 
          className="avatar-image"
        />
      </div>
      <div className="profile-info">
        <h2>{user.firstName} {user.lastName}</h2>
        <p className="email">{user.email}</p>
        {user.phone && <p className="phone">{user.phone}</p>}
        
        {user.address && (
          <div className="address-section">
            <h3>Address</h3>
            <div className="address">
              <p>{user.address.street}</p>
              <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
              <p>{user.address.country}</p>
            </div>
          </div>
        )}
        
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-label">Member since</span>
            <span className="stat-value">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard