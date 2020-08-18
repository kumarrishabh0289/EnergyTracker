import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { API_URL } from '../Constants'
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';

class ProjectDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeMessage: 'Hey You Are Authorized',

            project: [],

            status: ""


        }
        this.ChangeStatus = this.ChangeStatus.bind(this);
    }

    componentDidMount() {
        this.loadCourse();
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




    GoToCourse = (course) => {
        this.props.history.push(`/viewUsage/${course._id}`)
    }




    render() {
        console.log("this.state.project", this.state.project)

        if (sessionStorage.role === 'teacher') {
            return (
                <div class="container">


                    <div class="body-div">

                        <br />
                        <div className="col-sm-5 col-md-5" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=90)", borderRadius: '10px' }}>

                            <h3>Project Detail</h3>


                            <p>{this.state.status}</p>
                        </div>
                        <div class="card-columns">
                            {
                                this.state.project.map(project => {
                                    var StartDate = new Date(project.StartDate)
                                    StartDate = StartDate.toLocaleDateString()
                                    var ConservationStartDate = new Date(project.ConservationStartDate)
                                    ConservationStartDate = ConservationStartDate.toLocaleDateString()
                                    var EndDate = new Date(project.EndDate)
                                    EndDate = EndDate.toLocaleDateString()
                                    return (
                                        <div>
                                            <div class="card bg-info text-white">
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
                                                <div class="card-footer">
                                                    <button onClick={() => this.GoToCourse(project)} class="btn btn-danger">Go To Project</button><br />
                                                </div>


                                            </div>
                                        </div>


                                    )
                                })
                            }


                        </div>
                    </div>

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