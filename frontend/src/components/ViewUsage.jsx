import React, { Component, Fragment } from 'react';
import Axios from 'axios';
import { API_URL } from '../Constants';
import "../styles/Usage.css";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ChartsWrapper from './ChartsWrapper';
import CarbonEmission from './CarbonEmission';
import Statistics from './Statistics';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

class ViewUsage extends Component {
    state = {
        usageData: [],
        selfData: [],
        average: {},
        weeklyAverage: [],
        selfWeekly: [],
        statistics: {},
        labelData: ["Date", "Electricity (kWh)", "Gas (therms)"],
        showNames: false
    };

    componentDidMount = () => {

        Axios.get(`${API_URL}/usage/getAllUsage/${this.props.match.params.projectId}?user=${sessionStorage.authenticatedUser}`).then(response => {
            console.log(response);
            this.setState({
                usageData: response.data.data,
                selfData: response.data.selfUsage,
                average: response.data.average,
                weeklyAverage: response.data.weeklyAverage,
                selfWeekly: response.data.selfWeekly,
                statistics: response.data.statistics
            });
        });

    };

    render() {
        console.log("asdasd", this.props);
        const selfData = this.state.selfData;

        const dateDifference = selfData.length && (new Date(selfData[0].project.ConservationStartDate) - new Date(selfData[0].project.StartDate)) / (1000 * 3600 * 24);

        const totalDays = selfData.length && ((new Date(selfData[0].project.EndDate) - new Date(selfData[0].project.StartDate)) / (1000 * 3600 * 24));
        const remainingDays = totalDays - dateDifference;

        return (
            <div className="edit-wrapper card my-4 col-sm-11 mx-auto p-3">
                <div className="d-flex justify-content-between">
                    <div className="left">
                        <h2 className="mb-4">Usage Details </h2>

                        <h4 className="mb-5">Project: {selfData.length && selfData[0].project.name}</h4>

                    </div>

                    <div className="right">
                        <Button variant="outline-success" onClick={e => window.history.back()}>&lt; Go back</Button>
                    </div>
                </div>

                <div className="tab-container p-3">
                    <Tabs defaultActiveKey="usage" id="uncontrolled-tab-example">
                        <Tab eventKey="usage" title="Usage">
                            {
                                sessionStorage.getItem("role") == "student" ? "" : <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Show Student Names" onChange={e => {

                                        this.setState({ showNames: !this.state.showNames })
                                    }} />
                                </Form.Group>
                            }

                            <div className="table-container mb-4">
                                <Alert className="m-0" variant="success">Your Usage </Alert>
                                <table className="usage-table table table-bordered">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th colSpan={dateDifference ? dateDifference : 1}>Baseline Period</th>

                                            <th colSpan={remainingDays ? remainingDays + 1 : 1}>Conservation Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ["date", "electricity", "gas"].map((data, index) => {

                                                return <tr key={data}>
                                                    <th>{this.state.labelData[index]}</th>
                                                    {
                                                        selfData && selfData.map((usage, index2) => {
                                                            let text;

                                                            if (index == 0) {
                                                                let date = new Date(usage["date"]);
                                                                text = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
                                                            } else {
                                                                // text = <input type="number" value={usage[data]} onChange={e => this.onChange(e, data, index2)} />;
                                                                text = <div>{usage[data]}</div>;
                                                            }

                                                            return <td className={index == 0 && (index2 < dateDifference ? "row-yellow" : "row-green") || ""} key={usage._id}>{text}</td>
                                                        })
                                                    }
                                                </tr>;
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="table-container mb-4">
                                <Alert className="m-0" variant="success">Class Usage Details</Alert>

                                {
                                    !this.state.usageData.length ?
                                        <h5 className="my-2">No data available</h5>
                                        :
                                        <table className="usage-table table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th colSpan={dateDifference}>Baseline Period</th>

                                                    <th colSpan={remainingDays + 1}>Conservation Period</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ["date"].map((data, index) => {

                                                        return <tr key={data}>
                                                            <th>{this.state.labelData[index]}</th>
                                                            {
                                                                this.getHeaderData(index, data, dateDifference)

                                                                // this.getData(index, data, dateDifference)
                                                            }
                                                        </tr>;
                                                    })
                                                }

                                                {
                                                    Object.keys(this.state.usageData).map((data, index) => {

                                                        if (data == sessionStorage.getItem("authenticatedUser")) return "";
                                                        else return (
                                                            <Fragment>
                                                                <div className="bordered-name mt-4"><div>{this.state.showNames ? this.state.usageData[data][0].user_id : `Student ${index + 1}`}</div></div>
                                                                <tr>
                                                                    <th>{this.state.labelData[1]}</th>
                                                                    {
                                                                        this.state.usageData[data] && this.state.usageData[data].map((currUsage, index2) => {
                                                                            let text;
                                                                            text = <div>{currUsage["electricity"]}</div>;


                                                                            return <td key={currUsage._id}>{text}</td>

                                                                        })
                                                                    }
                                                                </tr>
                                                                <tr>
                                                                    <th>{this.state.labelData[2]}</th>
                                                                    {
                                                                        this.state.usageData[data] && this.state.usageData[data].map((currUsage, index2) => {
                                                                            let text;
                                                                            text = <div>{currUsage["gas"]}</div>;


                                                                            return <td key={currUsage._id}>{text}</td>

                                                                        })
                                                                    }
                                                                </tr>
                                                            </Fragment>
                                                        );
                                                    })
                                                    // this.getData()
                                                }
                                            </tbody>
                                        </table>

                                }
                            </div>


                        </Tab>
                        <Tab eventKey="charts" title="Charts">
                            <ChartsWrapper data={this.state} />
                        </Tab>
                        <Tab eventKey="emissions" title="Carbon Emissions">
                            <CarbonEmission data={this.state} />
                        </Tab>
                        <Tab eventKey="statistics" title="Statistics">
                            <Statistics data={this.state} />
                        </Tab>
                    </Tabs>

                </div>


            </div >
        );
    }

    getHeaderData = (index, data, dateDifference) => {

        return this.state.selfData && this.state.selfData.map((currUsage, index2) => {
            let text;

            if (index == 0) {
                let date = new Date(currUsage["date"]);
                text = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
            }

            return <td className={index == 0 && (index2 < dateDifference ? "row-yellow" : "row-green") || ""} key={currUsage._id}>{text}</td>

        });

    }
}

export default ViewUsage;