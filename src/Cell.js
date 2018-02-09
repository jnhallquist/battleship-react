import React, { Component } from 'react';
import './Cell.css';

export default class Cell extends Component {
  constructor(props) {
    super(props);
  }

  color(state) {
    if (state == 2) {
      return 'green';
    } else if (state == 3) {
      return 'red'
    } else {
      return 'white'
    }
  }

  render() {
    let currentColor = this.color(this.props.cells[this.props.id]);
    return (
      <div className="Cell" style={{backgroundColor: currentColor}} id={this.props.id} onClick={this.props.onClick}>{this.props.id}</div>
    )
  }
}
