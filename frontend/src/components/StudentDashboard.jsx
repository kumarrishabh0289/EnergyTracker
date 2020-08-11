import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../Constants'
import axios from 'axios';
import '../styles/Dashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignInAlt, faPlus
} from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CourseCard from './CourseCard';

class StudentDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            projects: [],
            courseModal: false
        };
    }

    componentDidMount() {
        this.getStudentData();
    }

    getStudentData = () => {

        axios.get(`${API_URL}/enroll/getEnrolledCourses/${sessionStorage.authenticatedUser}`).then(response => {
            // this.setState({
            //     courses: response.data.courses,
            //     projects: response.data.projects
            // })
        })

    };

    registerCourse = () => {
        this.hideAddModal();
        axios.post(`${API_URL}/class/registerCourse`, {
            student: sessionStorage.authenticatedUser,
            course: this.state.addCode
        }).then(data => {
            this.setState({
                courses: data
            })
        }).catch(error => {
            if (error.response)
                alert(error.response.data.error);
        });

    }

    hideAddModal = () => {
        this.setState({ courseModal: false });
    }

    showAddModal = () => {
        this.setState({ courseModal: true });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {


        if (sessionStorage.role === 'Student') {
            return (
                <Fragment>
                    <Modal show={this.state.courseModal} onHide={this.hideAddModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Enter the required class add code here</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="code">
                                <Form.Label>Add Code:</Form.Label>
                                <Form.Control type="text" placeholder="Add code" onChange={this.handleChange} name="addCode" />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideAddModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.registerCourse}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className="container dashboard-wrapper card">
                        <div className="body-div">
                            <h2>Student Dashboard </h2>
                            <h5>Welcome, {sessionStorage.name}</h5>
                            <p>Student ID: {sessionStorage.authenticatedUser}</p>
                            <div className="row-header col-sm-12">
                                <div className="row-top">
                                    <h5 className="m-0">Your Classes: </h5>
                                    <div className="btn btn-success" onClick={this.showAddModal}><FontAwesomeIcon icon={faPlus} />Enroll in a class</div>
                                </div>

                                <div className="row-body col-sm-12 row">
                                    {
                                        this.state.courses.length ?
                                            this.state.courses.map(course => {
                                                return <CourseCard course={course} />;
                                            }) :
                                            "Not Registered in any course"
                                    }
                                </div>

                            </div>

                            <div className="row-header col-sm-12">
                                <h3 className="">Your Projects: </h3>

                                <div className="row-header col-sm-12">
                                    <h5 className="m-0">Enter (Edit) Your Energy Data: </h5>
                                    <div className="row-body col-sm-12">
                                        {
                                            this.state.projects.length ?
                                                this.state.projects.map(project => {
                                                    return <Link to={"/editUsage/" + project._id}>{project.name}</Link>;
                                                }) :
                                                "Not Registered in any project"
                                        }
                                    </div>
                                </div>

                                <div className="row-header col-sm-12">
                                    <h5 className="m-0">View Usage: </h5>
                                    <div className="row-body col-sm-12">
                                        {
                                            this.state.projects.length ?
                                                this.state.projects.map(project => {
                                                    return <div>{project.name}</div>;
                                                }) :
                                                "Not Registered in any project"
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }
        else {
            return (
                <div className="container">
                    <div className="body-div">
                        <h3>Looks like you are not authorized to view this page.</h3>
                    </div>
                </div>
            )
        }
    }



}


export default StudentDashboard