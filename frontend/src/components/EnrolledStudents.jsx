import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { API_URL } from "../Constants";
import axios from "axios";

class EnrolledStudents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      welcomeMessage: "Hey You Are Authorized",

      student: [],

      status: "",
    };

  }

  componentDidMount() {
    this.loadStudents();
  }

  loadStudents() {
    let course_id = sessionStorage.courseid;

    axios
      .get(API_URL + "/enroll/getStudentList/", { params: { course_id } })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          this.setState({
            student: response.data,
          });
        }
        if (response.status === 201) {
          this.setState({
            status: "No Student Enrolled",
          });
        }
      });
  }

  render() {
    console.log("this.state.project", this.state.project);

    if (sessionStorage.role === "teacher") {
      return (
        <div class="container p-3">
          <div class="body-div">
            <div
              className="col-sm-12 p-3"
              style={{
                backgroundColor: "white",
                opacity: 0.9,
                filter: "Alpha(opacity=90)",
                borderRadius: "10px",
              }}
            >
              <h3>Enrolled Students</h3>

              <p>{this.state.status}</p>

              <table className='table'>
                <tbody>
                  {this.state.student.map((student) => {
                    return (
                      <tr>
                        <td>{student.student}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>


          </div>
        </div>
      );
    } else {
      return (
        <div class="container">
          <div class="body-div">
            <h3>Looks like you are not authorized to view this page.</h3>
          </div>
        </div>
      );
    }
  }
}

export default EnrolledStudents;
