export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateName = (name) => {
  return name.trim().length >= 2
}

export const validateForm = (formData, fields) => {
  const errors = {}
  
  fields.forEach(field => {
    const value = formData[field.name]
    
    if (!value || value.trim() === '') {
      errors[field.name] = `${field.placeholder} is required`
      return
    }
    
    switch (field.type) {
      case 'email':
        if (!validateEmail(value)) {
          errors[field.name] = 'Please enter a valid email'
        }
        break
      case 'password':
        if (!validatePassword(value)) {
          errors[field.name] = 'Password must be at least 6 characters'
        }
        break
      case 'text':
        if (field.name === 'name' && !validateName(value)) {
          errors[field.name] = 'Name must be at least 2 characters'
        }
        break
    }
  })
  
  return errors
}