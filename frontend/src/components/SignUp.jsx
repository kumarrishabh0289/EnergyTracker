import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import AuthenticationForApiService from './AuthenticationForApiService.js'
import axios from 'axios';
import { API_URL } from '../Constants'

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: sessionStorage.getItem("name"),
            role: "student",
            email: sessionStorage.getItem("authenticatedUser"),
            hasFailed: false,
            showSuccessMessage: false,
        }
        this.submitSignUp = this.submitSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {

    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitSignUp = (e) => {
        console.log("submit login called")
    
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email: this.state.email,
            role: this.state.role,
        }
        console.log("data", data)
        //set the with credentials to true
        //axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(API_URL + "/user/updaterole", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    sessionStorage.setItem("role", response.data.role)
                    console.log(response.data);
                    this.setState({
                        
                        signup_status: response.data.message,
                        showSuccessMessage: true

                    })
                } else {
                    console.log(response.data.error);
                    this.setState({


                        signup_status: response.data.error,
                        hasFailed: true
                    })
                }
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

                            <h3>
                                Sign Up  {!(sessionStorage.getItem("role") === null) && <div>Via Google But Role is Not Assigned.</div>}
                            </h3>
                            {!(sessionStorage.getItem("role") === null) && <p>Your Account is Not with Us. If you are Student then please check details and click on Submit. <br/><font color="red">If you are teacher then please register yourself at https://app.greenninja.org/registration </font><br/>Unintended Users please logout from top right</p>}
                            <form onSubmit={this.submitSignUp}>
                                <div className="row" >

                                    <div className="col-sm-12 col-md-12">
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="where"><h5>Email ID</h5></label>
                                                <p>{sessionStorage.authenticatedUser}</p>
                                           
                                        </div>

                                    </div>
                                    <div className="col-sm-1 col-md-1">

                                    </div>

                                </div>
                                <div className="row" >

                                    <div className="col-sm-6 col-md-6">

                                        <div className="form-group">
                                            <label htmlFor="where"><h5>Name</h5></label>
                                            <p>{sessionStorage.name}</p>
                                        </div>

                                    </div>
                                    <div className="col-sm-6 col-md-6">

                                        <div className="form-group">
                                            <label htmlFor="Role"><h5>Role</h5></label>
                                            <p>{this.state.role}</p>
                                                      </div>

                                    </div>
                                    <div className="col-sm-1 col-md-1">

                                    </div>

                                </div>
                                                         


                                <div className="row" >

                                    <div className="col-sm-12 col-md-12">
                                        <div className="form-group">

                                            <br />
                                            <input type="submit" className="form-control btn btn-danger" />
                                            <br />
                                            <br />
                                        </div>
                                    </div>

                                    <br />
                                    {this.state.hasFailed && <div className="alert alert-warning">User Updation Failed Check console for More Info.</div>}
                                    {this.state.showSuccessMessage && <div className="alert alert-warning">User Updated Successfully</div>}
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

export default SignUp