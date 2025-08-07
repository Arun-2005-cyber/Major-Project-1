import React, { useEffect, useState } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../CheckoutSteps';
import Message from '../Message';
import { createOrder } from '../../actions/OrderAction';
import { ORDER_CREATE_RESET } from '../../constants/OrderConstant';



function PlaceOrderScreen() {
  const navigate = useNavigate()
  const orderCreate = useSelector(state => state.orderCreate)
  const { order, error, success } = orderCreate

  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart)

  cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  cart.shippingPrice = (cart.itemsPrice > 10000 ? 0 : 100).toFixed(2)
  cart.taxPrice = Number((0.1) * cart.itemsPrice).toFixed(2)
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);


  // if (!cart.paymentMethod) {
  //   navigate('/payment')
  // }

  useEffect(() => {
    if (success) {
      navigate(`/order/${order.id}`)
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, success, order])

  const placeOrder = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    }))
  }
  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;

  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3 step4 />

        <Row>
          {/* LEFT: Order Details */}
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Shipping : </strong>
                  {cart.shippingAddress.address},{cart.shippingAddress.city}{' '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method : </strong>
                  Cash on Delivery
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                  <Message variant="info" onClick={handleClose}>Your Cart is Empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row className="d-flex align-items-center my-2">
                          <Col md={2} className='shadow-lg'>
                            <Image src={item.image} alt={item.name} fluid rounded className='shadow-lg' />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col className='text-center shadow-lg' style={{ height: '50px' }}>
                            {item.qty} x {item.price} = {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* RIGHT: Order Summary */}
          <Col md={4} className='shadow-lg' style={{ height: '350px' }}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Items :</Col>
                    <Col>Rs : {cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping :</Col>
                    <Col>Rs : {cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax :</Col>
                    <Col>Rs : {cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total :</Col>
                    <Col>Rs : {cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  {error && <Message variant="danger" onClick={handleClose}>{error}</Message>}
                </ListGroup.Item>

                <ListGroup.Item>
                  <Button
                    type='button'
                    variant='success'
                    className='btn-block w-100'
                    disabled={cart.cartItems.length === 0}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default PlaceOrderScreen