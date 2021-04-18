import { Component, OnInit } from '@angular/core';
import { OperatorFunction, Observable } from 'rxjs';
import { DataService } from 'src/app/data.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  createModel = {player1: "", player2: ""};
  players = {1: "", 2: ""};
  setupModel = {ship: "", coordinate: "", direction: "", player: ""};
  game = {session_id: "", phase: "", player: ""};
  playModel = {coordinate: "", player: ""};
  created = false;
  inPlay = false;
  setup = false;
  gameOver = true;
  player1ships = ["carrier","battleship","cruiser","submarine","destroyer"];
  player2ships = ["carrier","battleship","cruiser","submarine","destroyer"];
  directions = ["down", "right"];
  shipDirections = {
      carrier: {
        right: [0, 1, 2, 3, 4],
        down: [0, 10, 20, 30, 40]
      },
      battleship: {
        right: [0, 1, 2, 3],
        down: [0, 10, 20, 30]
      },
      cruiser: {
        right: [0, 1, 2],
        down: [0, 10, 20]
      },
      submarine: {
        right: [0, 1, 2],
        down: [0, 10, 20]
      },
      destroyer: {
        right: [0, 1],
        down: [0, 10]
      },
    }
  setupResponse: any;
  player1moves = [];
  player2moves = [];
  player1board = [];
  player2board = [];
  grid = ["A0","A1","A2","A3","A4","A5","A6","A7","A8","A9",
          "B0","B1","B2","B3","B4","B5","B6","B7","B8","B9",
          "C0","C1","C2","C3","C4","C5","C6","C7","C8","C9",
          "D0","D1","D2","D3","D4","D5","D6","D7","D8","D9",
          "E0","E1","E2","E3","E4","E5","E6","E7","E8","E9",
          "F0","F1","F2","F3","F4","F5","F6","F7","F8","F9",
          "G0","G1","G2","G3","G4","G5","G6","G7","G8","G9",
          "H0","H1","H2","H3","H4","H5","H6","H7","H8","H9",
          "I0","I1","I2","I3","I4","I5","I6","I7","I8","I9",
          "J0","J1","J2","J3","J4","J5","J6","J7","J8","J9",]
  dictionary = ['A','B','C','D','E','F','G','H','I','J']

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onSubmit() { 
    this.created = true; 
    this.createGame(this.createModel);
  }

  createGame(model: any) {
    this.players[1] = this.createModel.player1;
    this.players[2] = this.createModel.player2;
    this.dataService.postNewGame(model).subscribe(data =>{
      if(data) {
        this.setup = true;
        this.game = data;
        let player1grid = document.querySelector('.grid-player1')
        let player2grid = document.querySelector('.grid-player2')
        this.createBoard(player1grid, this.player1board, 1)
        this.createBoard(player2grid, this.player2board, 2)
      }
    });
  }

  onSubmitSetup() {
    this.setupPlayer(this.setupModel);
  }

  setupPlayer(model: any) {
    model.player = this.game.player;
    const currDir = this.shipDirections[model.ship][model.direction]
    let filled;
    let currentSpot = this.grid.indexOf(model.coordinate);
    if(model.player === this.players[1]) filled = currDir.some(index => this.player1board[currentSpot+index].classList.contains('filled'))
    else filled = currDir.some(index => this.player2board[currentSpot+index].classList.contains('filled'))
    if(filled) {
      model.coordinate = "XX";
    }
    this.dataService.postSetup(model, this.game.session_id).subscribe(data => {
      if(data) {
        if(this.game.player === this.players[1]) {
          this.paintShips(model.ship, model.coordinate, model.direction, data.placed, 1);
          this.player1moves.push({ship: model.ship, coordinate: model.coordinate, direction: model.direction, placed: data.placed});
        } else {
          if(this.player2ships.length === 1) {
            this.paintShips(model.ship, model.coordinate, model.direction, data.placed, 2, true);
            this.player2moves.push({ship: model.ship, coordinate: model.coordinate, direction: model.direction, placed: true});
          } else {
            this.paintShips(model.ship, model.coordinate, model.direction, data.placed, 2);
            this.player2moves.push({ship: model.ship, coordinate: model.coordinate, direction: model.direction, placed: data.placed});
          }

        }
        this.setupResponse = data;
        if(this.setupResponse.hasOwnProperty("next_player")|| (this.player1ships.length > 0 && this.player2ships.length > 0)) {
          if(this.setupResponse.hasOwnProperty("placed")) {
            if(this.setupResponse.placed === true) {
              if(this.players[1] === this.game.player) this.player1ships = this.player1ships.filter(ship => ship != model.ship)
              else this.player2ships = this.player2ships.filter(ship => ship != model.ship)
            }
          }
          this.game.player = this.setupResponse.next_player;
          this.setupModel = {ship: "", coordinate: "", direction: "", player: ""};
        } else {
          // time to start the game
          // change the phase and set player to player one
          this.setup = false;
          this.inPlay = true;
          this.game.phase = this.setupResponse.phase;
          this.game.player = this.setupResponse.player;
        }
      }
    })
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.grid.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  createBoard(grid, squares, player) {
    for (let i = 0; i < 100; i++) {
      const square = document.createElement('div')
      if(player === 1) square.id = "player1-"+this.grid[i];
      else square.id = "player2-"+this.grid[i];
      grid.appendChild(square)
      squares.push(square)
    }
  }

  paintShips(ship: string, coordinate: string, direction: string, placed: boolean, player: number, final?: boolean) {
    let shipLength = this.getShipLength(ship);
    let col = coordinate.substr(0,1);
    let row = coordinate.substr(1);
    let colIdx = this.dictionary.indexOf(col);
    if(placed) {
      if(player === 1) {
        this.paintPlayerShip(direction, shipLength, colIdx, row, player.toString());
      } else {
        this.paintPlayerShip(direction, shipLength, colIdx, row, player.toString());
      }
    } else if(final) {
      this.paintPlayerShip(direction, shipLength, colIdx, row, player.toString());
    }
  }

  paintPlayerShip(direction: string, shipLength: number, colIdx: number, row: string, player: string): void {
    if(direction === "down") {// increment id's by ten
      // loop over length of ship and paint each div for ship a different color
      for(let i = 0; i < shipLength; i++) {
        // grab id for coordinate as starting point
        let shipDivStartingPoint = document.querySelector(`#player${player}-${this.dictionary[colIdx]}${row}`);
        shipDivStartingPoint.classList.add('filled');
        colIdx++;
      }
    } else {
      // loop over length of ship and paint each div for ship a different color
      for(let i = 0; i < shipLength; i++) {
        // grab id for coordinate as starting point
        let shipDivStartingPoint = document.querySelector(`#player${player}-${this.dictionary[colIdx]}${row}`);
        shipDivStartingPoint.classList.add('filled');
        let rowInt = parseInt(row);
        rowInt++;
        row = rowInt.toString();
      }
    }
  }

  getShipLength(ship: string): number {
    let length = 0;
    switch(ship) {
      case "submarine": length = 3;break;
      case "carrier": length = 5;break;
      case "battleship": length = 4;break;
      case "cruiser": length = 3;break;
      case "destroyer": length = 2;break;
    }
    return length;
  }

  onSubmitShot(): void {
    this.playerTurn(this.playModel);
  }

  playerTurn(model: any): void {
    model.player = this.game.player;
    this.dataService.postPlayerTurn(model,this.game).subscribe(data => {
        if(data.result === "hit_good_game") alert(`${model.player} WON! GOOD GAME!`)
        this.game.player = data.player;
        this.playModel = {coordinate: "", player: ""};
    })
  }

}


