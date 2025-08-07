/* eslint-disable no-unused-vars */
import { createStore, combineReducers, applyMiddleware } from 'redux'
import  thunk  from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productCreateReducers, productDetailReducer, productListReducers, productUpdateReducers } from './reducers/ProductReducers';
import { userDeleteReducers, userDetailsReducers, userListReducers, userLoginReducers, userSignupReducers, userUpdateProfileReducers, userUpdateReducers } from './reducers/userReducers';
import { cartReducers } from './reducers/cartReducers';
import { orderCreateReducer, orderDeliverReducers, orderDetailsReducers, orderListMyReducers, orderListReducers } from './reducers/OrderReducers';
import { getUserDetails } from './actions/userAction.';

const reducer = combineReducers({
    productsList: productListReducers,
    productDetail: productDetailReducer,
    userSignup:userSignupReducers,
    userLogin:userLoginReducers,
    cart:cartReducers,
    orderCreate:orderCreateReducer,
    orderDetails:orderDetailsReducers,
    orderDeliver:orderDeliverReducers,

    //ADMIN                   
    productCreate:productCreateReducers,
    productUpdate:productUpdateReducers,
    productDelete:productDetailReducer,
    orderList:orderListReducers,
    userList:userListReducers,
    userDelete:userDeleteReducers,
    userUpdate:userUpdateReducers,
    userDetails:userDetailsReducers,
    userUpdateProfile:userUpdateProfileReducers,
    orderMyList:orderListMyReducers
})
const userInfoFromLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;



const shippingAddressFromStorage=localStorage.getItem("shippingAddress")?
JSON.parse(localStorage.getItem("shippingAddress")):{}


const cartItemsFromStorage=localStorage.getItem('cartItems')?
JSON.parse(localStorage.getItem('cartItems')):[]

const initialState = {
    cart:{cartItems:cartItemsFromStorage,shippingAddress:shippingAddressFromStorage},
    userLogin:{userInfo:userInfoFromLocalStorage},
}
const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;