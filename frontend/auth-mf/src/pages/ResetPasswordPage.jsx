import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AuthForm from '../components/AuthForm'
import { authAPI } from '../utils/api'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`

const Links = styled.div`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const SuccessMessage = styled.div`
  color: #28a745;
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background: #d4edda;
  border-radius: 4px;
`

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  const handleResetPassword = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      await authAPI.resetPassword(token, formData.password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'password', type: 'password', placeholder: 'New Password' },
    { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
  ]

  return (
    <Container>
      <div>
        <AuthForm
          title="Reset Password"
          fields={fields}
          onSubmit={handleResetPassword}
          loading={loading}
          error={error}
          submitText="Reset Password"
        />
        {success && (
          <SuccessMessage>
            Password reset successful! Redirecting to login...
          </SuccessMessage>
        )}
        <Links>
          <Link to="/login">Back to Login</Link>
        </Links>
      </div>
    </Container>
  )
}

export default ResetPasswordPage