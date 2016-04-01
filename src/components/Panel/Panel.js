/**
 * Created by ebinhon on 3/22/2016.
 */
import React from 'react';
import Input from '../Input/Input';
import DateTimeField from 'react-datetime';
import Select from '../Select/Select';

export default class Panel extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        title: React.PropTypes.string.isRequired
    }

    static defaultProps = {
        title: "",
        data: []
    }

    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {
    }

    expandJSONObject(jsonObject) {
        let keys = [];
        for (let key in jsonObject) {
            keys.push(
                key
            );
        }
        return keys;
    }

    expandContent(data) {
        let tmpContent = [];
        let keys = this.expandJSONObject(data);
        let editable = false;
        let content_type = data.type;
        if (data.editable) {
            editable = true;
        }
        let label = <span className="bold_title">{data.label}:</span>;
        let label_value = "";
        if(editable){
            if(content_type == "plannedStartTime" || content_type == "plannedArriveTime"){
                label_value = <DateTimeField onChange={this.props.handleDate.bind(this,data.type)}/>;
            }else{
                label_value = <Input name={data.type} blurFunction={this.props.blurFunction.bind(this)}/>;
            }
        }else{
            label_value =  <span>{data.value}</span>;
        }

        if("quantity" == content_type && editable){
            let label_value_1 = <Input name={data.type} blurFunction={this.props.blurFunction.bind(this)}/>;
            let uom = {
                "type": "uom",
                "options": [
                    {
                        "name": "Stere",
                        "value": "stere"
                    },
                    {
                        "name": "Ton",
                        "value": "ton"
                    }
                ]
            }
            let label_value_2 = <Select data={uom} onChangeSelect={this.props.onChangeSelect.bind(this)}/>

            label_value = <div className="quantity_div" style={{"display":"inline-block"}}>
                {label_value_1}
                {label_value_2}
            </div>;
        }
        if ("cargo_name" == content_type && editable) {
            let cargo = {
                "type": "cargo",
                "options": [
                    {
                        "name": "Apple",
                        "value": "apple"
                    },
                    {
                        "name": "Banana",
                        "value": "banana"
                    },
                    {
                        "name": "Oil",
                        "value": "oil"
                    }
                ]
            }
            label_value = <Select data={cargo} onChangeSelect={this.props.onChangeSelect.bind(this)}/>
        }
        if ("vehicletype" == content_type && editable) {
            let vehicletype = {
                "type": "vehicletype",
                "options": [
                    this.props.vehicletypeoptions
                ]
            }
            label_value = <Select data={vehicletype} onChangeSelect={this.props.onChangeSelect.bind(this)}/>
        }
        tmpContent.push(
            <div key="key">
                {label}
                {label_value}
            </div>
        );
        return tmpContent
    }

    renderPanelContent() {
        let content = this.props.data;
        let contents = [];
        for (let index in content) {
            contents.push(
                <div key={index}>
                    {this.expandContent(content[index])}
                </div>
            );
        }
        return contents;
    }

    render() {
        return (
            <div className="info_panel">
                <div className="panel_title">{this.props.title}</div>
                <div className="panel_content">
                    {this.renderPanelContent()}
                </div>
                {this.props.children}
            </div>
        );
    }
}