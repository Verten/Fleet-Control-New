/**
 * Created by ebinhon on 2/26/2016.
 */
import React from 'react';

export default class Text extends React.Component {
    constructor() {
        super();
        this.state = {
            init:true
        }
    }
    render() {
        return(
            <div className={this.props.style}>Hello {this.props.text} !
                <div className={this.props.style + '_content'}>{this.props.children}</div>
            </div>
        );
    }
}