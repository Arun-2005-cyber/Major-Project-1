import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'
import ProductScreen from './screens/ProductScreen';
// import axios from 'axios'
import { listProducts } from '../actions/ProductAction';
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader';
import Message from './Message';




export default function Home() {
  const dispatch = useDispatch()
  const productsList = useSelector((state) => state.productsList)
  const { error, loading, products } = productsList



  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;

  return (
    <>
      <div>
        <h1 className="text-center mt-2">Latest Products</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger' onClick={handleClose}>{error}</Message>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4} xl={4}>
                <ProductScreen product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
