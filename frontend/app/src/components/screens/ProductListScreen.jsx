/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader'
import Message from '../Message'
import { createProduct, deleteProduct, listProducts } from '../../actions/ProductAction'
import { PRODUCT_CREATE_RESET } from '../../constants/ProductConstant'
import { useNavigate } from 'react-router-dom'

function ProductListScreen() {
    const dispatch = useDispatch()
    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDelete = useSelector(state => state.productDelete)
    // eslint-disable-next-line no-unused-vars
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    // eslint-disable-next-line no-unused-vars
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate
    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })

        if (!userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct.id}/edit`)
        }
        dispatch(listProducts())
    }, [userInfo, dispatch, successDelete, successCreate])

    const createProductHandler = () => {
        dispatch(createProduct())
    }

const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;


    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete the Product')) {
            dispatch(deleteProduct(id))
        }
    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>

                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i>  Create Produt
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorCreate && <Message variant='danger' onClick={handleClose}>{errorCreate}</Message>}

            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <div>
                            <Table striped bordered hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>BRAND</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>

                                            <td>
                                                <LinkContainer to={`/admin/product/${product.id}/edit`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                </LinkContainer>

                                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product.id)}>
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )
            }
        </>
    )
}

export default ProductListScreen