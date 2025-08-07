import React, { useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Container } from 'react-bootstrap';
// import Loader from '../Loader';
// import Message from '../Message';
import { addToCart, removeFromCart } from '../../actions/cartAction';
import { useDispatch, useSelector } from 'react-redux'


function CartScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const productId = id;
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart;


    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkOutHandler = () => {
        navigate('/checkout')
    }
    return (
        <>
            <Row>
                <Col md={8} className='mt-3'>
                    <Container>
                        <h1>Cart Item</h1>

                        {cartItems.length === 0 ? (
                            <p>Your Cart is Empty<Link to='/' className='btn btn-dark my-2 m-3'>Go Back
                            </Link></p>
                        ) : (
                            <ListGroup variant='flush'>
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item.product}>
                                        <Row className="d-flex align-items-center my-2">
                                            <Col md={3} className='shadow-lg'>
                                                <Image className='shadow-lg' src={item.image} alt={item.name} fluid rounded />
                                            </Col>

                                            <Col md={2}>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>

                                            <Col md={2}>
                                                <p className="mb-0">Rs: {item.price}</p>
                                            </Col>

                                            <Col md={2}>
                                                <span className="badge text-bg-secondary">Qty: {item.qty}</span>
                                            </Col>

                                            <Col md={2}>
                                                <Button
                                                    type="button"
                                                    variant="light"
                                                    onClick={() => removeFromCartHandler(item.product)}
                                                >
                                                    <i className="fas fa-trash mt-2"></i>
                                                </Button>
                                            </Col>
                                        </Row>


                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}








                    </Container>
                </Col>
                <Col md={4}>
                    <Card className="mt-3 cartPrice shadow-lg" style={{ height: '250px' }}>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="mt-4">
                                <h4>Total Qty: ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h4>
                                <hr style={{ borderTop: '2px solid #000' }} />
                                <strong>Rs: {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</strong>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block btn-success mt-3 mx-4'
                                    disabled={cartItems.length === 0}
                                    onClick={checkOutHandler}
                                >
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>


                    </Card>
                </Col>

            </Row>

        </>
    )
}

export default CartScreen