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
