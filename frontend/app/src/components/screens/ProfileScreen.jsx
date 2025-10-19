import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button,  Container, Form,Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader';
import Message from '../Message';
import { getUserDetails, updateUserProfile } from '../../actions/userAction.'
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstant';
import { listMyOrders } from '../../actions/OrderAction';
import { LinkContainer } from 'react-router-bootstrap';


function ProfileScreen() {

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userDetails = useSelector(state => state.userDetails)
  const { error, loading, user } = userDetails

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector(state => state.userUpdateProfile)
  const { success } = userUpdateProfile


  const ordersMyList = useSelector(state => state.orderMyList)
  const { loading: loadingOrders, error: errorOrders, orders } = ordersMyList


  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      if (!user || !user.first_name || !user.last_name || success || userInfo.id !== user.id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setFirstName(user.first_name)
        setLastName(user.last_name)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user, success])

  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Password do not Match')
    } else {
      dispatch(updateUserProfile({
        'id': user.id,
        'first_name': first_name,
        'last_name': last_name,
        'password': password
      }))
      setMessage('')
    }
  }

  return (
    <>
      <Link to='/'>
        <Button>Go Back</Button>
      </Link>

      <Container>
        <Row className='mt-4'>
          <Col md={3} className='shadow-lg' style={{ height: '510px' }}>
            <div>
              <h1>User Profile</h1>
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger' onClick={handleClose}>
                  {error}
                </Message>
              ) : (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='first_name'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter First name'
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId='last_name' className='mt-3'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Last name'
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId='password' className='mt-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='Enter Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId='confrimpassword' className='mt-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='Confirm Password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button type='submit' variant='success' className='mt-4 w-100'>
                    Update
                  </Button>
                </Form>
              )}
            </div>
          </Col>
          <Col md={9} className='shadow-lg' style={{ height: '510px' }}>
  <h1>My Orders</h1>
  {loadingOrders ? (
    <Loader />
  ) : errorOrders ? (
    <Message variant='danger' onClick={handleClose}>{errorOrders}</Message>
  ) : (
    <Table striped bordered hover responsive className='table-sm'>
      <thead>
        <tr>
          <th>ID</th>
          <th>DATE</th>
          <th>TOTAL</th>
          <th>PAID</th>
          <th>DELIVERED</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orders?.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.createdAt?.substring(0, 10)}</td>
            <td>Rs{order.totalPrice}</td>
            <td>
              {order.isPaid ? (
                order.paidAt?.substring(0, 10)
              ) : (
                <i className='fas fa-times' style={{ color: 'red' }}></i>
              )}
            </td>
            <td>
              {order.isDelivered ? (
                order.deliveredAt?.substring(0, 10)
              ) : (
                <i className='fas fa-times' style={{ color: 'red' }}></i>
              )}
            </td>
            <td>
              <LinkContainer to={`/order/${order.id}`}>
                <Button variant='info' className='btn-sm'>
                  Details
                </Button>
              </LinkContainer>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
</Col>



        </Row>
      </Container>
    </>
  )
}

export default ProfileScreen