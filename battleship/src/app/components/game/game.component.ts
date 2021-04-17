import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

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
  created = false;
  inPlay = false;
  setup = false;
  player1ships = ["carrier","battleship","cruiser","submarine","destroyer"];
  player2ships = ["carrier","battleship","cruiser","submarine","destroyer"];
  directions = ["down", "right"];
  setupResponse: any;
  player1moves = [];
  player2moves = [];

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
        console.log(data)
        this.game = data;
      }
    });
  }

  onSubmitSetup() {
    this.setupPlayer(this.setupModel);
  }

  setupPlayer(model: any) {
    model.player = this.game.player;
    this.dataService.postSetup(model, this.game.session_id).subscribe(data => {
      if(data) {
        console.log(data)
        if(this.game.player === this.players[1])this.player1moves.push({ship: model.ship, coordinate: model.coordinate, direction: model.direction, placed: data.placed});
        else this.player2moves.push({ship: model.ship, coordinate: model.coordinate, direction: model.direction, placed: data.placed});
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

}
