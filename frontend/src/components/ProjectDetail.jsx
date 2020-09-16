import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { API_URL } from '../Constants'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class ProjectDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeMessage: 'Hey You Are Authorized',

            project: [],

            status: "",
            editModal: false,
            department: "",
            term: "",
            showSuccessMessage: false,
            status: "",
            StartDate: "",
            ConservationStartDate: "",
            EndDate: "",
            projectname: "",
            projectId: ""


        }
        this.ChangeStatus = this.ChangeStatus.bind(this);
    }

    componentDidMount() {
        this.loadCourse();
    }

    loadProject = ({ projectname, StartDate, ConservationStartDate, EndDate, _id }) => {

        this.setState({
            editModal: true,
            projectname,
            StartDate: new Date(StartDate),
            ConservationStartDate: new Date(ConservationStartDate),
            EndDate: new Date(EndDate),
            projectId: _id
        })

    }

    loadCourse() {
        let course_id = sessionStorage.courseid;
        console.log("API_URL", API_URL)
        axios.get(API_URL + '/course/project', { params: { course_id } })
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    this.setState({
                        project: response.data
                    });
                }
                if (response.status === 201) {
                    this.setState({
                        status: "No Project Assigned"
                    });
                }

            });
    }
    ProgressButton = (machine) => {
        sessionStorage.setItem('machine', machine.machineId);
        sessionStorage.setItem('machineowner', machine.email);
        this.props.history.push(`/sensor`)
    }
    ChangeStatus = (machine, p2) => e => {
        console.log("hittt")
        e.preventDefault();
        if (p2 == 0) {
            p2 = 1
        }
        else {
            p2 = 0
        }
        console.log(p2)
        const data = {
            machineId: machine,
            machineStatus: p2
        }
        console.log("passing", data)
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.patch(API_URL + '/machine/update', data)
            .then((response) => {
                if (response.status === 200) {

                    console.log(response.data);
                    this.setState({

                        signup_status: response.data.message,
                        showSuccessMessage: true
                    })

                    this.loadMachine();
                } else {
                    console.log(response.data.error);
                    this.setState({

                        signup_status: response.data.error,
                        hasFailed: true
                    })
                }
            });

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

    editProject = (e) => {

        e.preventDefault();

        if (!(this.state.StartDate < this.state.ConservationStartDate && this.state.StartDate < this.state.EndDate)) {
            this.setState({ showError: true, status: "Start date cannot be greater or equal than conservation date or end date!" });
            return;
        } else if (!(this.state.ConservationStartDate > this.state.StartDate && this.state.ConservationStartDate < this.state.EndDate)) {
            this.setState({ showError: true, status: "Conservation date cannot be greater than end date or lesser than start date!" });
            return;
        } else if (!(this.state.EndDate > this.state.StartDate && this.state.EndDate > this.state.ConservationStartDate)) {
            this.setState({ showError: true, status: "End date cannot be lesser than start date or conservation date!" });
            return;
        }
        const data = {
            StartDate: this.state.StartDate,
            ConservationStartDate: this.state.ConservationStartDate,
            EndDate: this.state.EndDate,
            id: this.state.projectId,
            faculty_email: sessionStorage.getItem("authenticatedUser")
        }
        console.log("data is", data)

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(API_URL + '/course/updateProject', data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 201) {

                    console.log(response.data);
                    this.setState({ showSuccessMessage: true, status: response.data.message, showError: false })
                    this.loadCourse();
                } else {
                    console.log(response.data.error);
                    this.setState({ showSuccessMessage: true, status: response.data.message, showError: false })
                }
            }).catch(() => {
                this.setState({ showSuccessMessage: false })

            })
    }

    editModal = () => {
        return <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.editModal} onHide={() => this.setState({ editModal: false, showSuccessMessage: false, showError: false })}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container" >
                    <div class="" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                        <div className="">
                            <form onSubmit={this.editProject}>
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
                                            <label><h6>Project Name: </h6></label>
                                            <label className="mx-3">{this.state.projectname}</label>
                                            {/* <input type="text" className="form-control" name="projectname" id="projectname" placeholder="Project Name" required value={this.state.projectname} onChange={this.handleChange} /> */}

                                        </div>

                                    </div>

                                </div>
                                <div className="row" >

                                    <div className="col-sm-8 col-md-8">

                                        <div className="form-group">
                                            <label><h6>Start Date</h6></label>
                                            {/* <input type="date" className="form-control" name="StartDate" id="StartDate" placeholder="Start Date" required value={this.state.StartDate} onChange={this.handleChange} /> */}
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

                                    <div className="col-sm-8 col-md-8">

                                        <div className="form-group">
                                            <label ><h6>Conservation Start Date</h6></label>
                                            {/* <input type="date" className="form-control" name="ConservationStartDate" id="ConservationStartDate" placeholder="Conservation Start Date" required value={this.state.ConservationStartDate} onChange={this.handleChange} /> */}
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

                                    <div className="col-sm-8 col-md-8">

                                        <div className="form-group">
                                            <label ><h6>End Date</h6></label>
                                            {/* <input type="date" className="form-control" name="EndDate" id="EndDate" placeholder="End Date" required value={this.state.EndDate} onChange={this.handleChange} /> */}
                                            <div>
                                                <DatePicker
                                                    selected={this.state.EndDate}
                                                    onChange={e => this.handleDate("EndDate", e)}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                </div>
                                <div className="row col-sm-12 d-flex justify-content-center" >

                                    <div className="col-sm-3">
                                        <input type="submit" className="form-control btn btn-danger" />

                                    </div>

                                </div>


                                {this.state.showSuccessMessage && <div className="alert alert-warning  col-sm-8 mx-auto my-3">{this.state.status}</div>}
                                {this.state.showError && <div className="alert alert-danger  col-sm-8 mx-auto my-3">{this.state.status}</div>}
                            </form>

                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    }


    GoToCourse = (course) => {
        this.props.history.push(`/viewUsage/${course._id}`)
    }


    editUsage = (course) => {
        this.props.history.push(`/editUsage/${course._id}`)
    }

    render() {
        console.log("this.state.project", this.state.project)

        if (sessionStorage.role === 'teacher') {
            return (
                <div class="container">
                    {this.editModal()}

                    <div class="body-div py-3">

                        <div className="col-sm-12 p-3" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=90)", borderRadius: '10px' }}>

                            <h3>Projects List</h3>


                            <p>{this.state.status}</p>
                            <div class="col-sm-12 row">
                                {
                                    this.state.project.map(project => {
                                        var StartDate = new Date(project.StartDate)
                                        StartDate = StartDate.toLocaleDateString()
                                        var ConservationStartDate = new Date(project.ConservationStartDate)
                                        ConservationStartDate = ConservationStartDate.toLocaleDateString()
                                        var EndDate = new Date(project.EndDate)
                                        EndDate = EndDate.toLocaleDateString()
                                        return (
                                            <div class="card bg-info text-white col-sm-5 m-3">
                                                <div class="card-header">
                                                    {project.name}
                                                </div>
                                                <div class="card-body ">
                                                    <p class="card-text">

                                                        <div class="table-responsive">
                                                            <table class="table">
                                                                <tr>
                                                                    <th>Start Date</th>
                                                                    <td>{StartDate}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Conservation Start Date </th>
                                                                    <td>{ConservationStartDate}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>End Date</th>
                                                                    <td>{EndDate}</td>
                                                                </tr>

                                                            </table>
                                                        </div>

                                                    </p>
                                                </div>
                                                <div class="card-footer d-flex justify-content-between p-2">
                                                    <button onClick={() => this.GoToCourse(project)} class="btn btn-danger">View Usage</button>
                                                    <button onClick={() => this.editUsage(project)} class="btn btn-primary">Edit Usage</button>
                                                    <button onClick={() => { this.loadProject(project) }} class="btn btn-success">Edit Project</button>
                                                </div>


                                            </div>


                                        )
                                    })
                                }


                            </div>

                        </div></div>

                </div>
            )
        }
        else {
            return (
                <div class="container">
                    <div class="body-div">
                        <h3>Looks like you are not authorized to view this page.</h3>
                    </div>
                </div>
            )
        }
    }



}


export default withRouter(ProjectDetail) 