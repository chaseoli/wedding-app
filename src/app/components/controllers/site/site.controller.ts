// import { WebDevTecService, ITecThing } from '../components/webDevTec/webDevTec.service';

export class SiteController {
  public year: string;
  public brandAnimation: boolean;

  /* @ngInject */
  constructor($timeout: angular.ITimeoutService) {

    this.year = moment().format('YYYY');

    // removes cursor typing animation in header
    this.brandAnimation = true;
    $timeout(() => { this.brandAnimation = false; }, 10000);

  }

  /** @ngInject */

}
