/**
 * Created by ebinhon on 3/3/2016.
 */
import React from 'react';
import './List.scss';

export default class List extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        children: React.PropTypes.element.isRequired,
        style: React.PropTypes.string
    }

    static defaultProps = {
        style: 'list',
    }

    constructor() {
        super();
        this.state = {
            //default
            data:[]
        }
    }

    componentDidMount(){

    }
    //always using setState to update the component
    updateData(data){
        let exists_comment = this.props.data;
        exists_comment.push({
            data: data
        });
        this.setState({
            //call setState to update component
        });
    }
    renderComment(){
        console.log('init comment');
        let exists_comment = this.props.data;
        let comment_items = [];
        for (let index in exists_comment){
            comment_items.push(
                <div>
                    <p>
                        {exists_comment[index].data}
                    </p>
                </div>
            );
        }
        return comment_items;
    }

    render() {
        return(
            <div className={this.props.style}>
                {this.renderComment()}
                {this.props.children}
            </div>
        );
    }
}