import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AuthForm from '../components/AuthForm'
import Toast from '../components/Toast'
import { registerUser, clearError } from '../store/authSlice'

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



const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(state => state.auth)
  const [toast, setToast] = React.useState(null)

  React.useEffect(() => {
    if (isAuthenticated) {
      setToast({ message: 'Registration successful! Redirecting to login...', type: 'success' })
      setTimeout(() => navigate('/login'), 2000)
    }
  }, [isAuthenticated, navigate])

  React.useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' })
    }
  }, [error])

  React.useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

  const handleRegister = (formData) => {
    dispatch(registerUser(formData))
  }

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full Name' },
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' }
  ]

  return (
    <Container>
      <div>
        <AuthForm
          title="Register"
          fields={fields}
          onSubmit={handleRegister}
          loading={loading}
          error={null}
          submitText="Register"
        />
        <Links>
          <Link to="/login">Already have an account? Login</Link>
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

export default RegisterPage