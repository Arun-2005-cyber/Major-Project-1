/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Form, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader'
import Message from '../Message'
import { listProductDetail, updateProduct } from '../../actions/ProductAction'
import { useNavigate, useParams, Link } from 'react-router-dom'
import FormContainer from '../FormContainer';
import axios from 'axios'

function ProductEditScreen() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false)

  const productDetails = useSelector((state) => state.productDetail)
  const { error, loading, product } = productDetails

  const productUpdate = useSelector(state => state.productUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      navigate('/admin/productlist')
    }
    else {
      if (!product.name || product.id !== Number(id)) {
        dispatch(listProductDetail(id))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }

    }
  }, [dispatch, product, id, successUpdate])

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('image', file)
    formData.append('product_id', id)

    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`,
        }
      }
      console.log(product.image);

      const { data } = await axios.post('/api/products/upload/', formData, config)
      setImage(data)  // or `data.image` based on your Django response
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }



  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateProduct({
      id: id,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description
    }))
  }


  return (
    <>
      <Link to='/admin/productlist'>
        <Button>
          Go Back
        </Button>
      </Link>

      <FormContainer />
      <Container>
        <Row>
          <Col md={3}></Col>

          <Col md={6}>
            <h1 className='text-center'>edit product</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate &&  <Message variant='danger' onClick={handleClose}>{errorUpdate}</Message>}

            {loading ? <Loader /> : error ? <Message variant='danger' onClick={handleClose}>{error}</Message>
              : (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='price' className='mt-3'>
                    <Form.Label>Pice</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Price'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='image' className='mt-3'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Upload Image'
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Control
                    className='mt-2'
                    type='file'
                    id='image-file'
                    label='Choose File'
                    custom
                    onChange={uploadFileHandler}
                  >

                  </Form.Control>
                  {uploading && <Loader />}

                  <Form.Group controlId='brand' className='mt-3'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Brand'
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='category' className='mt-3'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Brand'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='countInStock' className='mt-3'>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder='Enter Count In Stock'
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    ></Form.Control>
                  </Form.Group>


                  <Form.Group controlId='description' className='mt-3'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Button type='submit' variant='success' className='btn-block w-100 mt-4'>
                    Update
                  </Button>
                </Form>
              )
            }
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </>

  )
}

export default ProductEditScreen