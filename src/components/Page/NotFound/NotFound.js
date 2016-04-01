/**
 * Created by ebinhon on 3/2/2016.
 */
import React from 'react';
import Header from '../../Header/Header.js';
import Content from '../../Content/Content.js';
import Footer from '../../Footer/Footer.js';

export default class NotFound extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        return(
            <div className="notFoundPage">
                <Header className="notFoundPage_header" content="NotFound Page Header"/>
                <Content className="notFoundPage_content" content="404 Not Found"/>
                <Footer className="notFoundPage_footer" content="NotFound Page Footer"/>
            </div>
        );
    }
}