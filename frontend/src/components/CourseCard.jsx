import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./../styles/Dashboard.css";

class CourseCard extends Component {
    state = {}

    GoToCourse = (course) => {
        sessionStorage.setItem('courseid', course._id);
        sessionStorage.setItem('coursename', course.name);
        this.props.history.push(`/coursedetail`)
    }

    render() {
        return (<div className=" col-sm-4 my-3">
            <div className="card class-card">
                <div className="card-header font-weight-bold">
                    {this.props.course.name}
                </div>
                <div className="card-body ">
                    <div className="card-text">

                        <div className="table-responsive">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Department</th>
                                        <td>{this.props.course.department}</td>
                                    </tr>
                                    <tr>
                                        <th>Term </th>
                                        <td>{this.props.course.term}</td>
                                    </tr>
                                    {
                                        sessionStorage.getItem('role') == "student" ? "" :
                                            <tr>
                                                <th>Add Code</th>
                                                <td>{this.props.course.addCode}</td>
                                            </tr>
                                    }
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>
                {
                    sessionStorage.getItem('role') == "student" ? "" :
                        <div className="p-3">
                            <button onClick={() => this.GoToCourse(this.props.course)} className="btn btn-danger card-btn">Go To Class</button><br />
                        </div>
                }


            </div>
        </div>);
    }
}

export default withRouter(CourseCard);