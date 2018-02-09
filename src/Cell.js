import React, { Component } from 'react';
import CONDITIONS from './Conditions';
import './Cell.css';

export default class Cell extends Component {
  color(status) {
    if (status === CONDITIONS.hit) {
      return 'green';
    } else if (status === CONDITIONS.miss) {
      return 'red';
    } else if (status === CONDITIONS.reveal) {
      return 'blue';
    }

    return 'white';
  }

  render() {
    let currentColor = this.color(this.props.cells[this.props.id]);
    return (
      <div className="Cell" style={{backgroundColor: currentColor}} id={this.props.id} onClick={this.props.onClick}>{this.props.id}</div>
    )
  }
}
