import {io} from "socket.io-client";

export class BoardService {
  hasMove: boolean = false;

  board: string[] = [];

  SOCKET_ENDPOINT = 'http://localhost:3000';

  socket: any;

  xIsNext: boolean = true;
  winner: any;

  constructor() {
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
