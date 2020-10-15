export class GiveCtrl {
  public test: string;

  model: any;
  parent: any;
  $modal: any;
  view: any;
  payment: any;
  submitted: any;
  stage: any;
  $http: any;
  authorizeError: any;
  confirmationNum: any;
  gift: any;

  /* @ngInject */
  constructor(item, itemKey, category, parent, $modal, $http) {

    let self = this;

    this.model = item;
    this.parent = parent;
    this.$modal = $modal;
    this.view;
    this.payment;
    this.submitted = false;
    this.stage;
    this.$http = $http;
    this.authorizeError;
    this.confirmationNum;

    this.gift = {
      giver: '',
      // option: '',
      option: 'pledge',
      email: '',
      item: { item: item, $id: itemKey },
      item_id: itemKey,
      category: category,
      category_id: category.$id,
      public_giver: true,
      public_amount: false,
      amount: _.clone(item.suggested)
    };

    // set intial view to select options
    this.selectView('info', 2);

  }

  selectView(view: string, stage: number) {

    let self = this;

    this.view = 'app/components/controllers/site/honeymoon/modal-views/' + view + '.html';
    this.stage = stage;

    // if (view === 'payment') {

    //   //Get braintree client nonce & handle payment
    //   self.$http.get('/client_token').then(
    //     function (res) {

    //       // braintree.setup(res.data, 'dropin', {
    //       //   container: 'payment-form',
    //       //   onPaymentMethodReceived: function(obj) {
    //       //     self.onPaymentMethodReceived(obj);
    //       //   },
    //       //   onError: function(err) {
    //       //     self.parent.logError({ error: 'braintree_honeymoon', obj: err, model: self.gift });
    //       //   }
    //       // });

    //     },
    //     function (err) {
    //       self.parent.logError({ error: 'route.client_token', obj: err, model: self.gift });
    //     }
    //   );

    // }

  }

  // onPaymentMethodReceived(obj) {
  //   //Credit card info is entered into the payment form

  //   //store payment info for later submission
  //   this.payment = obj;

  //   //proceed to confirm view
  //   this.selectView('confirm', 4);
  // }

  submitInfo(isValid) {
    let self = this;
    // if form is valid go to next view
    if (isValid) {
      // self.selectView(self.gift.option, 3);      
      self.selectView('pledge', 3);
    }
  }

  sendGift() {
    //traffic function to plegde vs payment based on option selected

    let self = this;

    if (self.gift.option === 'pledge') {
      self.saveGift();
    }
    // else if (self.gift.option === 'payment') {
    //   self.makePayment();
    // }

  }

  saveGift() {

    let self = this;

    // Save gift to firebase
    this.parent.saveGift(this.gift).then(
      function (res) {
        // show confirmation

        self.confirmationNum = res.obj.key;

        self.parent.createUser(self.gift.email, self.gift.giver);

        self.selectView('confirmation', 5);

      },
      function (err) {
        // Firebase save failed
        self.parent.logError({ error: 'saveGift', obj: err, model: self.gift });
      });

  }

  makePayment() {
    // on click submit payment event & process transaction on the server

    let self = this;

    let payment = this.payment;

    // if payment is chosen on payment received method will be handled
    // then, if there is a payment success then update the modal to show success message

    self.$http.post('/checkout', { nonce: payment.nonce, amount: self.gift.amount }).then(
      function (res) {

        console.log(res);

        if (res.data.success) {
          // payment Success

          // save gift to firebase
          self.saveGift();

        } else {
          // payment failure

          // back to credit card view
          self.selectView(self.gift.option, 3);

          // show alert of error
          alert('Sorry, we are unabl to process your payment at this time. Please try again later.');
          self.parent.logError({ error: 'makePayment', obj: res, model: self.gift });
        }

      },
      function (err) {

        console.log('PAYMENT ERROR', err);

      }

    );

  }

  /** @ngInject */

}


export class SiteHoneymoonController {
  public test: string;

