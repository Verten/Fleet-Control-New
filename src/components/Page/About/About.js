/**
 * Created by ebinhon on 3/2/2016.
 */
import React from 'react';
import '../Page.scss';
import './About.scss';
import Header from '../../Header/Header.js';
import Content from '../../Content/Content.js';
import Footer from '../../Footer/Footer.js';

export default class AboutPage extends React.Component {
    constructor() {
        super();
        this.state = {
            init:true
        }
    }
    render() {
        return(
            <div className="page">
                <Header style="aboutPage_header" content="About Page Header"/>
                <Content style="aboutPage_content" content="Hello About Page"/>
                <Footer style="aboutPage_footer" content="About Page Footer"/>
            </div>
        );
    }
}