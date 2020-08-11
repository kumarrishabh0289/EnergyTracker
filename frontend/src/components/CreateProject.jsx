import React, { Component } from 'react'
import axios from 'axios';
import { API_URL } from '../Constants'
import { Link } from 'react-router-dom'

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
            projectname:""
        }
        this.submitSignUp = this.submitSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    submitSignUp = (e) => {


        e.preventDefault();
        const data = {
            name: this.state.projectname,
            course_id:sessionStorage.courseid,
            faculty_email: sessionStorage.authenticatedUser,
            StartDate: this.state.StartDate,
            ConservationStartDate: this.state.ConservationStartDate,
            EndDate: this.state.EndDate,
            projectname:this.state.projectname
        }
        console.log("data is", data)

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(API_URL + '/course/createproject', data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 201) {

                    console.log(response.data);
                    this.setState({ showSuccessMessage: true, status: response.data.message })
                } else {
                    console.log(response.data.error);
                    this.setState({ showSuccessMessage: true, status: response.data.message})
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
            <div className="container" >
                <br />
                <div class="" style={{ "padding-left": "30px", backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                    <div>
                        <br />
                        <h4>Add Project</h4>
                        <form onSubmit={this.submitSignUp}>
                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    Course: {sessionStorage.coursename}<br />
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
                                        <input type="date" className="form-control" name="StartDate" id="StartDate" placeholder="Start Date" required value={this.state.StartDate} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>

                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label ><h6>conservation Start Date</h6></label>
                                        <input type="date" className="form-control" name="ConservationStartDate" id="ConservationStartDate" placeholder="Conservation Start Date" required value={this.state.ConservationStartDate} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>

                            <div className="row" >

                                <div className="col-sm-12 col-md-12">

                                    <div className="form-group">
                                        <label ><h6>End Date</h6></label>
                                        <input type="date" className="form-control" name="EndDate" id="EndDate" placeholder="End Date" required value={this.state.EndDate} onChange={this.handleChange} />

                                    </div>

                                </div>

                            </div>
                            <div className="row" >


                                <div className="row" >

                                    <div className="col-sm-12 col-md-12">
                                        <div className="form-group">

                                            <br />
                                            <input type="submit" className="form-control btn btn-danger" />
                                            <br />
                                        </div>
                                    </div>
                                    <br />
                                    <Link to="/teacherdashboard"><button class="btn btn-success">Go to Dashboard</button></Link>

                                    &nbsp;&nbsp;


                                    {this.state.showSuccessMessage && <div className="alert alert-warning">{this.state.status}</div>}
                                    <br />

                                </div>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        )
    }

}

export default CreateProject