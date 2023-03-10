import React, { useReducer, useContext } from 'react'

import reducer from './reducer'

import axios from  "axios"

import getStripe from './Stripe'



import {
  

  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  UPLOAD_IMAGE,
  GET_FEATURED,
   getSingleProperty,
   GET_ALL_PROPERTY,
   GET_ALL_PROPERTY_WITH_OUT_FILTERS,
   CLEAR_FILTERS,
   HANDLE_CHANGE,
   HANDLE_CHECK,
   CREATE_ORDER,
   CREATE_ORDER_ERROR,
   GET_CURRENT_USER_ORDERS,
   NEWS_LETTER_ERROR,
   NEWS_LETTER_SUCCESS,
   UPDATE_PASSSOWRD_ERROR,
   UPDATE_PASSSOWRD_SUCCESS,
   UPLOAD_IMAGE_USER,
   GET_STRIPE,
   SUCCESS_OR_FAILURE_ACTIONS,
   FORGET_PASSWORD_ERROR,
   FORGET_PASSWORD_SUCCESS,
   RESET_PASSWORD_ERROR,
   RESET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_BEGIN,

  STRIP_LOADING_BEGIN,
  STRIP_LOADING_END
} from './actions'


const initialState = {
     
    //  For the api
    userLoading: true,
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: null,
    userLocation: '',
    Image:"",
    featured:[],
    Property:{},

    search:"",
    category:"",
    company:"",
    color:"",
    freeShipping:false,
    sort:"",
    price:3099,

    Properties:[],
    PropertiesWithoutFilters:[],
    UserOrders:[],

    userImage:""
}


