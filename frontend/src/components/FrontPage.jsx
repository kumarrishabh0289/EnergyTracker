import React, { Component } from 'react'
// eslint-disable-next-line
import { Link } from 'react-router-dom'
// eslint-disable-next-line
import AuthenticationForApiService from './AuthenticationForApiService.js'
import axios from 'axios'
import GoogleLogin from 'react-google-login'
import { API_URL } from '../Constants'


class FrontPage extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)
     
    }

    componentDidMount() {

    }
    handleChange(event) {

        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
    }

    loginClicked(e) {
        e.preventDefault();
        
        AuthenticationForApiService
            .authenticate(this.state.username, this.state.password)
            .then((response) => {
                console.log("response",response)
                AuthenticationForApiService.registerSuccessfulLogin(this.state.username, response.data.jwt,response.data.name)
                sessionStorage.setItem("role", response.data.role)
                if(response.data.role === "student"){
                    this.props.history.push(`/studentdashboard`)
                }
                if(response.data.role === "teacher"){
                    this.props.history.push(`/teacherdashboard`)
                }
                else{
                    this.props.history.push(`/welcome/${sessionStorage.role}`)
                }
                
            }).catch(() => {
                // this.setState({ showSuccessMessage: false })
                // this.setState({ hasLoginFailed: true })
            })

    }

    responseGoogle = (res) => {
        console.log(res.profileObj);

        var data = {
            email: res.profileObj.email,
            fname: res.profileObj.familyName,
            lname: res.profileObj.givenName,
        }
        axios.post(`${API_URL}/user/google`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log("response : ", response.data);
                if (response.status === 200) {
                       AuthenticationForApiService.registerSuccessfulLogin(res.profileObj.email, response.data.jwt, response.data.name)
                    let data1 = {
                        email: response.data.username
                    }
                    axios.post(`${API_URL}/user/checkrole`, data1)
                    .then(response => {
                        console.log("Here : ",response);

                        if (response.status == 200){
                            console.log("Role Exists");
                            sessionStorage.setItem("role", response.data.role)
                            if (response.data.role === "student"){
                                this.props.history.push(`/studentdashboard`)
                            }
                            else if (response.data.role === "teacher"){
                                this.props.history.push(`/teacherdashboard`)
                            }
                            else{
                                this.props.history.push(`/welcome/${sessionStorage.role}`)
                            }

                            
                           
                        }   
                        else{
                            console.log("Role doesnot Exists");
                            sessionStorage.setItem("role", "")
                            this.props.history.push(`/signup`)
                            
                        }
                    
                    })
              
                   

                }
                else {
                    
                }
            })
            .catch(err => {
                console.log("err",err);
                // sessionStorage.setItem("googleEmail", res.profileObj.email)
                // sessionStorage.setItem("googleName", res.profileObj.name)
                

            });

    }


    render() {
        return (
            <div>
                <div className="container-fluid">
                    <br />
                    <br />
                    <div className="row" >
                        <div className="col-sm-1 col-md-1"></div>

                        <div className="col-sm-5 col-md-5" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=90)", borderRadius: '10px' }}>
                            <br/>
                            <h3>
                                Green Ninja Energy Tracker
                            </h3>
                            <br/>
                            <form>

                                <div className="row" >
                  
                    

                                    <div className="col-sm-6 col-md-6">

                                        <div className="form-group">
                                            <label htmlFor="where"><h5>User Name</h5></label>
                                            <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleChange} />

                                        </div>

                                    </div>
                                    <div className="col-sm-6 col-md-6">

                                        <div className="form-group">
                                            <label htmlFor="where"><h5>Password</h5></label>
                                            <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />

                                        </div>
                                    </div>

                                </div>



                                <div className="row" >

                                    <div className="col-sm-12 col-md-12">
                                        <div className="form-group">

                                           
                                            <button className="btn btn-success" onClick={this.loginClicked}>Login</button>
                                            <br />
                                            
                                        </div>
                                    </div>

                                    <div class="col-sm-12 col-md-12">
                                    <div class="form-group">

                                        <GoogleLogin
                                            clientId="624602059574-qsv45kcgn89v376114ql2ps2t5rljfd7.apps.googleusercontent.com"
                                            buttonText="Login"
                                            onSuccess={this.responseGoogle}
                                            onFailure={this.responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        >
                                            
                                            <span> Login with Google</span>
                                        </GoogleLogin>

                                    </div>
                                </div>
                                <br />
                                {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
                                {this.state.showSuccessMessage && <div className="alert alert-warning">Login Successful</div>}
                                <br />

                                </div>
                            </form>
                        </div>

                    </div>


                </div>
            </div>
        )
    }
}

export default FrontPage