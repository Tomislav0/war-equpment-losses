import { Component } from '@angular/core';
import data from '../assets/data.json'
import { DayLoss } from './model/DayLoss';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    this.data = data.map(s => new DayLoss(s))
    this.data = this.data.sort((a, b) => a.day - b.day)
  }
  isClicked = false;
  data: DayLoss[]

  continueClicked() {
    this.isClicked = !this.isClicked;
  }
}
