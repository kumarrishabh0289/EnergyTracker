import React, { Component } from 'react';

class Statistics extends Component {
    state = {}
    render() {
        return (
            <div className="statistics-wrapper">
                <h4>Statistics Page</h4>

                <div className="table-container">
                    <div className="col-sm-4 electricity-table">

                    </div>
                    <div className="col-sm-4 gas-table"></div>
                    <div className="col-sm-4 carbon-table"></div>
                </div>
            </div>
        );
    }
}

export default Statistics;