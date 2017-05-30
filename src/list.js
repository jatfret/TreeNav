import React, { Component } from 'react';

function CommentList(props) {
  return (
    <ul className="comment-box">
      {props.data.map((entry, i)=>{
        return (
          <li key={`response-${i}`} className="comment-item">
            <p className="comment-item-name">{entry.name}</p>
            <p className="comment-item-content">{entry.content}</p>
          </li>
        )
      })}
    </ul>
  );
}

module.exports  = CommentList;
