import React, { Component } from 'react';
import Axios from 'axios';
import { API_URL } from '../Constants';

class EditUsage extends Component {
    state = {};

    componentDidMount = () => {

        // Axios.get(`${API_URL}/class/getRegisteredClasses/${sessionStorage.authenticatedUser}`).then(response => {
        //     this.setState({
        //         courses: response.data.courses,
        //         projects: response.data.projects
        //     })
        // })

    };

    render() {
        return (
            <div className="edit-wrapper">
                Edit Div
            </div>
        );
    }
}

export default EditUsage;