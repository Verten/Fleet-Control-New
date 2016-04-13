/**
 * Created by ebinhon on 3/21/2016.
 */
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

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

    renderEvent(data,style){
        let data_Line = [];
        //let tmpEvent = {
        //    "createDate": moment(events[i].created),
        //    "type": events[i].type,
        //    "message": events[i].message
        //}
        for(let index in data){
            if(data[index].message == "-"){
                continue;
            }
            let event_icon = "";
            let createDate = moment(data[index].createDate).format("YYYY-MM-DD HH:mm");
            let type = data[index].type;
            let message = data[index].message;
            if(data[index].type.toLowerCase() == "info"){
                event_icon = <img className="small_event_image" src="../../images/icon_info-01.svg" alt="info"/>;
            }else if(data[index].type.toLowerCase() == "warning"){
                event_icon = <img className="small_event_image" src="../../images/icon_warning-01.svg" alt="warning"/>;
            }
            data_Line.push(
                <tr key={index} className={style} >
                    <td onClick={this.props.clickFunction.bind(this,data.type)} key="time">
                        {createDate}
                    </td>
                    <td className="event_panel_image" onClick={this.props.clickFunction.bind(this,data.type)} key="event">
                        {event_icon}{type}
                    </td>
                    <td onClick={this.props.clickFunction.bind(this,data.type)} key="message">
                        {message}
                    </td>
                </tr>
            );
        }

        return data_Line;
    }

    expandData(data){
        let data_Line = [];
        if(!data){
            return data_Line;
        }
        if(data.operation){
            for(let index in data){
                if(index == "id" || index == "operation"){
                    continue;
                }
                let content = data[index];
                let event_icon = <label></label>;
                if(index =="event" && data.event){
                    content = data.event[0].message;
                    if(data.event[0].type == "normal"){
                        event_icon = <img src=""/>
                    }else if(data.event[0].type == "warning"){
                        event_icon = <img className="small_event_image" src="../../images/icon_warning-01.svg" alt="warning"/>
                    }
                    data_Line.push(
                        <td className="event_panel_image" onClick={this.props.clickFunction.bind(this,data.id)} key={"event"+index}>
                            {event_icon}{content}
                        </td>
                    );
                }else{
                    data_Line.push(
                        <td onClick={this.props.clickFunction.bind(this,data.id)} key={index}>
                            {event_icon}{content}
                        </td>
                    );
                }
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
                //if(index =="event" && data.event){
                //    content = data.event.message;
                //    for(let j in data.event){
                //        if(data.event[j].type == "normal"){
                //            event_icon = <img src=""/>
                //        }else if(data.event[j].type == "warning"){
                //            event_icon = <img src=""/>
                //        }
                //    }
                //}
                data_Line.push(
                    <td onClick={this.props.clickFunction.bind(this,data)} key={index}>
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
        console.log(data);
        if(this.props.data.length == 0){
            return data_Item;
        }
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

                if(this.props.tableType == "event"){//render event table //data[index].event && data.length <= 1
                    data_Item.push(
                        this.renderEvent(data[index].event,style)
                    );
                }else{
                    data_Item.push(
                        <tr key={index} className={style} >
                            {this.expandData(data[index])}
                        </tr>
                    );
                }
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