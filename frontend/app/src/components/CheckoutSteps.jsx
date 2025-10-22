import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {
                    step1 ? (
                        <LinkContainer to="/login">
                            <Nav.Link><Button className='btn-sm'>Login</Button></Nav.Link>
                        </LinkContainer>
                    ) : (
                        <Nav.Link disabled><Button className='btn-sm'>Login</Button></Nav.Link>
                    )
                }
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to="/checkout">
                        <Nav.Link><Button className='btn-sm'>Checkout</Button></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled><Button className='btn-sm'>Checkout</Button></Nav.Link>
                )

                }
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                    <LinkContainer to="/payment">
                        <Nav.Link><Button className='btn-sm'>Payment</Button></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled><Button className='btn-sm'>Payment</Button></Nav.Link>
                )

                }
            </Nav.Item>

            <Nav.Item>
                {step4 ? (
                    <LinkContainer to="/placeorder">
                        <Nav.Link><Button className='btn-sm'>Place Order</Button></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled><Button className='btn-sm'>Place Order</Button></Nav.Link>
                )

                }
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps