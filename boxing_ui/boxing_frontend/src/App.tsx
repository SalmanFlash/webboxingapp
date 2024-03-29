import './App.css';
import { useEffect, useState } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Protected from './auxiliaries/Protected';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface Customer {
  name: string
  email: string,
  password: string
  }

export interface AuthConfig {
  Authorization: string
}  
export interface CustomerResponse {
  id: string,
  name: string, 
  email: string,
  password: string
}
export interface LoginRequest{
  email: string,
  password: string
}
export interface ForgotPasswordEmail {
  email: String
}
function App() {
  

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loggedIn, setIsLoggedIn] = useState<Boolean>(false);
  const [token, setToken] = useState<string>("");

  /*useEffect(
    () => {
      const current_token = localStorage.getItem("token");
      console.log(current_token);
      
    }, []

  )
  */
 


  const addUser = async(customer: Customer) => {
     axios.post("http://localhost:8080/api/auth/register", customer).then((response) => {
      if(response.data.error === "Authorization Error") {
        console.log(response.data.message);
        toast.error("Email already taken", {
          position: "top-center"
        })
       

      }
      else if(response.data.error === "Authentication Error") {
        console.log(response.data.message);
        toast.warning("Already logged in", {
          position: "top-center"
        })
        
      }

      
      else {
        console.log(response.data);
        const data = response.data;
        setCustomers([...customers, data]);
       
       
        toast.success("User added succesfully", {
          position: "top-center"
        })
        window.location.replace("/")
      
        
      }
      

     

     }
     
     ).catch((err) => {
      console.log(err)
     })
  }
  const loginUser = async(loginRequest: LoginRequest)  => {
   
    
    axios.post("http://localhost:8080/api/auth/login", loginRequest).then((response) => {
      if(response.data.error === "Authorization Error") {
        console.log(response.data.message);
        toast.error("Incorrect Credentials", {
          position: "top-center"
        })
       

      }
      else if(response.data.error === "Authentication Error") {
        console.log(response.data.message);
        toast.warning("Already logged in", {
          position: "top-center"
        })
        
      }
      else {
        console.log(response.data);
        const data = response.data;
        setToken(data.accessToken);
        console.log(token)
        localStorage.setItem('token', response.data.accessToken);
        setIsLoggedIn(true);
        window.location.replace("/home");
       
        toast.success("Logged in succesfully", {
          position: "top-center"
        })
      }
  
     }
     
     ).catch((err) => {
      console.log(err)
     })

  }

  //Logout Functionality

  const logout = async() => {
    const getToken = localStorage.getItem('token');
    console.log(getToken)
    if(getToken === "null") {
      toast.error("Email or password incorrect", {
        position: "top-center"
      })
    }
    else {
      //const combinedToken = "Bearer " + getToken;
      //const headers: AuthConfig = {Authorization : combinedToken}
      axios.post("http://localhost:8080/api/auth/logout", null , {
        headers: {
         
          authorization: `Bearer ${getToken}`,
          
        }
      }).then((response) => {
        if(response.data === "Logged out successfully") {
          localStorage.setItem("token", "null");
          window.location.replace("/");
          
        }
        else if(response.status === 401) {
          toast.error("Invalid request", {position: "top-center"})
        } 
      })
    }
  }

  const forgotPassword = async(forgotPasswordEmail: ForgotPasswordEmail) => {
    axios.patch("http://localhost:8080/api/auth/forgot-password", forgotPasswordEmail).then((response) => {
      if(response.data.error === "Authorization Error") {
        toast.error(response.data.message,  {
          position: "top-center" 
      }) 
    }
      else {
        toast.success("Email sent to your address", {
          position: "top-center"
        })
      }
         
        
      
   
  })

  }


  
  return (
    <BrowserRouter>
    <div className='App'>
    <Routes>
     
      <Route path='/home' element={<HomePage logoutUser={logout}/>}></Route>
      <Route path='/' element={<LoginPage loginUser={loginUser}/>}></Route>
      <Route path='/register' element={<RegisterPage addUser={addUser}/>}></Route> 
      <Route path="/forgot-password" element={<ForgotPassword forgotPassword={forgotPassword} />}></Route>
      
    </Routes>
    <ToastContainer/>
    </div>
    </BrowserRouter>
  );
}

export default App;
