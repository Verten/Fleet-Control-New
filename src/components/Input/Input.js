/**
 * Created by ebinhon on 3/3/2016.
 */
import React from 'react';

export default class Input extends React.Component {
    static propTypes = {
       //React.PropTypes.string.isRequired,
       //React.PropTypes.bool,
       //React.PropTypes.object,
       //React.PropTypes.oneOf(['value1', 'value2'])
       //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        value: React.PropTypes.string.isRequired,
        name: React.PropTypes.string,
        style: React.PropTypes.string
    }

    static defaultProps = {
        value: '',
        name: 'text',
        style: 'input_text'
    }

    constructor() {
        super();
        this.state = {
            input_value: ''
        }
    }

    changeValue(event) {
        this.setState({
            input_value: event.target.value
        });
    }

    reset(){
        this.setState({
            input_value: ''
        });
    }

    render() {
        return(
            <input type="text" onBlur={this.props.blurFunction.bind(this,this.state.input_value,this.props.name)} className={this.props.style} name={this.props.name} value={this.state.input_value} onChange={this.changeValue.bind(this)} />
         );
    }
}