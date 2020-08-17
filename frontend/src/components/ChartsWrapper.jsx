import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Charts from './Charts';
import "../styles/Usage.css";
import WeeklyChart from './WeeklyChart';

class ChartsWrapper extends Component {
    state = {}
    render() {
        console.log(this.props);
        return (
            <div className="charts-component-wrapper">
                <Tabs defaultActiveKey="electricity" id="uncontrolled-tab-example" className="w-100 d-flex">
                    <Tab eventKey="electricity" title="Electricity">
                        <Charts data={this.props.data} param="electricity" />
                    </Tab>
                    <Tab eventKey="gas" title="Natural Gas">
                        <Charts data={this.props.data} param="gas" />
                    </Tab>
                    <Tab eventKey="average" title="Weekly Average">
                        <WeeklyChart data={this.props.data} />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default ChartsWrapper;