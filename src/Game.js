import React, { Component } from 'react';
import Cell from './Cell';
import './Game.css';

const EMPTY = 0;
const SHIP = 1;


const generateGridArray = () => {
  const array = [];

  while (array.length < 100) {
    array.push(0);
  }

  return array;
};

export default class Game extends Component {
  constructor(props)  {
    super(props);

    this.state = {
      cells: generateGridArray(),
      // TODO: Change value back to 25
      torpedos: 5,
      ships: 0,
      shipLocations: [],
      status: '',
      hits: 0,
      misses: 0
    };
  }

  componentWillMount() {
    this.placeShips(5);
  }

  handleClick(e, index) {
    console.log(this.state);
    const { torpedos, ships, shipLocations, hits, misses } = this.state;
    const newTorpedoCount = torpedos - 1;
    let newShipsCount = ships;
    let newShipLocations = shipLocations;
    let indexOfHitShip;
    let newHitCount = hits;
    let newMissCount = misses;

    if (newTorpedoCount >= 0) {
      if (this.state.cells[index] === SHIP) {
        console.log('HIT');
        indexOfHitShip = newShipLocations
        newShipsCount--;
        newHitCount++;
      } else{
        newMissCount++;
      }

      this.setState({
        torpedos: newTorpedoCount,
        ships: newShipsCount,
        shipLocations: newShipLocations,
        hits: newHitCount,
        misses: newMissCount
      });
    }
  }

  generateIndex() {
    return Math.floor(Math.random() * Math.floor(100));
  }

  placeShips(num) {
    const { cells, ships, shipLocations } = this.state;
    const newCells = cells;
    let newShipsCount = ships;
    const newShipLocations = [];
    let idx = this.generateIndex();

    while (newShipLocations.length < num) {
      if (newCells[idx] === EMPTY) {
        newCells[idx] = SHIP;
        newShipLocations.push(idx);
        newShipsCount++;
      } else {
        idx = this.generateIndex();
      }
    }

    this.setState({
      cells: newCells,
      ships: newShipsCount,
      shipLocations: newShipLocations
    })
  }

  render() {
    const renderSquares = this.state.cells.map((element, index) =>
      <Cell
        key={index}
        id={index}
        onClick={e => this.handleClick(e, index)}
        status={this.state.status}
      />
    );

    return (
      <div className="Container">
        <div className="Info">
          You have {this.state.torpedos} torpedos left
          There are {this.state.ships} ships remaining on the board
          Hits: {this.state.hits}
          Misses: {this.state.misses}
        </div>
        <div className="Grid">
          {renderSquares}
        </div>
      </div>
    )
  }
}
