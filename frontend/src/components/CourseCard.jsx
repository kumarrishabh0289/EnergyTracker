import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class CourseCard extends Component {
    state = {}

    GoToCourse = (course) => {
        sessionStorage.setItem('courseid', course._id);
        sessionStorage.setItem('coursename', course.name);
        this.props.history.push(`/coursedetail`)
    }

    render() {
        return (<div className=" col-sm-4">
            <div class="card bg-info text-white">
                <div class="card-header">
                    {this.props.course.name}
                </div>
                <div class="card-body ">
                    <div class="card-text">

                        <div class="table-responsive">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th>Department</th>
                                        <td>{this.props.course.department}</td>
                                    </tr>
                                    <tr>
                                        <th>Term </th><td>{this.props.course.term}</td>
                                    </tr>
                                    {
                                        sessionStorage.getItem('role') == "Student" ? "" :
                                            <tr>
                                                <th>Add Code</th>
                                                <td>{this.props.course._id}</td>
                                            </tr>
                                    }
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>
                {
                    sessionStorage.getItem('role') == "Student" ? "" :
                        <div class="card-footer">
                            <button onClick={() => this.GoToCourse(this.props.course)} class="btn btn-danger">Go To Course</button><br />
                        </div>
                }


            </div>
        </div>);
    }
}

export default withRouter(CourseCard);