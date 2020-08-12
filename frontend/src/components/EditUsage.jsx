import React, { Component } from 'react';
import Axios from 'axios';
import { API_URL } from '../Constants';
import "../styles/Usage.css";

class EditUsage extends Component {
    state = {
        usageData: [],
        labelData: ["Date", "Electricity (kWh)", "Gas (therms)"],
        fetchData: ["date", "electricity", "gas"]
    };

    componentDidMount = () => {

        Axios.get(`${API_URL}/usage/${this.props.match.params.projectId}`).then(response => {
            console.log(response);
            this.setState({ usageData: response.data });
        });

    };

    render() {
        return (
            <div className="edit-wrapper card mt-4 col-sm-11 mx-auto p-3">
                <h2 className="mb-4">Usage Details </h2>

                <h4 className="mb-5">Project: {this.state.usageData[0] && this.state.usageData[0].project.name}</h4>

                <div className="table-container">
                    <table className="usage-table table table-bordered">
                        <tbody>
                            {
                                [0, 1, 2].map(data => {

                                    return <tr>
                                        <th>{this.state.labelData[data]}</th>
                                        {
                                            this.state.usageData.map(usage => {
                                                let text;

                                                if (data == 0) {
                                                    let date = new Date(usage[this.state.fetchData[data]]);
                                                    text = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
                                                } else {
                                                    text = <input type="text" value={usage[this.state.fetchData[data]]} />
                                                }

                                                return <td>{text}</td>
                                            })
                                        }
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default EditUsage;