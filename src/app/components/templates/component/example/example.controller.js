export class ExampleController {

  constructor(firebaseObjs, $state, $firebaseObject) {
    'ngInject';

    //let self = this;

    this.auth = firebaseObjs;
    this.ref = firebaseObjs.ref;
    this.authObj = firebaseObjs.authObj;
    this.$state = $state;

   
  }

  

}