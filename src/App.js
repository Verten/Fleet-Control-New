/**
 * Created by ebinhon on 2/26/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link,hashHistory } from 'react-router';
import App from './components/App/App.js';
import IndexPage from './components/Page/Index/Index';
import CreatePage from './components/Page/Create/CreatePage';
import DashboardPage from './components/Page/Dashboard/DashboardPage';
import NotFound from './components/Page/NotFound/NotFound.js';

//With JSX
//React.render(
//
//    <Router history={hashHistory}>
//        <Route path="/" component={App}>
//            <Route path="about" component={About} />
//            <Route path="index" component={Index} />
//        </Route>
//    </Router>
//    ,
//    document.getElementById('app')
//
//);

//config
const router_Config = [
    {
        path: '/',
        component: App,
        indexRoute: {component:IndexPage},
        childRoutes:[
            {
                path: 'create/:fleetId',
                component: CreatePage
            },
            {
                path: 'fleetcontroldashboard/:tripId',
                component: DashboardPage
            },
            //{
            //    path: 'about',
            //    component: About
            //},
            //{
            //    path: 'comment',
            //    component: Comment
            //},
            {   //should always be last
                path: '*',
                component: NotFound,
            }
        ]
    },
    {
        path: '*',
        component: NotFound,
    }
];

//in primary
// remote: http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary/2da7a80e-baca-40d0-8703-ec95ff499505/_/driverdashboard-1/
//local: /Asset/data/comment.json

ReactDOM.render(
    <Router routes={router_Config} history={hashHistory} />
    ,
    document.getElementById('app')
)