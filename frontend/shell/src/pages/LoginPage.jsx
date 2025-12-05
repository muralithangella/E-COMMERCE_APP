import React, { useCallback, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import { VALIDATION_RULES } from '../constants/validation';
import styles from './LoginPage.module.css';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`)
    .required('Password is required')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [login, { isLoading, error }] = useLoginMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange'
  });

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  }, [login, dispatch, navigate, from]);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  }, []);

  const handleFacebookLogin = useCallback(() => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
  }, []);

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <Link to="/" className={styles.logo}>
              <img src="/amazon-logo.png" alt="Amazon" />
            </Link>
            <h1 className={styles.title}>Sign In</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className={styles.errorContainer}>
                <ErrorMessage message={error.message || 'Login failed'} />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!isValid}
              className={styles.submitButton}
            >
              Sign In
            </Button>

            <div className={styles.forgotPassword}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <div className={styles.socialLogin}>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleGoogleLogin}
              className={styles.socialButton}
            >
              <img src="/google-icon.svg" alt="Google" className={styles.socialIcon} />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleFacebookLogin}
              className={styles.socialButton}
            >
              <img src="/facebook-icon.svg" alt="Facebook" className={styles.socialIcon} />
              Continue with Facebook
            </Button>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              New to Amazon?{' '}
              <Link to="/register" className={styles.registerLink}>
                Create your Amazon account
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.benefits}>
          <h2 className={styles.benefitsTitle}>Sign in for the best experience</h2>
          <ul className={styles.benefitsList}>
            <li>Fast, free delivery with Prime</li>
            <li>Exclusive deals and early access</li>
            <li>Personalized recommendations</li>
            <li>Easy returns and exchanges</li>
            <li>Secure payment and checkout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;