/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: any) {

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('landing', {
      url: '/',
      controller: function ($state) {
        // redirect route to site.main for homepage
        $state.transitionTo('site.main');
      }
    })
    .state('site', {
      abstract: true,
      templateUrl: 'app/components/controllers/site/site.html',
      controller: 'SiteController',
      controllerAs: 'site'
    })
    .state('site.main', {
      url: '/honeymoon',
      views: {
        'header': {
          templateUrl: 'app/components/controllers/site/header.html'
        },
        '': {
          templateUrl: 'app/components/controllers/site/honeymoon/honeymoon.html',
          controller: 'SiteHoneymoonController',
          controllerAs: 'ctrl'
        },
        'footer': {
          templateUrl: 'app/components/controllers/site/footer.html'
        }
      }
    })
    .state('site.rsvp', {
      url: '/rsvp',
      views: {
        'header': {
          templateUrl: 'app/components/controllers/site/header.html'
        },
        '': {
          templateUrl: 'app/components/controllers/site/rsvp/rsvp.html',
          controller: 'SiteRsvpController',
          controllerAs: 'ctrl'
        }
        // 'footer': {
        //   templateUrl: 'app/components/controllers/site/footer.html'
        // }
      }
    })
    .state('overview', {
      url: '/overview',
      templateUrl: 'app/components/controllers/overview/overview.html',
      controller: 'OverviewController',
      controllerAs: 'ctrl'
    })
    .state('show', {
      url: '/show',
      templateUrl: 'app/components/controllers/show/show.html',
      controller: 'ShowController',
      controllerAs: 'ctrl'
    })
    .state('site.handler', {
      url: '/handler?email',
      views: {
        'header': {
          templateUrl: 'app/components/controllers/site/header.html'
        },
        '': {
          templateUrl: 'app/components/controllers/site/handler/handler.html',
          controller: 'SiteHandlerController',
          controllerAs: 'ctrl'
        },
        'footer': {
          templateUrl: 'app/components/controllers/site/footer.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}
