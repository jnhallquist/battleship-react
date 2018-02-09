import React, { Component } from 'react';
import Info from './Info';
import Cell from './Cell';
import CONDITIONS from './Conditions';
import './Game.css';

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
      torpedos: 35,
      ships: 0,
      shipLocations: [],
      hits: 0,
      misses: 0,
      gameResult: ''
    };
  }

  componentWillMount() {
    this.placeShips();
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
  }

  generateIndex() {
    return ~~(Math.random() * 100);
  }

  determineOrientation() {
    return this.generateIndex() % 2 === 0 ? 'vertical' : 'horizontal';
  }

  createShip(size) {
    const newShip = {
      size,
      location: []
    };

    const orientation = this.determineOrientation();

    let index = this.generateIndex();
    let isValidShip = this.validateShip(index, size, orientation);

    while (!isValidShip) {
      index = this.generateIndex();
      isValidShip = this.validateShip(index, size, orientation);
    }

    newShip.location = this.getShipLocation(index, size, orientation);

    return newShip;
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

  hasClearance(index, size, orientation) {
    let noCollisions = true;

    if (orientation === 'vertical') {
      for (let i = 0; i < size + 2; i++) {
        if (this.state.cells[(index - 10) + (i * 10)] ||
            this.state.cells[(index - 11) + (i * 10)] ||
            this.state.cells[(index - 9) + (i * 10)]
        ) {
          noCollisions = false;
        }
      }
    } else if (orientation === 'horizontal') {
      for (let i = 0; i < size + 2; i++) {
        if (this.state.cells[(index - 11) + i] ||
            this.state.cells[(index + 9) + i] ||
            this.state.cells[(index - 1) + i]
        ) {
          noCollisions = false;
        }
      }
    }

    return noCollisions;
  }

  validateShip(index, size, orientation) {
    return this.inBounds(index, size, orientation)
      && this.hasClearance(index, size, orientation);
  }

  updateCells(array) {
    const newCellArray = this.state.cells;

    for (let i = 0; i < array.length; i++) {
      newCellArray[array[i]] = CONDITIONS.ship;
    }

    this.setState({ cells: newCellArray });
  }

  revealBoard() {
    const { cells } = this.state;

    cells.forEach((el, idx) => {
      if (el === CONDITIONS.ship) {
        cells[idx] = CONDITIONS.reveal;
      }
    });

    this.setState({ cells });
  }

  gameOver(status) {
    let result;

    if (status === 'win') {
      result = 'You win!';
    } else {
      this.revealBoard();
    }

    this.setState({
      gameResult: result || 'You lost'
    });

    // TODO: unbind listeners
  }

  handleClick(e, index) {
    const {
      torpedos, ships, shipLocations, hits, misses
    } = this.state;
    const newTorpedoCount = torpedos - 1;
    const newShipLocations = shipLocations;
    const updatedCells = this.state.cells;
    let newShipsCount = ships;
    let newHitCount = hits;
    let newMissCount = misses;
    let idx1;
    let idx2;

    if (this.state.cells[index] > 1 || this.state.torpedos === 0) {
      return;
    }

    if (newTorpedoCount > 0) {
      if (this.state.cells[index] === CONDITIONS.ship) {
        for (let i = 0; i < newShipLocations.length; i++) {
          if (newShipLocations[i].location.includes(index)) {
            idx1 = i;
            idx2 = newShipLocations[idx1].location.indexOf(index);

            newShipLocations[idx1].location.splice(idx2, 1);
            updatedCells[index] = CONDITIONS.hit;

            if (!newShipLocations[idx1].location.length) {
              newShipsCount--;

              if (newShipsCount === 0) {
                this.gameOver('win');
              }
            }

            newHitCount++;
          }
        }
      } else {
        updatedCells[index] = CONDITIONS.miss;
        newMissCount++;
      }
    } else {
      updatedCells[index] = CONDITIONS.miss;
      this.gameOver();
    }

    this.setState({
      torpedos: newTorpedoCount,
      ships: newShipsCount,
      shipLocations: newShipLocations,
      hits: newHitCount,
      misses: newMissCount,
      cells: updatedCells
    });
  }

  render() {
    const renderSquares = this.state.cells.map((element, index) =>
      <Cell
        key={index}
        id={index}
        onClick={e => this.handleClick(e, index)}
        cells={this.state.cells}
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
            gameResult={this.state.gameResult}
            conditions={this.state.conditions}
          />
        </div>
        <div className="Grid">
          {renderSquares}
        </div>
      </div>
    );
  }
}
