import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../Constants'
import axios from 'axios';
import CourseCard from './CourseCard';

class StudentDashboard extends Component {
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
                        status: "No Courses Assigned"
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
        sessionStorage.setItem('courseid', course._id);
        sessionStorage.setItem('coursename', course.name);
        this.props.history.push(`/coursedetail`)
    }




    render() {
        console.log("this.state.course", this.state.course)

        if (sessionStorage.role === 'teacher') {
            return (
                <div class="container">


                    <div class="body-div">

                        <br />
                        <div className="col-sm-5 col-md-5" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=90)", borderRadius: '10px' }}>

                            <h3>Teacher's Dashboard </h3>
                            <h5>Welcome, {sessionStorage.name}</h5>
                            <p>Teacher ID: {sessionStorage.authenticatedUser}</p>
                            <p>{this.state.status}</p>
                        </div>
                        <div class="card-columns">
                            {
                                this.state.course.map(course => {
                                    return (
                                        <CourseCard course={course} />
                                    )
                                })
                            }


                        </div>
                    </div>

                    {sessionStorage.role === 'teacher' && (<Link to="/addcourse"><button class="btn btn-success">Create new Course</button></Link>)}
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


export default StudentDashboard