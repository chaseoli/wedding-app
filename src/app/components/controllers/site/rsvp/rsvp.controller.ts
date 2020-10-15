export class RsvpCtrl {

  view: string;
  stage: number;
  rsvp: Object;
  message: string;
  parent: any;
  popover: any;
  passcode:any;


  /* @ngInject */
  constructor(item, itemKey, category, parent, $modal) {

    //set intial view to select options
    this.selectView('passcode', 1);
    this.message;
    this.passcode;
    this.parent = parent;

    this.popover = {
      passcode:{ 
        "title": "Where's my passcode?",
        "content": "Your passcode is located with the invitation that was mailed to you. If you are still unable to locate your passcode, please call the bride and groom at 408 221-0629." 
      },
      chicken: {
        "title": "Boneless Breast of Chicken",
        "content": "artichokes, lemon, tomato, white wine & roasted fingerling potatoes"
      },
      salmon: {
        "title": "Coho Salmon",
        "content": "pan seared, tomato ragout & asparagus risotto"
      },
      vege: {
        "title": "Vegetarian",
        "content": "Open Faced Mushroom Ravioli with Asparagus and Sun Dried Tomatoes in a Lemon Basil Sauce"
      },
      kids: {
        "title": "Kid's Meal",
        "content": "Chicken Tenders with a choice of fries or fruit."
      }
    };
  }

  $digest() {
    this.parent.$rootScope.$digest();
  }

  selectView(view, stage) {

    let self = this;

    this.view = 'app/components/controllers/site/rsvp/modal-views/' + view + '.html';
    this.stage = stage;
  }

  submitPasscode(code) {

    let self = this;
    let lowerCode = code.toLowerCase();
    this.passcode = lowerCode;
    self.message = '';

    // look up code from firebase
    firebase.database().ref('rsvps/' + lowerCode).once('value').then(function (snapshot) {
      if (snapshot.val()) {
        // If code is real return information and view
        self.rsvp = snapshot.val();

        self.selectView('status', 2);
        self.$digest()

        // console.log('all good');

      } else {
        // Else let user know that the code didn't work
        self.message = 'Invalid passcode, please try again.';
        // console.log('code doesn\'t exist');
        self.$digest();
      }
    });

  }

  submitAttendance(people, next) {

    let attendance = _.find(people, { 'attending': true });

    if (attendance) {
      //if at least 1 person attending then proceed to meal selection
      this.selectView('meal', 3);

    } else {

      if (next) {
        this.selectView('confirm', 4);
      }
      else {
        this.selectView('status', 2);
      }
    }

  }

  submitRsvp(rsvp){

    // console.log(rsvp);

    this.parent.updateRsvp(rsvp,this.passcode);

    this.selectView('confirmation', 5);
    
  }

  /** @ngInject */

}


export class SiteRsvpController {

  $firebaseObject: any;
  errorLog: any;
  rsvps: any;
  rsvpModal: any;
  $rootScope: any;

  /* @ngInject */
  constructor($modal, $rootScope) {
    'ngInject';

    let self = this;
    this.$rootScope = $rootScope;

    this.rsvpModal = function (item, itemKey, category) {

      let parent = this;

      let modal = $modal({
        controller: function () {
          return new RsvpCtrl(item, itemKey, category, parent, modal.$scope);
        },
        locals: {
          item: function (item) {
            return item;
          },
          itemKey: function (itemKey) {
            return itemKey;
          },
          category: function (category) {
            return category;
          }
        },
        controllerAs: 'modal',
        templateUrl: 'app/components/controllers/site/rsvp/modal-rsvp.html',
        show: true
      });

    };

  }

  prevSlide() {
    $('.carousel').carousel('prev');
  }

  nextSlide() {
    $('.carousel').carousel('next');
  }

  updateRsvp(rsvp, passcode) {

    // get a key for a new rsvp or rsvp to update
    //let newPostKey = 'test4';

    // let rsvp = {
    //   maxInvited: 4,
    //   people: [
    //     {
    //       first: 'Elise',
    //       last: 'Oliphant',
    //       attending: false,
    //       adult: true,
    //       meal: ''
    //     },
    //     {
    //       first: 'Wes',
    //       last: 'Oliphant',
    //       attending: false,
    //       adult: true,
    //       meal: ''
    //     },
    //     {
    //       first: 'James',
    //       last: 'Vukosov',
    //       attending: false,
    //       adult: true,
    //       meal: ''
    //     },
    //     {
    //       first: 'Lisaa',
    //       last: 'Oliphant',
    //       attending: false,
    //       adult: true,
    //       meal: ''
    //     }
    //   ]
    // };

    let obj = angular.copy(rsvp);

    // write the new or updated rsvp
    let updates = {};
    updates['/rsvps/' + passcode] = obj;

    firebase.database().ref().update(updates);
  }

  logError(obj) {
    //Save error to firebase
    //JSON stringify and Parse converts the object removing
    //functions and other types that can't be stored in firebase
    this.errorLog.$add(JSON.parse(JSON.stringify({ error: obj, timestamp: moment().format('x') })));
  }

  /** @ngInject */

}
