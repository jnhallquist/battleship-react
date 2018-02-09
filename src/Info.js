import React, { Component } from 'react';
import './Info.css';

const RESULTS_TEXT = {
  win: 'You win!',
  lose: 'You lost'
};

export default class Info extends Component {
  render() {
    return (
      <div className="Info-container">
        <div className={`game-over ${this.props.gameResult}`}>
          {RESULTS_TEXT[this.props.gameResult]}
        </div>
        <table>
          <thead>
            <tr>
              <th>Torpedos</th>
              <th>Ships</th>
              <th>Hits</th>
              <th>Misses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.torpedos}</td>
              <td>{this.props.ships}</td>
              <td>{this.props.hits}</td>
              <td>{this.props.misses}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
