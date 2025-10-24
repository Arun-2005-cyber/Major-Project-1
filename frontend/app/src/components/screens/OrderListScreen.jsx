import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader';
import Message from '../Message';
import { listOrders } from '../../actions/OrderAction';
import { LinkContainer } from 'react-router-bootstrap';

function OrderListScreen() {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList)
  const { error, loading, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      navigate('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo])

  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;

  return (
    <>
      <div>
        <h1>Orders</h1>
        {loading
          ? (<Loader />)
          : error
            ? (<Message variant='danger' onClick={handleClose}>{error}</Message>)
            : (
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user && order.user.username}</td>
                      <td>{order.createdAt ? order.createdAt.substring(0, 10) : '—'}</td>
                      <td>Rs{order.totalPrice}</td>

                      <td>{order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className='fa-sharp fa-regular fa-circle-xmark' style={{ color: 'red' }}></i>
                      )}</td>

                      <td>{order.isDeliverd ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i className='fa-sharp fa-regular fa-circle-xmark' style={{ color: 'red' }}></i>
                      )}</td>



                      <td>
                        <LinkContainer to={`/order/${order.id}`}>
                          <Button variant='info' className='btn-sm'>
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
      </div>

    </>
  )
}

export default OrderListScreen