import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom'
import { Row, Col, Button, ListGroup, Image, ListGroupItem, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetail } from '../../actions/ProductAction';
import '../screens/ProductDetailScreen.css'
import Loader from '../Loader';
import Message from '../Message';

// import axios from 'axios'


function ProductDetailScreen({ params }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const productDetail = useSelector((state) => state.productDetail)
    const { error, loading, product } = productDetail

    const navigate = useNavigate();
    // const location = useLocation();
    const [qty, setQty] = useState(1)


    useEffect(() => {
        dispatch(listProductDetail(id))
    }, [dispatch, id])

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }
    const [visible, setVisible] = useState(true);
    const handleClose = () => {
        setVisible(false);

    };
    if (!visible) return null;

    return (
        <>
            <div>
                <Link to='/' className='btn btn-dark my-2'>Go Back
                </Link>

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger' onClick={handleClose} >{error || "Product not found"}</Message>

                ) : (
                    <Row>
                        <Col md={6} className='shadow-lg'>
                            <Image className='shadow-lg' src={product.image} alt={product.name} fluid></Image>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroupItem><h3>{product.name}</h3></ListGroupItem>
                                <ListGroupItem><h5>{product.rating} from {product.numReviews} reviews</h5></ListGroupItem>
                                <ListGroupItem><p>{product.description}</p></ListGroupItem>
                                <ListGroupItem><h4>Rs: {product.price}</h4></ListGroupItem>
                            </ListGroup>


                        </Col>
                        <Col md={3} className='shadow-lg' style={{ height: '280px' }}>
                            <ListGroupItem>
                                <Row>
                                    <Col><p>Availability : {product.countInStock > 0 ? "In Stock" : "Out of Stock"}</p></Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col><p>Brand : {product.brand}</p></Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col><p>Category : {product.category}</p></Col>
                                </Row>
                            </ListGroupItem>
                            {product && product.countInStock && product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <p>Qty</p>
                                        </Col>
                                        <Col xs="auto" className="my-1">
                                            <Form.Control
                                                className="custom-select"
                                                as="select"
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                            >
                                                {[...Array(product.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button className='btn-block btn-success ' disabled={product.countInStock === 0} type='button' onClick={addToCartHandler}>Add to Cart</Button>
                            </ListGroup.Item>




                        </Col>
                    </Row>
                )}

            </div>
        </>
    )
}

export default ProductDetailScreen