import React from 'react'
import { Link } from 'react-router-dom'
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

const ForgotPasswordPage = () => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  const handleForgotPassword = async (formData) => {
    setLoading(true)
    setError(null)
    
    try {
      await authAPI.forgotPassword(formData.email)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'email', type: 'email', placeholder: 'Enter your email' }
  ]

  return (
    <Container>
      <div>
        <AuthForm
          title="Forgot Password"
          fields={fields}
          onSubmit={handleForgotPassword}
          loading={loading}
          error={error}
          submitText="Send Reset Email"
        />
        {success && (
          <SuccessMessage>
            Password reset email sent! Check your inbox.
          </SuccessMessage>
        )}
        <Links>
          <Link to="/login">Back to Login</Link>
        </Links>
      </div>
    </Container>
  )
}

export default ForgotPasswordPage