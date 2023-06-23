import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Login = (props) => {

    const [credentials, setCredentials] = useState({email: "", password: ""})
    let history = useNavigate(); 

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
      
          const json = await response.json();
          console.log(json)
          if(json.success){
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged In Successfully", "success");
            history("/");
          }
          else {
            props.showAlert("Login Error", "danger")
          }
    }

    const onChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }



  return (
    <div>
        <form className='m-3 p-3' onSubmit={handleSubmit}>
            <div className="mb-3 mx-3 p-3">
                 <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" className="form-control p-3" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} value={credentials.email}/>
             </div>
             <div className="mb-3 mx-3 p-3">
                   <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control p-3" id="password" name="password" onChange={onChange} value={credentials.password}/>
            </div>
            <div className="container mx-3 p-3"> 
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
  )
}

export default Login
