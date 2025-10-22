import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Loader from '../Loader';
import Message from '../Message';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, } from '../../actions/userAction.';


function LoginScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split('=')[1] : '/';
  const [loginAttempted, setLoginAttempted] = useState(false);

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userinfo } = userLogin;

  const [FormValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const [FormErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (userinfo && loginAttempted) {
      navigate(redirect);
    } else if (loginAttempted) {
      navigate('/login');
    }
  }, [userinfo, loginAttempted, navigate, redirect]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...FormValues, [name]: value });
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      Object.values(FormErrors).every((error) => error === null) &&
      Object.values(FormValues).every((value) => value !== '' && value !== false)
    );
  };

  const clearForm = () => {
    setFormValues({ email: '', password: '' });
  };

  const validateField = (name, value) => {
    let errorMessage = null;

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = 'Your email is invalid.';
        }
        break;
      case 'password':
        if (value.length < 6) {
          errorMessage = 'Password must be at least 6 characters.';
        }
        break;
      default:
        break;
    }

    setFormErrors({ ...FormErrors, [name]: errorMessage });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(FormValues.email, FormValues.password));
    clearForm();
    navigate('/')
    setLoginAttempted(true);
    setMessage('Login is Successful ✅');
    setTimeout(() => setMessage(''), 2000);
  };

  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;


  return (
    <>
      <Container>
        <Row>
          <Col md={3}></Col>
          <Col md={6} className="card border shadow p-4">
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger" onClick={handleClose} >{error?.detail || 'Login failed'}</Message>
            ) : message ? (
              <Message variant="success" onClick={handleClose} >{message}</Message>
            ) : null}

            <Form onSubmit={submitHandler}>
              <h1 className="text-center">Login Here</h1>

              <Form.Group controlId="email" className="mt-3">
                <Form.Label>E-Mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your E-Mail"
                  name="email"
                  value={FormValues.email}
                  onChange={handleChange}
                  isInvalid={!!FormErrors.email}
                  isValid={FormValues.email !== '' && !FormErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {FormErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="pass1" className="mt-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your Password"
                    name="password"
                    value={FormValues.password}
                    onChange={handleChange}
                    isInvalid={!!FormErrors.password}
                    isValid={FormValues.password !== '' && !FormErrors.password}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderLeft: 'none' }}
                  >
                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {FormErrors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="btn-success mt-4 mb-4 w-100"
                disabled={!isFormValid()}
              >
                Login
              </Button>
            </Form>
            <Row className='py-3'>
              <Col>
                New User ?
                <Link to="/signup">SignUp</Link>
              </Col>
            </Row>

          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginScreen;
