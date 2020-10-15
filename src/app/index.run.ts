/** @ngInject */
export function runBlock($log: angular.ILogService, $rootScope:angular.IRootScopeService, globals:any, $timeout:angular.ITimeoutService) {
  $log.debug('runBlock end');

  //Initalize firebase app
  firebase.initializeApp(globals.config);

   $rootScope.$on('$stateNotFound',
    function(event, unfoundState, fromState, fromParams) {

      //Page not found event
      $log.error('The requested state was not found: ', unfoundState);

    });

  $rootScope.$on('$stateChangeError',
    function(event, toState, toParam, fromState, fromParams) {

      //ui-router change route (aka: state) error event
      $log.debug('successfully changed states');

      $log.debug('event', event);
      $log.debug('toState', toState);
      $log.debug('toParam', toParam);
      $log.debug('fromState', fromState);
      $log.debug('fromParams', fromParams);

    });

    $rootScope.$on('$viewContentLoaded',
    function() {

      //Enable animations ng-include change event
      //Timeout is needed for inoder wait for content to finish loading
      $timeout(() => {

        $.material.init();

      }, 0);

    });

  $rootScope.$on('$includeContentLoaded',
    function() {

      //Enable animations ng-include change event
      //Timeout is needed for inoder wait for content to finish loading
      $timeout(() => {

        $.material.init();

      }, 0);

    });

  //$log.debug('runBlock end');

}

