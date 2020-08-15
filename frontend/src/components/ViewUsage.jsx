import React, { Component, Fragment } from 'react';
import Axios from 'axios';
import { API_URL } from '../Constants';
import "../styles/Usage.css";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ChartsWrapper from './ChartsWrapper';

class ViewUsage extends Component {
    state = {
        usageData: [],
        selfData: [],
        labelData: ["Date", "Electricity (kWh)", "Gas (therms)"],
        showNames: false
    };

    componentDidMount = () => {

        Axios.get(`${API_URL}/usage/getAllUsage/${this.props.match.params.projectId}?user=${sessionStorage.authenticatedUser}`).then(response => {
            console.log(response);
            this.setState({ usageData: response.data.data, selfData: response.data.selfUsage });
        });

    };

    render() {
        const selfData = this.state.selfData;

        const dateDifference = selfData.length && (new Date(selfData[0].project.ConservationStartDate) - new Date(selfData[0].project.StartDate)) / (1000 * 3600 * 24);

        const totalDays = selfData.length && ((new Date(selfData[0].project.EndDate) - new Date(selfData[0].project.StartDate)) / (1000 * 3600 * 24));
        const remainingDays = totalDays - dateDifference;

        return (
            <div className="edit-wrapper card mt-4 col-sm-11 mx-auto p-3">
                <h2 className="mb-4">Usage Details </h2>

                <h4 className="mb-5">Project: {selfData.length && selfData[0].project.name}</h4>

                <Tabs defaultActiveKey="charts" id="uncontrolled-tab-example">
                    <Tab eventKey="usage" title="Usage">
                        {
                            sessionStorage.getItem("role") == "Student" ? "" : <Form.Group controlId="formBasicCheckbox">
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
                                                    <div className="bordered-name mt-4"><div>{this.state.hideNames ? data : `Student ${index + 1}`}</div></div>
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
                        </div>


                    </Tab>
                    <Tab eventKey="charts" title="Charts">
                        <ChartsWrapper data={this.state} />
                    </Tab>
                    <Tab eventKey="emissions" title="Carbon Emissions">
                        <div>zxc</div>
                    </Tab>
                    <Tab eventKey="statistics" title="Statistics">
                        <div>zxc</div>
                    </Tab>
                </Tabs>


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