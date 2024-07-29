import React, { useEffect, useState } from 'react'
import './signup.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
// import { baseUrl } from '../../service/apiService'
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import apiServiceHandler from '../../services/apiService';

const SignUp = () => {
    const navigate = useNavigate()
    const [signupData, setSignupData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        login_code: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSignupData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        let payload = signupData
        // payload.unique_url = uniqueUrlvalue
        try {
            // const response = await axios.post(signupUrl, signupData);
            const response = await apiServiceHandler("POST", "api/auth/signup", payload);
            console.log(response)
            if (response?.status === true) {
                localStorage.setItem('responseData', JSON.stringify(response));
                localStorage.setItem('secret', response?.userData?.secret_code)
                navigate(`/signin`)
            }

        } catch (e) {
            // navigate(`/otp-verify}`)
            // toastr.error("Please enter the following details")
            console.log(e?.message)
            toastr.error(e?.message)
            console.error(e)
        }
    }
    
    return (
        <div className="bg">
            <div className="bg-box">
                <div className="text-center mb-4">
                    <img alt=''/>
                </div>

                <div id="signupPage" className="signup-page shadow">
                    <div className="page-heading mb-3">
                        <div className="row align-items-center" >
                            <div className="col-md-8">
                                <p>Welcome to <strong>Task Manager</strong></p>
                            </div>
                            <div className="col-md-4">
                                <h4>Already have an Account?<br /><a href="" style={{ textDecoration: 'none' }} onClick={() => navigate("/signin")} >Sign in</a></h4>
                            </div>
                        </div>
                    </div>
                    <h1 className="mb-3">Sign up</h1>
                    <div className="signup-form1">
                        {(<form>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <input type="text" name="first_name" className="form-control" id="exampleFormControlInput1" value={signupData.first_name} onChange={handleChange} placeholder="First Name" />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <input name="last_name" className="form-control" id="exampleFormControlInput1" placeholder="Last Name" value={signupData.last_name} onChange={handleChange} />
                                </div>
                                <div className="col-md-12 mb-2">
                                    <input name="email" className="form-control" id="exampleFormControlInput1" placeholder="Email" value={signupData.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <input type="password" name="login_code" maxLength="4" className="form-control" title="Enter your login code" id="exampleFormControlInput1" placeholder="Login Code" value={signupData.login_code} onChange={handleChange} />
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="next-btn" onClick={handleSignup}>Submit</button>
                                </div>
                            </div>

                        </form>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
