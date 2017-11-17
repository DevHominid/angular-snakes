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
    this.colors = {
      gameOver: '#FBFCFC',
      bait: '#FBFCFC',
      snakeHead: '#74B3CE',
      snakeBody: '#64C196',
      board: '#2274A5'
    };

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
