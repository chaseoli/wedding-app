export class ShowController {

  $firebaseObject: any;
  errorLog: any;
  posts: any;
  test: any;
  $rootScope: any;
  selectCount: number;
  $interval: any;
  counter: any;
  allEvents: any;
  event: any;
  schedInterval: any;
  picInterval: number;

  /* @ngInject */
  constructor($rootScope: any, $interval: any) {
    'ngInject';

    let self = this;

    this.test = 'terst';
    this.posts = [];
    this.$rootScope = $rootScope;

    this.getPosts();
    this.selectCount = 0;
    this.picInterval = 8000;
    this.$interval = $interval;

    self.getSchedule();

    this.event = {
      next: '',
      current: ''
    }

  }

  getPosts() {

    let self = this;
    let posts = firebase.database().ref('posts');

    posts.on('value', function (obj: any) {
      let arr = _.values(obj.val());
      self.posts = _.shuffle(arr);
      // console.log(self.posts[1]);

      // cancel the existing counter
      if (self.counter) {
        self.$interval.cancel(self.counter);
      }

      setTimeout(function () {
        // start counter
        self.startCounter();
      }, 500);

    });

  }

  startCounter() {
    let self = this;

    this.$rootScope.$digest();

    this.counter = this.$interval(function () {
      self.selectCount = self.selectCount + 1;
      if (self.selectCount >= self.posts.length) {
        self.selectCount = 0;
      }
    }, self.picInterval);
  }

  getSchedule() {

    let self = this;

    function timeObj(item: any, index: any) {
      return {
        name: item.name,
        time: item.time,
        time_obj: moment(item.time, 'h:mm A').toDate()
      };
    }

    firebase.database().ref('schedule')
      .on('value', function (obj: any) {

        // add javacript date to object for filtering
        self.allEvents = obj.val().map(timeObj);

        self.$rootScope.$digest();

        // after data loads set the interval 
        // note:if not calling this function here we'd have to wait n (based on inteval time) seconds for set interval to cycle 
        self.checkNow();

        this.schedInterval = setInterval(function () {
          self.checkNow();
        }, 1000);

      });
  }

  checkNow() {

    // filter items in list greater than current time and take the first obj in arr
    let nextEvent: any = _.filter(this.allEvents, function (o) { return o.time_obj > moment().toDate() })[0];

    // check if time is different
    if (nextEvent !== this.event.next) {
      let previousEvents: any = _.filter(this.allEvents, function (o) { return o.time_obj < moment().toDate() });

      let previousEvent: any = {
        name: 'Before the wedding',
        time: ''
      };

      if (previousEvents.length > 0) {
        previousEvent = previousEvents[previousEvents.length - 1];
      }

      let event = {
        next: nextEvent,
        current: previousEvent
      };

      this.event = event;
      this.$rootScope.$digest();
    }

  }

  /** @ngInject */

}
