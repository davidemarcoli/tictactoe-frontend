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

  socket: any = io(this.SOCKET_ENDPOINT);

  xIsNext: boolean = true;
  winner: any;

  roomName: string = '';
  userName: string = '';
  joined: boolean = false;
  nicknames: string[] = [];

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
    // console.log("Connected to socket server");
    this.socket.on('newGame', () => {
      console.log('newGame');
      this.newGameConfig();
    });
    this.socket.on('changePlayer', () => {
      console.log('changePlayer');
      this.hasMove = !this.hasMove;
    });
    this.socket.on('resetPlayer', () => {
      this.newGameConfig();
      this.hasMove = false;
    });
    this.socket.on('position-broadcast', (data: string[]) => {
      console.log('position-broadcast');
      this.board = data;
      this.xIsNext = !this.xIsNext;
      this.winner = this.calculateWinner();
    });
  }

  configSocketConnection() {
    console.log('configSocketConnection');
    this.socket.emit('roomConfig', [this.userName, this.roomName]);

    this.socket.on('roomFull', () => {
      this.toastr.error('The room ' + this.roomName + ' is full! Try an other one.', 'Room Full', {
        timeOut: 5000,
        progressBar: true,
      });
    });

    this.socket.on('roomJoined', (clients: any[]) => {
      console.log(this.roomName + ' joined');
      this.joined = true;

      let nicknames = '';

      clients.forEach(client => {
        if (client.nickname !== this.userName) {
          nicknames += client.nickname + ', ';
        }
      });

      this.nicknames = nicknames.split(', ');


      if (clients.length == 0) {
        this.toastr.success("You've joined the room \'" + this.roomName + "\'.\n" +
          "You're the only one here :(", 'Joined!', {
          timeOut: 5000,
          progressBar: true,
        });
      } else {
        this.toastr.success("You've joined the room \'" + this.roomName + "\'.\n" +
          "Players in the Room: " + nicknames, 'Joined!', {
          timeOut: 5000,
          progressBar: true,
        });
      }


    });

    this.socket.on('player-update', (clients: any[]) => {
      let nicknames = '';

      clients.forEach(client => {
        nicknames += client.nickname + ", ";
      });

      this.nicknames = nicknames.split(', ');
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
