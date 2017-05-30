import React, { Component } from 'react';
import CommentList from './list';
import Promised from './Promised';

class CommentsListContainer extends Component {
  render() {
    return <CommentList data={this.props.comments} />
  }
}

module.exports = Promised("comments", CommentsListContainer);
