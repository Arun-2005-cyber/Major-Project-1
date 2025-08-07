import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../..//actions/cartAction'
import FormContainer from '../FormContainer'
import CheckoutSteps from '../CheckoutSteps'


function ShippingScreen() {
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart)
  const { shippingAddress } = cart

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const submitHandler = (e) => {
    e.preventDefault()
    navigate('/payment')
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ address, city, postalCode, country })

    )
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>

      <hr />

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter your Address'
            value={address ? address : ''}
            onChange={(e) => setAddress(e.target.value)}
          >
          </Form.Control>
        </Form.Group>


        <Form.Group controlId='city' className='mt-3'>
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter your City'
            value={city ? city : ''}
            onChange={(e) => setCity(e.target.value)}
          >
          </Form.Control>
        </Form.Group>


        <Form.Group controlId='postalCode' className='mt-3'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter your Postal Code'
            value={postalCode ? postalCode : ''}
            onChange={(e) => setPostalCode(e.target.value)}
          >
          </Form.Control>
        </Form.Group>


        <Form.Group controlId='country' className='mt-3'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter your Country'
            value={country ? country : ''}
            onChange={(e) => setCountry(e.target.value)}
          >
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='success' className='w-100 mt-3'>Countinue</Button>
      </Form>






    </FormContainer>
  )
}

export default ShippingScreen