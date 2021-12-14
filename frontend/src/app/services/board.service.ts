import {io} from "socket.io-client";
import {ToastrService} from "ngx-toastr";
import {Injectable} from "@angular/core";
import {AppSettings} from "../app.settings";

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  hasMove: boolean = false;

  board: string[] = [];

  SOCKET_ENDPOINT = AppSettings.BASE_URL;

  socket: any = null;

  xIsNext: boolean = true;
  winner: any;

  constructor(private toastr: ToastrService) {
  }

  newGame() {
    this.newGameConfig();
    this.sendNewGame();
  }

  newGameConfig() {
    this.board = Array(9).fill(null);
    this.winner = null;
    // this.xIsNext = true;
  }

  async setupSocketConnection() {
    console.log('setupSocketConnection');

    this.socket = await io(this.SOCKET_ENDPOINT);
    console.log(this.socket);

    // if (this.socket.id) {
    //   this.toastr.success('You\'re connected with the server ' + this.SOCKET_ENDPOINT + '!', 'Connected', {
    //     timeOut: 3000,
    //     progressBar: true,
    //   });
    // } else {
    //   console.log(this.socket.id)
    //   this.toastr.error('Unknown error while connecting with the server ' + this.SOCKET_ENDPOINT + '!', 'Error');
    // }


    console.log("Connected to socket server");
    this.socket.on('newGame', () => {
      console.log('newGame');
      this.newGameConfig();
    });
    this.socket.on('changePlayer', () => {
      console.log('changePlayer');
      this.hasMove = !this.hasMove;
    });
    this.socket.on('position-broadcast', (data: string[]) => {
      console.log('position-broadcast');
      this.board = data;
      this.xIsNext = !this.xIsNext;
      this.winner = this.calculateWinner();
    });
  }

  sendMove(data: string[]) {
    console.log('sendMove');
    this.socket.emit('position', data);
  }

  sendPlayerChange() {
    console.log('sendPlayerChange');
    this.socket.emit('changePlayer');
  }

  sendNewGame() {
    console.log('sendNewGame');
    this.socket.emit('newGame');
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (!this.hasMove) return;

    if (!(this.board)[idx]) {
      this.board.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
      this.sendPlayerChange();
    }

    this.sendMove(this.board);

    this.winner = this.calculateWinner();
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }
    return null;
  }
}
