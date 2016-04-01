/**
 * Created by ebinhon on 3/28/2016.
 */
import React from 'react';

export default class Select extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html

    }

    static defaultProps = {

    }

    constructor() {
        super();
        this.state = {
            data:{

            },
            value:null
        }
    }

    componentDidMount(){

    }


    renderOption(options){
        let options_item = [];
        for(let index in options){
            options_item.push(
                <option value={options[index].value} key={index}>
                    {options[index].name}
                </option>
            );
        }
        return options_item;
    }

    render() {
        return(
            <div style={{"display":"inline-block"}}>
                <select id={this.props.data.type} name={this.props.data.type} onChange={this.props.onChangeSelect.bind(this)}>
                    {this.renderOption(this.props.data.options)}
                </select>
            </div>
        );
    }
}