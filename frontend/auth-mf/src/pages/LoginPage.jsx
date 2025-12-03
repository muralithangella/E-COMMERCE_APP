import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AuthForm from '../components/AuthForm'
import Toast from '../components/Toast'
import { loginUser, clearError } from '../store/authSlice'

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
    margin: 0 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(state => state.auth)
  const [toast, setToast] = React.useState(null)

  // Check if already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = 'http://localhost:3000';
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      setToast({ message: 'Login successful! Redirecting...', type: 'success' })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000'
      }, 1500)
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' })
    }
  }, [error])

  React.useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

  const handleLogin = (formData) => {
    dispatch(loginUser(formData))
  }

  const fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' }
  ]

  return (
    <Container>
      <div>
        <AuthForm
          title="Login"
          fields={fields}
          onSubmit={handleLogin}
          loading={loading}
          error={null}
          submitText="Login"
        />
        <Links>
          <Link to="/register">Don't have an account? Register</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </Links>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  )
}

export default LoginPage