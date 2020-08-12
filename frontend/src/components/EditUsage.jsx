import React, { Component } from 'react';
import Axios from 'axios';
import { API_URL } from '../Constants';
import "../styles/Usage.css";
import Button from 'react-bootstrap/esm/Button';

class EditUsage extends Component {
    state = {
        usageData: [],
        labelData: ["Date", "Electricity (kWh)", "Gas (therms)"]
    };

    componentDidMount = () => {

        Axios.get(`${API_URL}/usage/${this.props.match.params.projectId}?user=${sessionStorage.authenticatedUser}`).then(response => {
            console.log(response);
            this.setState({ usageData: response.data });
        });

    };

    onChange = (e, field, index) => {
        let data = this.state.usageData;

        data[index][field] = +e.target.value;

        this.setState({
            usageData: data
        });

    };

    submitData = () => {
        let data = [];

        for (let usage of this.state.usageData) {
            const { _id, electricity, gas } = usage;
            data.push({ _id, electricity, gas });
        }

        Axios.post(`${API_URL}/usage/updateUsage`, data).then(response => {
            alert('Usages Updated');
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
                                ["date", "electricity", "gas"].map((data, index) => {

                                    return <tr>
                                        <th>{this.state.labelData[index]}</th>
                                        {
                                            this.state.usageData.map((usage, index2) => {
                                                let text;

                                                if (index == 0) {
                                                    let date = new Date(usage["date"]);
                                                    text = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
                                                } else {
                                                    text = <input type="number" value={usage[data]} onChange={e => this.onChange(e, data, index2)} />
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

                <div className="col-sm-1">
                    <Button variant="success" className="w-100" onClick={this.submitData}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default EditUsage;