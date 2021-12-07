import {io} from "socket.io-client";

export class BoardService {
  hasMove: boolean = false;

  board: string[] = [];

  SOCKET_ENDPOINT = 'localhost:3000';

  socket: any;

  xIsNext: boolean = true;
  winner: any;

  constructor() {
  }

  newGame() {
    this.board = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.socket.emit('newGame');
  }

  setupSocketConnection() {
    this.socket = io(this.SOCKET_ENDPOINT);
    this.socket.on('newGame', () => {
      this.newGame();
    });
    this.socket.on('changePlayer', () => {
      this.hasMove = !this.hasMove;
    });
    this.socket.on('position-broadcast', (data: string[]) => {
      this.board = data;
      this.xIsNext = !this.xIsNext;
    });
  }

  sendMove(data: string[]) {
    this.socket.emit('position', data);
  }

  sendPlayerChange() {
    this.socket.emit('changePlayer');
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
