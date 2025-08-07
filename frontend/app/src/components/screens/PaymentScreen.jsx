import React, {  useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import CheckoutSteps from '../CheckoutSteps';
import FormContainer from '../FormContainer';
import { useNavigate} from 'react-router-dom'

function PaymentScreen() {
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/checkout');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault()
        navigate('/placeorder');
    }

    return (
        <div>
            <FormContainer>
                <CheckoutSteps step1 step2 step3 step4 />
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as='legend'>Select Method</Form.Label>

                        <Col className='mt-3'>
                            <Form.Check
                                type='radio'
                                label='Cash on Delivery'
                                checked
                            >

                            </Form.Check>
                        </Col>
                    </Form.Group>
                    <Button className='mt-3' type='submit' variant='success'>
                        Continue
                    </Button>
                </Form>

            </FormContainer>
        </div>
    )
}

export default PaymentScreen