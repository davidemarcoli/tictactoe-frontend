import { Component, OnInit } from '@angular/core';
import {BoardService} from "../services/board.service";

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {

  constructor(public boardService: BoardService) { }

  ngOnInit(): void {
  }

}
