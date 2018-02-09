import React, { Component } from 'react';
import Info from './Info';
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
  constructor(props) {
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
    this.placeShips();
  }

  generateIndex() {
    return Math.floor(Math.random() * Math.floor(100));
  }

  placeShips() {
    const newShipLocations = [
      this.createShip(5),
      this.createShip(4),
      this.createShip(4),
      this.createShip(3),
      this.createShip(3),
      this.createShip(2),
      this.createShip(2),
      this.createShip(1)
    ];

    this.setState({
      ships: newShipLocations.length,
      shipLocations: newShipLocations
    });

    console.log(newShipLocations);
  }

  createShip(size) {
    const newShip = {
      size,
      location: []
    };

    const orientation = this.determineOrientation();

    let index = this.generateIndex();
    let isValidShip = this.validateShip(index, size, orientation);

    do {
      index = this.generateIndex();
      isValidShip = this.validateShip(index, size, orientation);
    }
    while (!isValidShip);

    newShip.location = this.getShipLocation(index, size, orientation);

    return newShip;
  }

  validateShip(index, size, orientation) {
    return this.inBounds(index, size, orientation)
      && this.isOpenZone(index, size, orientation)
      && this.hasClearance(index);
  }

  determineOrientation() {
    const num = Math.floor(Math.random() * 10);
    return num % 2 === 0 ? 'vertical' : 'horizontal';
  }

  hasClearance(index) {
    // check if cell and adjacent cells are empty
    return (this.state.cells[index] !== SHIP)
      && (this.state.cells[index - 1] !== SHIP)
      && (this.state.cells[index + 1] !== SHIP)
      && (this.state.cells[index + 10] !== SHIP)
      && (this.state.cells[index - 10] !== SHIP);
  }

  inBounds(index, size, orientation) {
    let endBoundary, endIndex;

    if (orientation === 'vertical') {
      endBoundary = (index % 10) + 91;
      endIndex = index + (10 * (size - 1));
    } else if (orientation === 'horizontal') {
      endBoundary = Math.ceil(index / 10) * 10;
      endIndex = index + (size - 1);
    }

    return endIndex < endBoundary;
  }

  isOpenZone(index, size, orientation) {
    // check if there are enough open spaces for ship
    let endBoundary;

    if (orientation === 'vertical') {
      for (let i = index; i < size; i += 10) {
        if (!this.state.cells[i] || this.state.cells[i] === SHIP) {
          return false;
        }
      }
    } else if (orientation === 'horizontal') {
      endBoundary = Math.floor(index / 10) + 10;
      for (let i = index; i < size; i++) {
        if (i >= endBoundary || !this.state.cells[i] || this.state.cells[i] === SHIP) {
          return false;
        }
      }
    }

    return true;
  }

  getShipLocation(index, size, orientation) {
    const location = [];

    if (orientation === 'vertical') {
      for (let i = index; i <= (index + (10 * size)) - 10; i += 10) {
        location.push(i);
      }
    } else if (orientation === 'horizontal') {
      for (let j = index; j < (index + size); j++) {
        location.push(j);
      }
    }

    this.updateCells(location);
    return location;
  }

  handleClick(e, index) {
    const {
      torpedos, ships, shipLocations, hits, misses
    } = this.state;
    const newTorpedoCount = torpedos - 1;
    const newShipLocations = shipLocations;
    let newShipsCount = ships;
    let indexOfHitShip;
    let newHitCount = hits;
    let newMissCount = misses;
    let idx1;
    let idx2;

    // Check if user still has torpedos remaining
    if (newTorpedoCount >= 0) {
      // Check if cell has a SHIP at index
      if (this.state.cells[index] === SHIP) {
        // Increment HIT count only if shipsLocations still contains element
        for (let i = 0; i < newShipLocations.length; i++) {
          if (newShipLocations[i].location.includes(index)) {
            idx1 = i;
            idx2 = newShipLocations[idx1].location.indexOf(index);

            newShipLocations[idx1].location.splice(idx2, 1);
            newShipsCount--;
            newHitCount++;
          }
        }
      } else {
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

  updateCells(array) {
    const newCellArray = this.state.cells;

    for (let i = 0; i < array.length; i++) {
      newCellArray[array[i]] = SHIP;
    }

    this.setState({ cells: newCellArray });
    console.log(this.state.cells);
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
          <Info
            torpedos={this.state.torpedos}
            ships={this.state.ships}
            hits={this.state.hits}
            misses={this.state.misses}
          />
        </div>
        <div className="Grid">
          {renderSquares}
        </div>
      </div>
    )
  }
}
