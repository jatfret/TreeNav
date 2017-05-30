import React from 'react';
import ReactDOM from 'react-dom';
import ReactAddons from 'react-addons';
import styles from './Button.scss';

let ReactTransitionGroup = ReactAddons.TransitionGroup;

console.log(styles);
console.log(ReactTransitionGroup);

export default class Button extends React.Component {
	render(){
		return (
			<button className={styles.normal}>submit</button>
		)
	}
}