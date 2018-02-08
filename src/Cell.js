import React, { Component } from 'react';
import './Cell.css';

export default class Cell extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Cell" id={this.props.id} onClick={this.props.onClick}>{this.props.id}</div>
    )
  }
}