const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // For the api

  const authFetch = axios.create({
    baseURL: '/api/v1',
  });
  // request

  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );


  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/auth/${endPoint}`,
        currentUser,
        { withCredentials: true }
      );

      const { user, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
 
  const logoutUser = async () => {
    await axios.get('http://localhost:5000/api/v1/auth/logout',{ withCredentials: true });
    dispatch({ type: LOGOUT_USER });
  };


  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await axios.patch('http://localhost:5000/api/v1/auth/updateUser', currentUser,{ withCredentials: true });
      const { user, location } = data;


      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };


  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/auth/getCurrentUser',  { withCredentials: true });
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      // if (error.response.status === 401) return;
      // logoutUser();
    }
  };
  
  
  // Imgage Upload
  const uploadImage=async (event)=>{
    const imageFile = event.target.files[0];
    const formData = new FormData();
    formData.append('image',imageFile)
    console.log(event.target.files[0])
    try {
     const {data:{image:{src}}} = await axios.post("http://localhost:5000/api/v1/property/Image" ,formData,{
      headers:{
       'Content-Type':'multipart/form-data'
      }
    }
    )
    dispatch({type:UPLOAD_IMAGE,
      payload:{
        image:src
      }
    })
    
  } catch (error) {
    console.log(error.response.data.msg);
  }
}
  const uploadImageUser=async (event)=>{
    const imageFile = event.target.files[0];
    const formData = new FormData();
    formData.append('image',imageFile)
    console.log(event.target.files[0])
    try {
     const {data:{image:{src}}} = await axios.post("http://localhost:5000/api/v1/auth/uploadImage" ,formData,{
      headers:{
       'Content-Type':'multipart/form-data'
      }
    }
    )
    dispatch({type:UPLOAD_IMAGE_USER,
      payload:{
        image:src
      }
    })
    
  } catch (error) {
    console.log(error.response.data.msg);
  }

  // try {
  //   let {data}=await axios.post("http://localhost:5000/api/v1/auth/updateImage",{image:state.userImage},{withCredentials:true})
    
  // } catch (error) {
  //   console.log(error.response.data.msg)
  // }
  // getCurrentUser();
}


const FEATURED= async ()=>{
  
  try {
    let {data}=await axios.get("http://localhost:5000/api/v1/property/featured")
    dispatch({type:GET_FEATURED,payload:{data:data.featured}})
  } catch (error) {
    console.log(error)
  }
}


const single=async (id)=>{
  try {
      let {data}=await axios.get(`http://localhost:5000/api/v1/property/${id}`)
      dispatch({type:getSingleProperty,payload:{data:Property}})
    } catch (error) {
      console.log(error)
    }
  }
  
  
  const getFilteredProperty=async ()=>{
    try {
      let {search,company,category,freeShipping,sort,price,color}=state
      let {data}=await axios.get(`http://localhost:5000/api/v1/property?search=${search}&company=${company}&freeShipping=${freeShipping}&category=${category}&sort=${sort}&price=${price}&color=${color}`)
      dispatch({type:GET_ALL_PROPERTY,payload:{data:data.Properties}})
      
    } catch (error) {
      console.log(error) 
    }
  }
  
  
  const WithoutFiltersPropertiesHandler=async ()=>{
    try {
      let {data}=await axios.get("http://localhost:5000/api/v1/property/allProperties")
      dispatch({type:GET_ALL_PROPERTY_WITH_OUT_FILTERS,payload:{data:data.PropertiesAll}})      
    } catch (error) {
      console.log(error)
    }
  }
  
  function clear(){
    dispatch({type:CLEAR_FILTERS})
  }
  
  
  function handleChange(name,value){
    dispatch({type:HANDLE_CHANGE,payload:{name:name,value:value}})
  }
  
  function handleCheck(name,checked){
    dispatch({type:HANDLE_CHECK,payload:{name:name,value:checked}})
  }
  
  
  const UOrders=async ()=>{
    try {
      let {data}=await axios.get("http://localhost:5000/api/v1/Orders", { withCredentials: true })
      dispatch({type:GET_CURRENT_USER_ORDERS,payload:{data:data.AllOrders}})
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }

  const createOrder=async ({quantity,color,product})=>{
    try {
      let {data}=await axios.post("http://localhost:5000/api/v1/Orders",{quantity,product,color}, { withCredentials: true })
      dispatch({type:CREATE_ORDER})
    } catch (error) {
      console.log(error.response)
      dispatch({type:CREATE_ORDER_ERROR,payload:{data:error.response.data.msg}})      
    }
    clearAlert()
    UOrders() 

  }
  
  
  
  const NewsLetter=async (email)=>{
    try {
      let {data}=await  axios.post("http://localhost:5000/api/v1/NewsLetter",{email:email})
      dispatch({type:NEWS_LETTER_SUCCESS,payload:{data:data.msg}})
    } catch (error) {
      dispatch({type:NEWS_LETTER_ERROR,payload:{data:error.response.data.msg}})
    }
    clearAlert()
  }
  
  const updatePassword=async ({password,confirmPassword})=>{
    try {
      let {data}=await  axios.post("http://localhost:5000/api/v1/auth/updatePassword",{password,confirmPassword},{withCredentials:true})
      dispatch({type:UPDATE_PASSSOWRD_SUCCESS,payload:{data:data.msg}})
    } catch (error) {
      dispatch({type:UPDATE_PASSSOWRD_ERROR,payload:{data:error.response.data.msg}})
    }
    clearAlert()
  }


  const stripe=async ()=>{
    try {
      dispatch({type:STRIP_LOADING_BEGIN})
      const stripe = await getStripe();
      const response=await axios.post("http://localhost:5000/api/v1/create-checkout-session",{cartItems:state.UserOrders})
      if(response.statusCode === 500) return;
      dispatch({type:STRIP_LOADING_END})
      stripe.redirectToCheckout({ sessionId:response.data.id });
    } catch (error) {
      console.log(error.response)
    }
  }

  const Google=async({user,location})=>{
    try {
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText:"Success Redirecting!" },
      });
    } catch (error) {
      console.log(error)
    }
    clearAlert()
  }


  const forgetPassword=async (email)=>{
     dispatch({type:FORGET_PASSWORD_BEGIN})
    try {
      let {data}=await axios.post("http://localhost:5000/api/v1/auth/forgetPassword",{email},{withCredentials:true})
      dispatch({type:FORGET_PASSWORD_SUCCESS,payload:{data:data.msg}})
    } catch (error) {
       dispatch({type:FORGET_PASSWORD_ERROR,payload:{data:error.response.data.msg}})
    }
    clearAlert()
  }


  const resetPasswordFun=async ({email,token,password})=>{
    try {
      let {data}=await axios.post("http://localhost:5000/api/v1/auth/resetPassword",{email,token,password})
      dispatch({type:RESET_PASSWORD_SUCCESS,payload:{data:data.msg}})
    } catch (error) {
       dispatch({type:RESET_PASSWORD_ERROR,payload:{data:error.response.data.msg}})
    }
    clearAlert()
  }






  React.useEffect(() => {
    getCurrentUser();
    UOrders()
  }, []);
  
  return (
    <AppContext.Provider
    value={{
      ...state,
      setupUser,
      logoutUser,
      updateUser,
      getCurrentUser,
      uploadImage,
      FEATURED,
      single,
      getFilteredProperty,
      WithoutFiltersPropertiesHandler,
      handleChange,
       handleCheck,
       clear,
       createOrder,
       UOrders,
       NewsLetter,
       updatePassword,
       uploadImageUser,
       stripe,
       Google,
       forgetPassword,
       resetPasswordFun
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
