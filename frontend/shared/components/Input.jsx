import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const inputClass = `input ${error ? 'input-error' : ''} ${className}`;

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;