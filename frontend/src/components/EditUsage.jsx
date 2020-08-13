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
        const dateDifference = this.state.usageData[0] && (new Date(this.state.usageData[0].project.ConservationStartDate) - new Date(this.state.usageData[0].project.StartDate)) / (1000 * 3600 * 24);

        const remainingDays = this.state.usageData[0] && ((new Date(this.state.usageData[0].project.EndDate) - new Date(this.state.usageData[0].project.StartDate)) / (1000 * 3600 * 24)) - dateDifference;

        return (
            <div className="edit-wrapper card mt-4 col-sm-11 mx-auto p-3">
                <h2 className="mb-4">Usage Details </h2>

                <h4 className="mb-5">Project: {this.state.usageData[0] && this.state.usageData[0].project.name}</h4>

                <div className="table-container">
                    <table className="usage-table table table-bordered">
                        <thead>
                            <th></th>
                            <th colSpan={dateDifference}>Baseline Period</th>

                            <th colSpan={remainingDays + 1}>Conservation Period</th>
                        </thead>
                        <tbody>
                            {
                                ["date", "electricity", "gas"].map((data, index) => {

                                    return <tr key={data}>
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

                                                return <td className={index == 0 && (index2 < dateDifference ? "row-yellow" : "row-green")} key={usage._id}>{text}</td>
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
            </div >
        );
    }
}

export default EditUsage;