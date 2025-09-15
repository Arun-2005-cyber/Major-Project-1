import { CART_CLEAR_ITEMS } from "../constants/CartConstant";
import {
    USER_SIGNUP_FAIL, USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, USER_LOGIN_REQUEST, USER_LOGOUT,

    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,

    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
 

    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,


    USER_DETAIL_REQUEST,
    USER_DETAIL_SUCCESS,
    USER_DETAIL_FAIL,



    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_RESET,
    USER_UPDATE_PROFILE_FAIL
} from "../constants/userConstant";
import API from "../api/axios";


export const signup = (fname, lname, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_SIGNUP_REQUEST
        });

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        }

        const { data } = await API.post("/api/users/register/", {
            fname: fname,
            lname: lname,
            email: email,
            password: password,
        }, config);

        dispatch({
            type: USER_SIGNUP_SUCCESS,
            payload: data
        })
    }

    catch (error) {
        dispatch({
            type: USER_SIGNUP_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}


export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        });

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        }

        const { data } = await API.post("/api/users/login/", {

            username: email,
            password: password,
        }, config);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        dispatch({ type: CART_CLEAR_ITEMS });
        localStorage.setItem("userInfo", JSON.stringify(data))
    }

    catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}


export const logout = () => (dispatch) => {

    localStorage.removeItem('userinfo')
    localStorage.removeItem('cartItems');
    dispatch({ type: USER_LOGOUT })
    dispatch({ type: CART_CLEAR_ITEMS });

}



export const listUsers = () => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST
        });

         const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
            }
        }

        const { data } = await API.get(`/api/users/getallusers/`,config)

        

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })
        
    }

    catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}



export const deleteUser = (id) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
        });

         const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
            }
        }

        const { data } = await API.delete(`/api/users/delete/${id}/`,config)

        

        dispatch({
            type: USER_DELETE_SUCCESS,
            payload: data
        })
        
    }

    catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}



export const updateUser = (user) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
        });

         const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
            }
        }

        const { data } = await API.put(`/api/users/update/${user.id}/`,user,config)

        

        dispatch({
            type: USER_UPDATE_SUCCESS,
            
        })

        dispatch({
            type:USER_DETAIL_SUCCESS,
            payload:data
        })
        
    }

    catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}


export const getUserDetails = (id) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_DETAIL_REQUEST
        });

         const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
            }
        }

        const { data } = await API.get(`/api/users/${id}/`,config)

        

        dispatch({
            type: USER_DETAIL_SUCCESS,
            payload: data
        })
        
    }

    catch (error) {
        dispatch({
            type: USER_DETAIL_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}



export const updateUserProfile = (user) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        });

         const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
            }
        }

        const { data } = await API.put(`/api/users/profile/update/`,user,config)

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })
        
        dispatch({
            type:USER_UPDATE_PROFILE_RESET,
            payload:data
        })
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo',JSON.stringify(data))
    }  
    

    catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message || 'Something went wrong',
        })
    }
}