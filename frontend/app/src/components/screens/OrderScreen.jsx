import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Message'
import Loader from '../Loader'
import { deliverOrder, getOrderDetails } from '../../actions/OrderAction'



function OrderScreen() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { loading, error, order } = orderDetails

    const orderDeliver = useSelector(state => state.orderDeliver)
    // eslint-disable-next-line no-unused-vars
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    if (!loading && !error) {
        order.itemPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        else {
            dispatch(getOrderDetails(id))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, dispatch])

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger' onClick={handleClose}>{error}</Message>
    ) : (
        <div>
            <h1>Order ID : {id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name : </strong>{order.user.first_name}</p>
                            <p><strong>Email : </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p><strong>Shipping : </strong>
                                {order.shippingAddress.address},{order.shippingAddress.city}
                                {' '}
                                {order.shippingAddress.postalCode},
                                {' '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success' onClick={handleClose} >Delivered on {order.deliverAt}</Message>
                            ) : (
                                <Message variant='warning' onClick={handleClose}  >Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method : </strong>
                                {order.paymentMethod}
                            </p>

                            {order.isPaid ? (
                                <Message variant='success' onClick={handleClose} >Paid On</Message>
                            ) : (
                                <Message variant='warning' onClick={handleClose} >Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message variant='info' onClick={handleClose} >Order is Empty</Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row className="d-flex align-items-center my-2">
                                                <Col md={2} className='shadow-lg'>
                                                    <Image src={item.image} alt={item.name}
                                                        fluid
                                                        className='shadow-lg'
                                                        rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/ Rs {item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>

                                                <Col md={4} className='shadow-lg' style={{ height: '50px' }}>
                                                    {item.qty} X Rs{item.price}=Rs{(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card className='shadow-lg'>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items : </Col>
                                    <Col>Rs{order.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping : </Col>
                                    <Col>Rs{order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax : </Col>
                                    <Col>Rs{order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                            <ListGroup.Item>
                                <Row>
                                    <Col>Total Price : </Col>
                                    <Col>Rs{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>

                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen