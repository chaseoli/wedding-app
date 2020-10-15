export class SiteHandlerController {

  view: any;
  auth: any;
  giftDetail: any;
  email: any;
  $rootScope: any;

  /* @ngInject */
  constructor($stateParams: angular.ui.IStateParamsService, $rootScope: any) {
    'ngInject';

    this.showGiftDetails($stateParams);
    this.auth = firebase.auth();
    this.$rootScope = $rootScope;

  }

  selectView(view: string) {
    this.view = 'app/office/usermgmt/partials/' + view + '.html';
  }

  showGiftDetails($stateParams: any) {

    let self = this;

    // console.log($stateParams);

    this.email = $stateParams.email

    let gifts = firebase.database()
      .ref('honeymoon_gifts')
      .orderByChild('email')
      .equalTo($stateParams.email);

    gifts.on('value', function (obj: any) {
      // console.log(obj.val());
      self.giftDetail = obj.val();
      self.$rootScope.$digest();
    });

  }

  deleteGift(giftId: string, gift: any) {

    let self = this;

    function removeGift() {
      // remove the gift
      let honeymoon_gift = firebase.database()
        .ref('honeymoon_gifts/' + giftId);

      // console log gift to delete
      // honeymoon_gift.once('value', function (obj: any) {
      //   console.log(obj.val());
      // });

      honeymoon_gift.remove()
        .then(function () {
          // console.log("Remove succeeded.")
          // self.$rootScope.$digest();
          // alert('Gift deleted. You are no loger responsible for bring this gift.');
        })
        .catch(function (error) {
          // console.log("Remove failed.")
          // self.$rootScope.$digest();
          // alert('Unable to delete this gift. This gift may have already been deleted, try refreshing the page.');
        });
    }

    // add money back to for gift being deleted
    let honeymoon_list = firebase.database().ref()
      .child('honeymoon_list')
      .child(gift.category_id)
      .child('items')
      .child(gift.item_id);

    honeymoon_list.once('value', function (obj: any) {
      // console.log(obj.val());
      let item = obj.val();
      let newAmount = item.received - gift.amount;
      honeymoon_list.update({ received: newAmount });
      removeGift();
    });

  }

  /** @ngInject */

}
