import React, { Component } from 'react'
import TeacherDashboard from './TeacherDashboard'
import CreateProject from './CreateProject'
import ProjectDetail from './ProjectDetail'
import EnrolledStudents from './EnrolledStudents'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'


class CourseDetail extends Component {


    constructor(props) {
        super(props)


        this.state = {

            showResultsAdd: false,
            showResultsDelete: false,
            showResultsUpdate: false,
            showResultsManage: true

        }

        this.onClick = this.onClick.bind(this);
        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.onClickManage = this.onClickManage.bind(this);

        this.onClickDelete = this.onClickDelete.bind(this);


    }

    onClick() {
        this.setState({ showResultsAdd: true, showResultsUpdate: false, showResultsDelete: false, showResultsManage: false });
    }
    onClickUpdate() {
        this.setState({ showResultsUpdate: true, showResultsDelete: false, showResultsAdd: false, showResultsManage: false });
    }
    onClickManage() {
        this.setState({ showResultsUpdate: false, showResultsDelete: false, showResultsAdd: false, showResultsManage: true });
    }
    onClickDelete() {
        this.setState({ showResultsDelete: true, showResultsUpdate: false, showResultsAdd: false, showResultsManage: false });
    }

    render() {

        return (
            <div className="container pt-4">
                <div className="p-4" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                    <h3>&nbsp;&nbsp; Class: {sessionStorage.coursename}</h3>

                    <div className="container mt-4">
                        <Tab.Container defaultActiveKey="first">
                            <Row>
                                <Col sm={6}>
                                    <Nav variant="pills" className="flex-row">
                                        <Nav.Item>
                                            <Nav.Link eventKey="first">Project Details</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second">Enrolled Students</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="third">Create Project</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                            </Row>
                            <Row>
                                <div className="mt-4 w-100" style={{ backgroundColor: "lightblue", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="first"><ProjectDetail /></Tab.Pane>
                                        <Tab.Pane eventKey="second"><EnrolledStudents /></Tab.Pane>
                                        <Tab.Pane eventKey="third"><CreateProject /></Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Row>
                        </Tab.Container>
                    </div>
                    {/* <br />
                        &nbsp;&nbsp;
                <button class="btn btn-primary" type="button" onClick={this.onClick} >Enrolled Students</button>
                        &nbsp;&nbsp;
                <button class="btn btn-primary" type="button" onClick={this.onClickUpdate} >Create Project</button>
                        &nbsp;&nbsp;
                <button class="btn btn-primary" type="button" onClick={this.onClickManage} >Project Detail</button>
                        &nbsp;&nbsp; */}

                </div>
                {/* <div className="mt-4 " style={{ backgroundColor: "lightblue", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>

                    {this.state.showResultsDelete ? <TeacherDashboard /> : null}
                    {this.state.showResultsAdd ? <EnrolledStudents /> : null}
                    {this.state.showResultsUpdate ? <CreateProject /> : null}
                    {this.state.showResultsManage ? <ProjectDetail /> : null}

                </div> */}
            </div>

        )
    }

}

export default CourseDetail