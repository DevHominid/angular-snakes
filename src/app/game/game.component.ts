import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as _ from 'lodash';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  species: Species;
  board: any;
  boardSize: number;
  mode: any;
  directions: Directions;
  snake: Snake;
  bait: Bait;
  score: number;
  isGameOver: boolean;
  initialLength: number;
  initialInterval: number;
  currentDirection: number;
  colors: Colors;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    // Set defaults
    this.boardSize = 15;
    this.directions = {
      left: 37,
      right: 39,
      up: 38,
      down: 40
    };
    this.score = 0;
    this.snake = {
      direction: this.directions.down,
      sections: [{
        x: 0,
        y: 0
      }]
    };
    this.bait = {
      x: 1,
      y: 0
    };

    // Grab mode param from URL
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.mode = params.get('mode');
        console.log(this.mode);
        return this.mode;
      })
      .subscribe((mode) => {
        this.setSpeciesDefault();

        // Init game board
        this.initBoard();
      });

    // Init event listeners
    document.querySelector('body').addEventListener('keyup', (e) => {
      if (e.keyCode == this.directions.left && this.snake.direction !== this.directions.right) {
        this.currentDirection = this.directions.left;
      } else if (e.keyCode == this.directions.up && this.snake.direction !== this.directions.down) {
        this.currentDirection = this.directions.up;
      } else if (e.keyCode == this.directions.right && this.snake.direction !== this.directions.left) {
        this.currentDirection = this.directions.right;
      } else if (e.keyCode == this.directions.down && this.snake.direction !== this.directions.up) {
        this.currentDirection = this.directions.down;
      }
    });
  }

  setSpeciesDefault() {
    if (this.mode === 'australia') {
      this.species = {
        name: 'coastal taipan',
        region: 'australia',
        length: '1.8 meters',
        diet: 'rodents, bandicoots, birds',
        behavior: 'extremely aggressive when cornered',
        url: 'assets/images/australia.png'
      }
    } else if (this.mode === 'africa') {
      this.species = {
        name: 'black mamba',
        region: 'africa',
        length: '2.5 meters',
        diet: 'rodents, bushbabies, birds',
        behavior: 'graceful but often unpredictable, shy and secretive by nature',
        url: 'assets/images/africa.png'
      }
    }
    else if (this.mode === 'southamerica') {
      this.species = {
        name: 'anaconda',
        region: 'south america',
        length: '5 meters',
        diet: 'fish, birds, mammals, reptiles',
        behavior: 'slow and sluggish on land, but can move quickly in water',
        url: 'assets/images/southamerica.png'
      }
    }
  }

  // Init game board
  initBoard() {
    // Set color scheme
    this.selectColorScheme();
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = false;
      }
    }
  }

  // Set dynamic styles
  setStyles(col, row) {
    if (this.isGameOver) {
      return this.colors.gameOver;
    } else if (this.bait.x == row && this.bait.y == col) {
      return this.colors.bait;
    } else if (this.snake.sections[0].x == row && this.snake.sections[0].y == col) {
      return this.colors.snakeHead;
    } else if (this.board[col][row] === true) {
      return this.colors.snakeBody;
    }
    return this.colors.board;
  }

  selectColorScheme() {
    if (this.mode === 'australia') {
      this.colors = {
        gameOver: '#FBFCFC',
        bait: '#4A4A4A',
        snakeHead: '#F1AB86',
        snakeBody: '#C57B57',
        board: '#BEA57D'
      };
      return this.colors;
    }
    else if (this.mode === 'africa') {
      this.colors = {
        gameOver: '#FBFCFC',
        bait: '#758E4F',
        snakeHead: '#080F0F',
        snakeBody: '#3D3D3E',
        board: '#DCCCA3'
      };
      return this.colors;
    }
    else if (this.mode === 'southamerica') {
      this.colors = {
        gameOver: '#FBFCFC',
        bait: '#7FC1BE',
        snakeHead: '#08605F',
        snakeBody: '#90AA86',
        board: '#177E89'
      };
      return this.colors;
    }
  }

  selectInitialInterval() {
    if (this.mode === 'australia') {
      this.initialInterval = 100;
      return this.initialInterval;
    } else if (this.mode === 'africa') {
      this.initialInterval = 115;
      return this.initialInterval;
    } else if (this.mode === 'southamerica') {
      this.initialInterval = 145;
      return this.initialInterval;
    }
  }

  selectInitialLength() {
    if (this.mode === 'australia') {
      this.initialLength = 3;
      return this.initialLength;
    } else if (this.mode === 'africa') {
      this.initialLength = 5;
      return this.initialLength;
    } else if (this.mode === 'southamerica') {
      this.initialLength = 10;
      return this.initialLength;
    }
  }

  // Init game
  initGame() {
    this.score = 0;
    this.snake = {direction: this.directions.down, sections: []};
    this.currentDirection = this.directions.down;
    this.isGameOver = false;
    this.selectInitialInterval();
    this.selectInitialLength();

    // init snake
    for (let i = 0; i < this.initialLength; i++) {
      this.snake.sections.push({x: 5, y: 5});
    }
    // Set bait
    this.resetBait();
    // Start updates
    this.updateGame();
  }

  updateGame = () => {
    // Grab next position
    const nextHead = this.getNextHead();

    // Check game boundaries and interactions
    if (this.touchEdge(nextHead) || this.touchSelf(nextHead)) {
      return this.gameOver();
    } else if (this.touchBait(nextHead)) {
      this.eatBait();
    }

    // Remove tail
    const prevTail = this.snake.sections.pop();
    this.board[prevTail.y][prevTail.x] = false;

    // Send tail to snakeHead
    this.snake.sections.unshift(nextHead);
    this.board[nextHead.y][nextHead.x] = true;

    // Repeat
    this.snake.direction = this.currentDirection;
    setTimeout(this.updateGame, this.initialInterval);
  }


  // Determine next position
  getNextHead() {
    const nextHead = _.cloneDeep(this.snake.sections[0]);

    // Update location
    if (this.currentDirection === this.directions.left) {
      nextHead.x -= 1;
    }  else if (this.currentDirection === this.directions.right) {
      nextHead.x += 1;
    } else if (this.currentDirection === this.directions.up) {
      nextHead.y -= 1;
    } else if (this.currentDirection === this.directions.down) {
      nextHead.y += 1;
    }
    return nextHead;
  }

  // Define game boundaries
  touchEdge(section) {
    return section.x === this.boardSize || section.x === -1 || section.y === this.boardSize || section.y === -1;
  }

  touchSelf(section) {
    return this.board[section.y][section.x] === true;
  }

  touchBait(section) {
    return section.x === this.bait.x && section.y === this.bait.y;
  }

  // Define bait interactions
  eatBait() {
    this.score++;

    // Grow snake by 1 unit
    const tail = _.cloneDeep(this.snake.sections[this.snake.sections.length - 1]);
    this.snake.sections.push(tail);
    this.resetBait();

    if (this.score % 5 === 0) {
      this.initialInterval -= 15;
    }
  }

  resetBait() {
    const x = Math.floor(Math.random() * this.boardSize);
    const y = Math.floor(Math.random() * this.boardSize);

    if (this.board[y][x] === true) {
      return this.resetBait();
    }
    this.bait = {x: x, y: y};
  }

  // Handle game over
  gameOver() {
    this.isGameOver = true;

    setTimeout(() => {
      this.isGameOver = false;
    }, 1000);

    this.initBoard();
  }

}

interface Species {
  name: string,
  region: string,
  diet: string,
  length: string,
  behavior: string,
  url: string
}

interface Directions {
  left: number,
  right: number,
  up: number,
  down: number
}

interface Snake {
  direction: number,
  sections: Sections[]
}

interface Sections {
  x: number,
  y: number
}

interface Bait {
  x: number,
  y: number
}

interface Colors {
  gameOver: string,
  bait: string,
  snakeHead: string,
  snakeBody: string,
  board: string
}
