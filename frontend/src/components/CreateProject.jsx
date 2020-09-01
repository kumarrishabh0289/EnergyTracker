import React, { Component } from 'react'
import axios from 'axios';
import { API_URL } from '../Constants'
import { Link, withRouter } from 'react-router-dom'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class CreateProject extends Component {


    constructor(props) {
        super(props)


        this.state = {
            faculty_email: sessionStorage.authenticatedUser,
            name: "",
            department: "",
            term: "",
            showSuccessMessage: false,
            status: "",
            StartDate: "",
            ConservationStartDate: "",
            EndDate: "",
            projectname: ""
        }
        this.submitSignUp = this.submitSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    submitSignUp = (e) => {


        e.preventDefault();


        if (!(this.state.StartDate < this.state.ConservationStartDate && this.state.StartDate < this.state.EndDate)) {
            this.setState({ showError: true, status: "Start date cannot be greater than conservation date or end date!" });
            return;
        } else if (!(this.state.ConservationStartDate > this.state.StartDate && this.state.ConservationStartDate < this.state.EndDate)) {
            this.setState({ showError: true, status: "Conservation date cannot be greater than end date or lesser than start date!" });
            return;
        } else if (!(this.state.EndDate > this.state.StartDate && this.state.EndDate > this.state.ConservationStartDate)) {
            this.setState({ showError: true, status: "End date cannot be lesser than start date or conservation date!" });
            return;
        }

        const data = {
            name: this.state.projectname,
            course_id: sessionStorage.courseid,
            faculty_email: sessionStorage.authenticatedUser,
            StartDate: this.state.StartDate,
            ConservationStartDate: this.state.ConservationStartDate,
            EndDate: this.state.EndDate,
            projectname: this.state.projectname
        }
        console.log("data is", data)

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(API_URL + '/course/createproject', data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 201) {

                    console.log(response.data);
                    // this.props.updateList();
                    this.setState({ showSuccessMessage: true, status: response.data.message, showError: false })
                } else {
                    console.log(response.data.error);
                    this.setState({ showSuccessMessage: true, status: response.data.message, showError: false })
                }
            }).catch((err) => {
                console.log('err', err)
                this.setState({ showSuccessMessage: false })

            })
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    handleDate = (type, event) => {
        this.setState({
            [type]: event
        })
    }

    render() {
        return (
            <div className="container p-3" >
                <div class="p-4" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                    <div className="">
                        <h4>Add Project</h4>
                        <form onSubmit={this.submitSignUp}>
                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    Class: {sessionStorage.coursename}<br />
                                    Faculty:  {sessionStorage.name}<br />
                                    <br />

                                </div>

                            </div>
                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label><h6>Project Name</h6></label>
                                        <input type="text" className="form-control" name="projectname" id="projectname" placeholder="Project Name" required value={this.state.projectname} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>
                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label><h6>Start Date</h6></label>

                                        <div>
                                            <DatePicker
                                                selected={this.state.StartDate}
                                                onChange={e => this.handleDate("StartDate", e)}
                                            />

                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label ><h6>Conservation Start Date</h6></label>
                                        <div>
                                            <DatePicker
                                                selected={this.state.ConservationStartDate}
                                                onChange={e => this.handleDate("ConservationStartDate", e)}
                                            />

                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label ><h6>End Date</h6></label>
                                        <div>
                                            <DatePicker
                                                selected={this.state.EndDate}
                                                onChange={e => this.handleDate("EndDate", e)}
                                            />
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="row col-sm-12 d-flex justify-content-around" >

                                <div className="col-sm-3">
                                    <input type="submit" className="form-control btn btn-danger" />

                                </div>
                                <div className="col-sm-3">
                                    <button class="btn btn-success w-100" onClick={e => this.props.history.push('/teacherdashboard')}>Go to Dashboard</button>

                                </div>

                            </div>


                            {this.state.showSuccessMessage && <div className="alert alert-warning  col-sm-8 mx-auto my-3">{this.state.status}</div>}
                            {this.state.showError && <div className="alert alert-danger  col-sm-8 mx-auto my-3">{this.state.status}</div>}
                        </form>

                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(CreateProject)