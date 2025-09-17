/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signup } from '../../actions/userAction.'

function SignupScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirect = location.search ? location.search.split("=")[1] : "/"

  const [message, setMessage] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(false)

  const userSignup = useSelector((state) => state.userSignup)
  const { error, loading, userinfo } = userSignup

  const [FormValues, setFormValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confrimpassword: "",
    termsAccepted: false,
  })

  const [FormErrors, setFormErrors] = useState({
    fname: null,
    lname: null,
    email: null,
    password: null,
    confrimpassword: null,
    termsAccepted: null,
  })


  useEffect(() => {
    if (signupSuccess) {
      setMessage("Signup is Successful ✅")

      const timer = setTimeout(() => {
        setMessage("")
        setSignupSuccess(false)


        navigate("/signup")
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [signupSuccess, navigate])

  useEffect(() => {
    if (userinfo) {
      setMessage(userinfo["details"]);

      const timer = setTimeout(() => {
        setMessage("");
      }, 15000);

      return () => clearTimeout(timer);
    }

  }, [userinfo]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFormValues({
      ...FormValues,
      [name]: newValue,
    })
    validateField(name, newValue)
  }

  const isFormValid = () => {
    return (
      Object.values(FormErrors).every((error) => error === null) &&
      Object.values(FormValues).every((value) => value !== "" && value !== false)
    )
  }

  const clearForm = () => {
    setFormValues({
      fname: "",
      lname: "",
      email: "",
      password: "",
      confrimpassword: "",
      termsAccepted: false,
    })
  }

  const validateField = (name, value) => {
    let errorMessage = null

    switch (name) {
      case "fname":
      case "lname":
        if (!value) {
          errorMessage = "This field is required..."
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errorMessage = "Your email is invalid.."
        }
        break
      case "password":
        const minlength = 6;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/

        if (value.length < minlength || !passwordRegex.test(value)) {
          errorMessage = "Password must be at least [0-9] [a-z] [A-Z] [_$#*!..] & 6 characters.."
        }
        break
      case "confrimpassword":
        if (value !== FormValues.password) {
          errorMessage = "Passwords do not match..."
        }
        break
      case "termsAccepted":
        if (!value) {
          errorMessage = "You must accept the terms and conditions.."
        }
        break
      default:
        break
    }

    setFormErrors({
      ...FormErrors,
      [name]: errorMessage,
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()

    // Run validation for all fields
    Object.entries(FormValues).forEach(([name, value]) => {
      validateField(name, value)
    })


    if (!isFormValid()) {
      return
    }

    dispatch(
      signup(
        FormValues.fname,
        FormValues.lname,
        FormValues.email,
        FormValues.password
      )
    )

    setSignupSuccess(true)
    clearForm()
  }
  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;

  return (
    <Container>
      <Row>
        <Col md={3}></Col>
        <Col md={6} className="card border shadow">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger" onClick={handleClose} >{error?.detail || "Signup failed"}</Message>
          ) : message ? (
            <Message variant="success" onClick={handleClose} >{message}</Message>
          ) : null}
          <Form noValidate validated={false} onSubmit={submitHandler}>
            <h1 className="text-center">Signup Here</h1>

            <Form.Group controlId="fname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your First Name"
                name="fname"
                value={FormValues.fname}
                onChange={handleChange}
                isInvalid={!!FormErrors.fname}
                isValid={FormValues.fname !== "" && !FormErrors.fname}
              />
              <Form.Control.Feedback type="invalid">
                {FormErrors.fname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="lname" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Last Name"
                name="lname"
                value={FormValues.lame}
                onChange={handleChange}
                isInvalid={!!FormErrors.lname}
                isValid={FormValues.lname !== "" && !FormErrors.lname}
              />
              <Form.Control.Feedback type="invalid">
                {FormErrors.lname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your E-Mail"
                name="email"
                value={FormValues.email}
                onChange={handleChange}
                isInvalid={!!FormErrors.email}
                isValid={FormValues.email !== "" && !FormErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {FormErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="pass1" className="mt-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  name="password"
                  value={FormValues.password}
                  onChange={handleChange}
                  isInvalid={!!FormErrors.password}
                  isValid={FormValues.password !== "" && !FormErrors.password}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderLeft: "none" }}
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {FormErrors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group controlId="pass2" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confrimpassword"
                  value={FormValues.confrimpassword}
                  onChange={handleChange}
                  isInvalid={!!FormErrors.confrimpassword}
                  isValid={
                    FormValues.confrimpassword !== "" && !FormErrors.confrimpassword
                  }
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ borderLeft: "none" }}
                >
                  <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {FormErrors.confrimpassword}
              </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mt-3">
              <Form.Check
                name="termsAccepted"
                label="Agree to terms and conditions"
                checked={FormValues.termsAccepted}
                onChange={handleChange}
                isInvalid={!!FormErrors.termsAccepted}
                isValid={
                  FormValues.termsAccepted && !FormErrors.termsAccepted
                }
              />
              {FormErrors.termsAccepted && (
                <div className="invalid-feedback d-block">
                  {FormErrors.termsAccepted}
                </div>
              )}
            </Form.Group>

            <Button
              type="submit"
              className="btn-success mt-4 mb-4 w-100"
              disabled={!isFormValid()}
            >
              Sign Up
            </Button>
          </Form>
          <Row className='py-3'>
            <Col>
              Already a User ?
              <Link to="/login">Login In</Link>
            </Col>
          </Row>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  )
}

export default SignupScreen
