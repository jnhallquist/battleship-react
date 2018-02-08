import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Info extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th></th>
            <th>Torpedos</th>
            <th>Ships</th>
            <th>Hits</th>
            <th>Misses</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>{this.props.torpedos}</td>
            <td>{this.props.ships}</td>
            <td>{this.props.hits}</td>
            <td>{this.props.misses}</td>
          </tr>
        </tbody>
      </Table>
    )
  }
}