  $http: any;
  $q: any;
  $firebaseObject: any;
  idArr: any;
  errorLog: any;
  gifts: any;
  list: any;
  giveModal: any;
  auth: any;

  /* @ngInject */
  constructor($http, $modal, $timeout, $firebaseObject, $firebaseArray, $window, $scrollspy, $q) {
    'ngInject';

    this.auth = firebase.auth();
    let self = this;
    this.$http = $http;
    this.$q = $q;
    this.$firebaseObject = $firebaseObject;
    this.idArr = [];

    // get refs to firebase db
    this.errorLog = $firebaseArray(firebase.database().ref().child('error_log'));
    this.gifts = $firebaseArray(firebase.database().ref().child('honeymoon_gifts'));
    this.list = $firebaseArray(firebase.database().ref().child('honeymoon_list'));

    this.list.$loaded().then(() => {

      // enable first tab in list
      $timeout(() => {
        angular.element('#' + self.list[0].category).parent().addClass('active');
        angular.element('#' + self.list[0].category + 'Tab').addClass('active');
      }, 0);

    });

    this.giveModal = function (item, itemKey, category) {

      let parent = this;

      let modal = $modal({
        controller: function () {
          return new GiveCtrl(item, itemKey, category, parent, modal.$scope, self.$http);
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
        templateUrl: 'app/components/controllers/site/honeymoon/modal-give.html',
        show: true
      });

    };

  }

  saveGift(gift) {
    // save payment to firebase

    let self = this;
    let $q = this.$q;

    gift.timestamp = moment().format('x');

    return $q(function (resolve, reject) {

      self.gifts.$add(gift)
        .then(
        function (ref) {
          // success
          self.updateAmountRecieved(gift);
          resolve({ success: true, obj: ref });
        },
        function (err) {
          self.logError({ error: 'saveGift', obj: err, model: gift });
          reject({ success: false, obj: err });
        });

    });

  }

  createUser(email: string, giver: string) {
    // need to create users for sendEmail method. Doesn't matter what the users password is

    let self = this;

    // create users
    this.auth.createUserWithEmailAndPassword(email, 'defaultPassword1').then(
      (res: any) => {

        console.log(res);

        // setting timeout to ensure that firebase sets the display name before sending the email 
        setTimeout(function () {
          self.sendEmail(email);
        }, 2000);

        // set the user display name
        let user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: giver
        }).then(function () {
          // Update successful.
          // do nothing...
        }, function (error) {
          // An error happened.
          // do nothing...
        });

      },
      (err: any) => {
        console.log(err);

        // error becuase user account exists from previous gift
        if (err.code === 'auth/email-already-in-use') {
          self.sendEmail(email);
        }

      }
    );

  }

  sendEmail(email: string) {
    // as of now, the only way to send emails without creating my own server 
    // is to users is the send password reset handlers through firebase. Becuase 
    // these are simple query strings passed back. I can 
    // send them to a custom page and do a lookup for data based on the users 
    // email address entirely in firebase.  
    // note: the 'google cloud funtion' service may do this in the future

    // send email (password reset)
    this.auth.sendPasswordResetEmail(email).then(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );


  }


  updateAmountRecieved(gift) {

    let self = this;

    let obj = this.$firebaseObject(firebase.database().ref().child('honeymoon_list').child(gift.category.$id).child('items').child(gift.item.$id));
    obj.$loaded(
      function () {
        // cannot update item amount because can't find id

        obj.received = obj.received + gift.amount;

        obj.$save().then(function (ref) {
          // do nothing
        }, function (err) {
          self.logError({ error: 'unable to save updated amount', obj: err, model: gift });
        });

      },
      function (err) {
        // cannot update item amount because can't find id
        self.logError({ error: 'unable to find honeymoon item for category', obj: err, model: gift });
      });

  }

  logError(obj) {
    // save error to firebase
    // json stringify and Parse converts the object removing
    // functions and other types that can't be stored in firebase
    this.errorLog.$add(JSON.parse(JSON.stringify({ error: obj, timestamp: moment().format('x') })));
  }

  /** @ngInject */

}
