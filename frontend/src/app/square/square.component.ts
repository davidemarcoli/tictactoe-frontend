import {Component, Input, OnInit} from '@angular/core';
import {BoardService} from "../services/board.service";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
  styles: ['button { width: 100%; height: 100%; font-size: 5em !important; }']
})
export class SquareComponent {

  constructor(public boardService: BoardService) { }


  @Input() value: 'X' | 'O' | string = '';

}
