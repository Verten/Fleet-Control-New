/**
 * Created by ebinhon on 3/21/2016.
 */
import React from 'react';
import { Link } from 'react-router';

export default class Table extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        header:React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        data:React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    }

    static defaultProps = {
        header:[""],
        data:null
    }

    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount(){

    }

    renderHeader(){
        let header_String = this.props.header;
        let header_Item = [];
        let class_name = "";//sorting
        for(let index in header_String){
            if(index == header_String.length){
                class_name = "";
            }
            header_Item.push(
                <th key={index} className={class_name} tabIndex="0" aria-controls="myTable" rowSpan="1" colSpan="1">{header_String[index]}</th>
            );
        }
        return header_Item;
    }

    expandJSONObject(jsonObject){
        let keys = [];
        for(let key in jsonObject){
            keys.push(
              key
            );
        }
        return keys;
    }

    expandData(data){
        let data_Line = [];
        if(data.operation){
            for(let index in data){
                if(index == "id" || index == "operation"){
                    continue;
                }
                let content = data[index];
                let event_icon = <label></label>;
                if(index =="event" && data.event){
                    content = data.event[0].message;
                    for(let j in data.event){
                        if(data.event[j].type == "normal"){
                            event_icon = <img src=""/>
                        }else if(data.event[j].type == "warning"){
                            event_icon = <img src=""/>
                        }
                    }
                }
                data_Line.push(
                    <td onClick={this.props.clickFunction.bind(this,data.id)} key={index}>
                        {event_icon}{content}
                    </td>
                );
            }
            //add operation
            data_Line.push(
                <td key="view">
                    <Link onClick={this.props.changeLinkFunction.bind(this)} to={{ pathname: '/fleetcontroldashboard/' + data.id }}>View</Link>
                </td>
            );
            //end
        }else{
            for(let index in data){
                if(index == "id" || index == "operation"){
                    continue;
                }
                let content = data[index];
                let event_icon = <label></label>;
                if(index =="event" && data.event){
                    content = data.event[0].message;
                    for(let j in data.event){
                        if(data.event[j].type == "normal"){
                            event_icon = <img src=""/>
                        }else if(data.event[j].type == "warning"){
                            event_icon = <img src=""/>
                        }
                    }
                }
                data_Line.push(
                    <td onClick={this.props.clickFunction.bind(this,data.id)} key={index}>
                        {event_icon}{content}
                    </td>
                );
            }
        }
        return data_Line;
    }

    renderData(){
        let data = this.props.data;
        let data_Item = [];
        if(data == null || data == undefined || data.length == 0){
            return data_Item;
        }else{
            for(let index in data){
                let style = "";
                if(index % 2 == 0){
                    style = "even";
                }else{
                    style = "odd";
                }
                data_Item.push(
                    <tr key={index} className={style} >
                        {this.expandData(data[index])}
                    </tr>
                );
            }
        }
        return data_Item;
    }

    render() {
        return(
            <table id="myTable" className="display dataTable no-footer" role="grid">
                <thead>
                    <tr role="row">
                        {this.renderHeader()}
                    </tr>
                </thead>
                <tbody>
                        {this.renderData()}
                </tbody>
            </table>
        );
    }
}