import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'rank',
  templateUrl: 'rank.html'
})
export class RankComponent implements OnInit {

  @Input() rank: number;
  stars;

  constructor() {
  }

  ngOnInit(): void {
    this.stars = (this.rank > -1) ? Array(this.rank) : [];
  }

}
