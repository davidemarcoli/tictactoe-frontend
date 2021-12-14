import { Component, OnInit } from '@angular/core';
import {BoardService} from "../services/board.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(public boardService: BoardService) { }

  async ngOnInit(): Promise<void> {
    await this.boardService.setupSocketConnection();
    this.boardService.newGame();
  }

  // get player() {
  //   return this.boardService.xIsNext ? 'X' : 'O';
  // }
  //
  // makeMove(idx: number) {
  //   if (!this.boardService.hasMove) return;
  //
  //   if (!this.boardService.board[idx]) {
  //     this.boardService.board.splice(idx, 1, this.player);
  //     this.boardService.xIsNext = !this.boardService.xIsNext;
  //     this.boardService.sendPlayerChange();
  //   }
  //
  //   this.boardService.sendMove(this.boardService.board);
  //
  //   this.boardService.winner = this.boardService.calculateWinner();
  // }
}
