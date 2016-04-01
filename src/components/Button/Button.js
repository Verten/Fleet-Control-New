/**
 * Created by ebinhon on 3/1/2016.
 */
import React from 'react';
import './Button.scss';
export default class Button extends React.Component {
    propTypes = {
		     //React.PropTypes.string.isRequired,
		     //React.PropTypes.bool,
		     //React.PropTypes.object,
		     //React.PropTypes.oneOf(['value1', 'value2'])
		     //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
            content: React.PropTypes.string.isRequired,
            style: React.PropTypes.string,
            clickFunction: React.PropTypes.func
    }

    defaultProps = {
            content: '',
            style: 'button'
    }
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        return(
            <button className={this.props.style} onClick={this.props.clickFunction}>{this.props.content}</button>
        );
    }
}

