import {Component, Input, OnInit} from '@angular/core';

/**
 * Generated class for the RankComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rank',
  templateUrl: 'rank.html'
})
export class RankComponent implements OnInit{

  @Input() rank: number;
  stars;

  constructor() {}

  ngOnInit(): void {
    this.stars = (this.rank > -1) ? Array(this.rank) : [];
  }

}
