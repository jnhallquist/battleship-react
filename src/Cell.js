import React, { Component } from 'react';
import CONDITIONS from './util/Conditions';
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
    const currentColor = this.color(this.props.cells[this.props.id]);
    return (
      <div className={`cell ${currentColor}`}
           id={this.props.id}
           onClick={this.props.onClick}>
      </div>
    )
  }
}
