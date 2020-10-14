import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../Constants'
import axios from 'axios';
import CourseCard from './CourseCard';
import { faPlus, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TeacherDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeMessage: 'Hey You Are Authorized',

            course: [],

            status: ""


        }
        this.ChangeStatus = this.ChangeStatus.bind(this);
    }

    componentDidMount() {
        this.loadCourse();
    }

    loadCourse() {
        let email = sessionStorage.authenticatedUser;
        console.log("API_URL", API_URL)
        axios.get(API_URL + '/course/email', { params: { email } })
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    this.setState({
                        course: response.data
                    });
                }
                if (response.status === 201) {
                    this.setState({
                        status: "No Class Assigned"
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

    render() {
        console.log("this.state.course", this.state.course)

        if (sessionStorage.role === 'teacher') {
            return (
                <div class="container py-4">


                    <div class="body-div card p-4 opacity-2">

                        <div className="col-sm-12 d-flex align-items-center justify-content-between" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=90)", borderRadius: '10px' }}>

                            <div className="left">
                                <h3>Teacher's Dashboard </h3>
                                <h5>Welcome, {sessionStorage.name}</h5>
                                {/* <p>Teacher ID: {sessionStorage.authenticatedUser}</p> */}
                                <p>{this.state.status}</p>
                            </div>
                            <div className="right">
                                {sessionStorage.role === 'teacher' && (<Link to="/addcourse"><button class="btn btn-success"><FontAwesomeIcon icon={faPlus} className="mr-2" />Create New Class</button></Link>)}
                            </div>
                        </div>
                        <div class="row my-3">
                            {
                                this.state.course.map(course => {
                                    return (
                                        <CourseCard course={course} />
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


export default TeacherDashboard