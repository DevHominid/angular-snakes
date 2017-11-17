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

  constructor() { }

  ngOnInit() {
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
