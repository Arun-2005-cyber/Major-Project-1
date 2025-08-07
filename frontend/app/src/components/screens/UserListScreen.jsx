import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader';
import Message from '../Message';
import { LinkContainer } from 'react-router-bootstrap';
import { deleteUser, listUsers } from '../../actions/userAction.';

function UserListScreen() {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList)
  const { error, loading, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  const userDelete = useSelector((state) => state.userDelete)
  // eslint-disable-next-line no-unused-vars
  const { success: successDelete } = userDelete


  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      navigate('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo,])

  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);

  };
  if (!visible) return null;


  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user ?")) {
      dispatch(deleteUser(id))
      dispatch(listUsers())
    }
  }

  return (
    <>
      <h1>Users</h1>
      {loading
        ? (<Loader />)
        : error
          ? (<Message variant='danger' onClick={handleClose}>{error}</Message>)
          : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th></th>
                </tr>
              </thead>


              <tbody>
                {users?.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin?(

                   <i className='fas fa-check' style={{color:'green'}}></i>
                    ) : (
                      <i className='fa-sharp fa-regular fa-circle-xmark' style={{ color: 'red' }}></i>
                    )}</td>

                    <td>
                      <LinkContainer to={`/admin/user/${user.id}/edit`}>
                        <Button variant='light' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>

                      <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(user.id)}>
                        <i className='fas fa-trash'></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>
          )}

    </>
  )
}

export default UserListScreen