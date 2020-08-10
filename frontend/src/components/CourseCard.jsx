import React, { Component } from 'react';

class CourseCard extends Component {
    state = {}

    render() {
        return (<div className=" col-sm-4">
            <div class="card bg-info text-white">
                <div class="card-header">
                    {this.props.course.name}
                </div>
                <div class="card-body ">
                    <p class="card-text">

                        <div class="table-responsive">
                            <table class="table">
                                <tr>
                                    <th>Department</th>
                                    <td>{this.props.course.department}</td>
                                </tr>
                                <tr>
                                    <th>Term </th><td>{this.props.course.term}</td>
                                </tr>
                                <tr>
                                    <th>Add Code</th>
                                    <td>{this.props.course._id}</td>
                                </tr>

                            </table>
                        </div>

                    </p>
                </div>
                <div class="card-footer">
                    <button onClick={() => this.GoToCourse(this.props.course)} class="btn btn-danger">Go To Course</button><br />
                </div>


            </div>
        </div>);
    }
}

export default CourseCard;