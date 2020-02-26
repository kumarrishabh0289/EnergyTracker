import React, { Component } from 'react'
import TeacherDashboard from './TeacherDashboard'
// import SensorDeleteComponent from './SensorDeleteComponent.jsx'
// import SensorAddComponent from './SensorAddComponent.jsx'
// import SensorManageComponent from './SensorManageComponent.jsx'


class CourseDetail extends Component {


    constructor(props) {
        super(props)


        this.state = {

            showResultsAdd: false,
            showResultsDelete: false,
            showResultsUpdate: false,
            showResultsManage: false

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
            <div className="container">
                <br />
                <div style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>
                <br />
                <h3>&nbsp;&nbsp; Course: {sessionStorage.coursename}</h3>
                    <div className="container">
                        <br />
                        &nbsp;&nbsp;
                <button class="btn btn-primary" type="button" onClick={this.onClick} >Enrolled Students</button>
                        &nbsp;&nbsp;
                <button class="btn btn-primary" type="button" onClick={this.onClickUpdate} >Create Project</button>
                        &nbsp;&nbsp;
                <button class="btn btn-primary" type="button" onClick={this.onClickManage} >Project Detail</button>
                        &nbsp;&nbsp;
        
                </div>
                </div>
                <br />
                <div style={{ backgroundColor: "lightblue", opacity: .9, filter: "Alpha(opacity=50)", borderRadius: '10px' }}>

                    {this.state.showResultsDelete ? <TeacherDashboard /> : null}
                    {this.state.showResultsAdd ? <TeacherDashboard /> : null}
                    {this.state.showResultsUpdate ? <TeacherDashboard /> : null}
                    {this.state.showResultsManage ? <TeacherDashboard /> : null}

                </div>


            </div>
        )
    }

}

export default CourseDetail