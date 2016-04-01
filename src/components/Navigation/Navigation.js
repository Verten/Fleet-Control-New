/**
 * Created by ebinhon on 3/22/2016.
 */
import React from 'react';
import AppInfoStore from '../../Store/AppInfoStore';
import { Link } from 'react-router';
import './Navigation.scss';
import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
export default class Navigation extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        links:React.PropTypes.arrayOf(React.PropTypes.object).isRequired

    }

    static defaultProps = {
        //back link should be always put last
        links:[
            {
                name: "Create",
                path:"/create/",
                param:"fleetId"
            },
            {
                name: "Back",
                path:"/",
                param: ""
            }
        ]
    }

    static getStores() {
        // this will handle the listening/unlistening for you
        return [AppInfoStore];
    }

    static getPropsFromStores() {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let linkChanged = AppInfoStore.getState().linkChanged;
        return {
            linkChanged: linkChanged
        }
    }

    constructor() {
        super();
        this.state = {
            changed:false
        }
    }

    componentDidMount(){

    }

    renderLinks(){
        let links = this.props.links;
        let links_item = [];
        for(let index in links){
            if(!this.props.linkChanged){
                if(index == links.length - 1 ){
                    continue;
                }else{
                    links_item.push(
                        <Link onClick={this.props.clickFunction.bind(this)} key={index} to={{ pathname: links[index].path + links[index].param }}>{links[index].name}</Link>
                    );
                }
            }else{
                if(index == links.length - 1 ){
                    links_item.push(
                        <Link onClick={this.props.clickFunction.bind(this)} key={index} to={{ pathname: links[index].path + links[index].param }}>{links[index].name}</Link>
                    );
                }else{
                    continue;
                }
            }
        }
        return links_item;
    }

    render() {
        return(
            <ul>
                <li className="button_create">
                    {this.renderLinks()}
                </li>
            </ul>
        );
    }
}