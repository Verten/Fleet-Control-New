import React from 'react';
import Text from '../Text/Text.js';

export default class Header extends React.Component{
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        return (
            <Text style={this.props.style} text={this.props.content}>
                {this.props.children}
            </Text>
        )
    }
}