/**
 * Created by ebinhon on 3/2/2016.
 */
import React from 'react';
import './Comment.scss';
import '../Page.scss';
import Header from '../../Header/Header';
import Content from '../../Content/Content.js';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import List from '../../List/List';
import CommentStore from '../../../Store/CommentStore';
import connectToStores from 'alt-utils/lib/connectToStores';

export default class Comment extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html

    }

    static defaultProps = {}

    constructor() {
        super();
        this.state = {}
    }


    componentDidMount() {

    }

    // need to using this.handle_Comment.bind(this), or the this.refs will do not work.
    handle_Comment() {
        let comment_value = this.refs.comment_value.state.input_value;
        if ("" != comment_value && comment_value != undefined) {
            this.refs.comment_list.updateData(comment_value);
            this.refs.comment_value.reset();
        }
    }

    render() {
        return (
            <div className="page">
                <Header style="commentPage_header" content="Comment Header"/>
                <Content style="commentPage_content" content="">
                    <List ref="comment_list" data={this.props.comments}/>
                    <Input ref="comment_value" value="Input your comment"/>
                    <Button clickFunction={this.handle_Comment.bind(this)} style="comment_button" content="Submit"/>
                </Content>
            </div>
        );
    }
}