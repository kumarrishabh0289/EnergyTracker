import React, { Component } from 'react'
import axios from 'axios';
import { API_URL } from '../Constants'
import { Link } from 'react-router-dom'

class AddCourse extends Component {


    constructor(props) {
        super(props)


        this.state = {
            faculty_email: sessionStorage.authenticatedUser,
            name: "",
            department: "",
            term: "",
            showSuccessMessage: false,
            status: ""
        }
        this.submitSignUp = this.submitSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    submitSignUp = (e) => {


        e.preventDefault();
        const data = {
            name: this.state.name,
            department: this.state.department,
            term: this.state.term,
            faculty_email: sessionStorage.authenticatedUser
        }
        console.log("data is", data)

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(API_URL + '/course', data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 201) {

                    console.log(response.data);
                    this.setState({ showSuccessMessage: true, status: response.data.message })
                } else {
                    console.log(response.data.error);
                    this.setState({ showSuccessMessage: true, status: response.data.message })
                }
            }).catch(() => {
                this.setState({ showSuccessMessage: false })

            })
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div class="leftPadding180 container my-4">
                <div class="p-4" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                    <div>
                        <h4>Add Class</h4>
                        <form onSubmit={this.submitSignUp}>
                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label htmlFor="where"><h6>Email</h6></label>
                                        <p>{sessionStorage.authenticatedUser}</p>
                                    </div>

                                </div>

                            </div>
                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label htmlFor="where"><h6>Class Name</h6></label>
                                        <input type="text" className="form-control" name="name" id="name" placeholder="Class Name" required value={this.state.name} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>

                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label htmlFor="where"><h6>Department</h6></label>
                                        <input type="text" className="form-control" name="department" id="department" placeholder="Department" required value={this.state.department} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>



                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label htmlFor="where"><h6> Term </h6></label>
                                        <input type="text" className="form-control" name="term" id="term" placeholder="Term e.g. Spring 2020" required value={this.state.term} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>


                            <div className="row col-sm-12 d-flex justify-content-around" >

                                <input type="submit" className="form-control btn btn-danger col-sm-3" />
                                <button class="btn btn-success col-sm-3" onClick={e => this.props.history.push('/teacherdashboard')}>Go to Dashboard</button>

                            </div>

                            {this.state.showSuccessMessage && <div className="alert alert-warning col-sm-8 mx-auto my-3">{this.state.status}</div>}

                        </form>

                    </div>
                </div>
            </div>
        )
    }

}

export default AddCourse