import React, { Component } from 'react';
import './Instructions.css';

export default class Instructions extends Component {
  render() {
    return (
      <div className="Instructions-container">
        <h4 className="Title">How to Play</h4>
        <p>
          You will be playing against a computer. Its name is Tom.
        </p>

        <p>
          Tom has placed 8 ships on the board.
        </p>

        <p>
          Each ship takes up a different block length ranging from 1 block
          to 5.
        </p>

        <p>
          Using 35 torpedos or fewer, you must guess the positions of the ships.
          To sink a ship, you must hit all of a ship's blocks.
        </p>

        <p>
          The game ends when you run out of torpedos or sink 8 ships.
        </p>
      </div>
    )
  }
}
