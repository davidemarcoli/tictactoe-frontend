import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SquareComponent } from './square/square.component';
import {NbThemeModule, NbLayoutModule, NbButtonModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {BoardService} from "./services/board.service";

import { ToastrModule } from 'ngx-toastr';
import { JoinRoomComponent } from './join-room/join-room.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SquareComponent,
    JoinRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'cosmic'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbButtonModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  providers: [BoardService, ToastrModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
