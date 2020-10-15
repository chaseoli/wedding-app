export class OverviewController {

  $firebaseObject: any;
  errorLog: any;
  rsvps: any;
  test: any;
  $rootScope:any;

  /* @ngInject */
  constructor($rootScope) {
    'ngInject';

    let self = this;
    this.$rootScope = $rootScope;

    this.test = 'asdfasdf';

    this.getRsvps();

  }

  getRsvps() {

    let self = this;
    let rsvps = firebase.database().ref('rsvps');

    rsvps.once('value', function (obj) {
      // console.log(obj.val());
      self.rsvps = obj.val();
      self.$rootScope.$digest();
    });

  }

  /** @ngInject */

}
