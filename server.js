var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
const commentList = [
  { "name": "cam", "content": "It's good idea!", "publishTime": "2015-05-01" },
  { "name": "arcthur", "content": "Not bad.", "publishTime": "2015-05-01" }
];

var app = express();
var compiler = webpack(config);
var webpackDevOptions = {
  noInfo: true,
  historyApiFailback: true,
  publicPath: config.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

app.use(require('webpack-dev-middleware')(compiler, webpackDevOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('public'));

app.get('/api/comments.json', function(req, res) {
  res.send({ 'commentList': commentList });
});

app.get('/api/nav', function(req, res){
  res.sendFile(path.join(__dirname, '/api/nav.json'));
});
app.get('/api/path_data', function(req, res){
  res.sendFile(path.join(__dirname, '/api/pathData.json'));
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname,'index.html'));
});


app.listen(8787, 'localhost', function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:8787');
});
