/**
 * Created by ebinhon on 2/29/2016.
 */
import React from 'react';
import Text from '../Text/Text.js';

export default class Footer extends React.Component{
    constructor(){
        super();
        this.state = {
          init:true
        };
    }
    render(){
        return (
            <Text style={this.props.style} text={this.props.content}>
                {this.props.children}
            </Text>

        );
    }
}