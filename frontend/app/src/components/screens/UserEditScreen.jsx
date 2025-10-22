import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getUserDetails, updateUser } from '../../actions/userAction.'
import { USER_UPDATE_RESET } from '../../constants/userConstant'
import Message from '../Message'
import Loader from '../Loader'

function UserEditScreen() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const userDetails = useSelector((state) => state.userDetails)
    // eslint-disable-next-line no-unused-vars
    const { error, loading, user } = userDetails   // use `user`, not `users`

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userUpdate = useSelector((state) => state.userUpdate)
    const {
        error: errorUpdate,
        loading: loadingUpdate,
        success: successUpdate
    } = userUpdate

    useEffect(() => {
  if (!userInfo || !userInfo.isAdmin) {
    navigate('/login')
  }

  if (successUpdate) {
    dispatch({ type: USER_UPDATE_RESET })
    navigate('/admin/userlist')
  } else {
    if (!user || String(user.id) !== String(id)) {
      dispatch(getUserDetails(id))
    } else {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }
}, [dispatch, navigate, userInfo, user, id, successUpdate])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ id: id, name, email, isAdmin }))
    }
    const [visible, setVisible] = useState(true);
    const handleClose = () => {
        setVisible(false);

    };
    if (!visible) return null;

    

    return (
        <>
            <Link to='/admin/userlist'>
                <Button>Go Back</Button>
            </Link>

            <Container>
                <Row>
                    <Col md={3} ></Col>
                    <Col md={6} className='shadow-lg' style={{ height: '370px' }}>
                        <div>
                            <h1>Edit User</h1>
                            {loadingUpdate && <Loader />}
                            {errorUpdate && <Message variant='danger' onClick={handleClose}>{errorUpdate}</Message>}
                            {loading ? (
                                <Loader />
                            ) : errorUpdate ? (
                                <Message variant='danger' onClick={handleClose}>{errorUpdate}</Message>
                            ) : (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group controlId='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='email' className='mt-3'>
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type='email'
                                            placeholder='Enter email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='isadmin' className='mt-3'>
                                        <Form.Check
                                            type='checkbox'
                                            label='Is Admin'
                                            checked={isAdmin}
                                            onChange={(e) => setIsAdmin(e.target.checked)}
                                        ></Form.Check>
                                    </Form.Group>

                                    <Button type='submit' variant='success' className='mt-4 w-100'>
                                        Update
                                    </Button>
                                </Form>
                            )}
                        </div>
                    </Col>
                    <Col md={3}></Col>
                </Row>
            </Container>
        </>


    )
}

export default UserEditScreen
