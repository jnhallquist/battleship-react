import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Info from './Info';
import Cell from './Cell';
import Instructions from './Instructions';
import CONDITIONS from './util/Conditions';
import array from './util/generateGridArray';
import './Game.css';

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: array(),
      torpedos: 35,
      ships: 0,
      shipLocations: [],
      hits: 0,
      misses: 0,
      gameResult: null,
      showInstructions: false
    };

    this.toggleInstructions = this.toggleInstructions.bind(this);
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

  // Check if there is enough room for this ship at this starting index
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

  // Check if this ship will not touch any other ship
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
    if (!status) {
      this.revealBoard();
    }

    this.setState({
      gameResult: status || 'lose'
    });

    // TODO: Unbind listeners
  }

  updateHit(index, cells) {
    const { shipLocations } = this.state;
    let { ships, hits } = this.state;

    let idx1;
    let idx2;

    for (let i = 0; i < shipLocations.length; i++) {
      if (shipLocations[i].location.includes(index)) {
        idx1 = i;
        idx2 = shipLocations[idx1].location.indexOf(index);

        shipLocations[idx1].location.splice(idx2, 1);
        cells[index] = CONDITIONS.hit;

        if (!shipLocations[idx1].location.length) {
          ships--;

          if (ships === 0) {
            this.gameOver('win');
          }
        }

        hits++;
      }
    }

    return {
      shipLocations,
      ships,
      hits
    };
  }

  updateMiss(index, cells) {
    cells[index] = CONDITIONS.miss;

    return {
      misses: this.state.misses + 1,
      cells
    };
  }

  handleClick(e, index) {
    const { cells } = this.state;
    let { torpedos } = this.state;
    let updatedState = {};

    if (cells[index] > 1 || torpedos === 0 || this.state.gameResult) {
      return;
    }

    torpedos -= 1;

    if (torpedos > 0) {
      if (cells[index] === CONDITIONS.ship) {
        updatedState = this.updateHit(index, cells);
      } else {
        updatedState = this.updateMiss(index, cells);
      }
    } else {
      cells[index] = CONDITIONS.miss;
      this.gameOver();
    }

    this.setState({
      torpedos,
      cells,
      ...updatedState
    });
  }

  toggleInstructions() {
    this.setState({ showInstructions: !this.state.showInstructions });
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
        <div className="Toolbar">
          <ButtonToolbar>
            <Button bsStyle="info" onClick={this.toggleInstructions}>
              Instructions
            </Button>
            <Button disabled>Reset</Button>
          </ButtonToolbar>
        </div>
        <div className="Instructions">
          { this.state.showInstructions ? <Instructions /> : null }
        </div>
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
