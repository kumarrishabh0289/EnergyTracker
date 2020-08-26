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
            <div className="card bg-info text-white">
                <div className="card-header">
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
                        <div className="card-footer">
                            <button onClick={() => this.GoToCourse(this.props.course)} className="btn btn-danger">Go To Class</button><br />
                        </div>
                }


            </div>
        </div>);
    }
}

export default withRouter(CourseCard);