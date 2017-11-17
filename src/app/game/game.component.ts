import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  board: any;
  boardSize: number;
  directions: Directions;
  snake: Snake;
  bait: Bait;
  score: number;
  isGameOver: boolean;
  initialInterval: number;
  currentInterval: number;
  currentDirection: number;
  colors: Colors;

  constructor() {

  }

  ngOnInit() {
    // Set defaults
    this.boardSize = 10;
    this.directions = {
      left: 37,
      right: 39,
      up: 38,
      down: 40
    };
    this.colors = {
      gameOver: '#FBFCFC',
      bait: '#FBFCFC',
      snakeHead: '#74B3CE',
      snakeBody: '#64C196',
      board: '#2274A5'
    };
    this.score = 0;
    this.snake = {
      direction: this.directions.left,
      sections: [{
        x: 0,
        y: 0
      }]
    };
    this.bait = {
      x: 1,
      y: 0
    };

    // Init game board
    this.initBoard();
  }

  // Init game board
  initBoard() {
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = false;
      }
    }
  }

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

  initGame() {
    this.score = 0;
    this.snake = {direction: this.directions.left, sections: []};
    this.currentDirection = this.directions.left;
    this.isGameOver = false;
    this.initialInterval = 150;

    // init snake
    for (let i = 0; i < 5; i++) {
      this.snake.sections.push({x: 5, y: 5});
    }
    this.resetBait();
    this.updateGame();
  }

  updateGame = () => {
    const nextHead = this.getNextHead();

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
    setTimeout(this.updateGame, this.currentInterval);
  }

  getNextHead() {
    // const nextHead = _.cloneDeep(this.snake.sections[0]);
    const nextHead = this.snake.sections[0];

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
    // const tail = _.cloneDeep(this.snake.sections[this.snake.sections.length - 1]);
    const tail = this.snake.sections[this.snake.sections.length - 1];
    this.snake.sections.push(tail);
    this.resetBait();

    if (this.score % 5 === 0) {
      this.currentInterval -= 15;
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
    }, 500);

    this.initBoard();
  }

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
