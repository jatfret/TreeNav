import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import CommentsListContainer from './commentsListContainer';
import Nav from './components/Nav/Nav';
import PathAnalysis from './components/pathAnalysis/pathAnalysis'
import EchartsSankey from './components/EchartsSankey/EchartsSankey'

function IndexPage(){
  return (
    <ul>
      <li><a href="/nav">入口功能导航</a></li>
      <li><a href="/pathAnalysis">路径分析</a></li>
      <li><a href="/EchartsSankey">路径分析(echarts)</a></li>
    </ul>
  )
}

function App(){
  return (
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={IndexPage}/>
        <Route path="/nav" component={Nav} />
        <Route path="/pathAnalysis" component={PathAnalysis} />
        <Route path="/EchartsSankey" component={EchartsSankey} />
      </Route>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));
