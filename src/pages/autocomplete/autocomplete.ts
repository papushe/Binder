import {Component, NgZone, OnInit} from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  templateUrl: 'autocomplete.html'
})
export class AutocompletePage implements OnInit {
  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo: any;
  service = new google.maps.places.AutocompleteService();

  constructor(private viewCtrl: ViewController, private zone: NgZone) {

  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
    this.geo = item;
    this.geoCode(this.geo);//convert Address to lat and long
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
        input: this.autocomplete.query,
        componentRestrictions: {country: 'IL'}
      },
      function (predictions, status) {
        if (predictions) {
          me.autocompleteItems = [];
          me.zone.run(function () {
            predictions.forEach(function (prediction) {
              me.autocompleteItems.push(prediction.description);
            });
          });
        }
      });
  }

  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
    });
  }

  ionViewDidLoad() {
  }

}
