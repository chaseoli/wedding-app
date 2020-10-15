/// <reference path="../../typings/index.d.ts" />

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { SiteController } from '../app/components/controllers/site/site.controller';
import { SiteHoneymoonController } from '../app/components/controllers/site/honeymoon/honeymoon.controller';
import { SiteRsvpController } from '../app/components/controllers/site/rsvp/rsvp.controller';
import { SiteHandlerController } from '../app/components/controllers/site/handler/handler.controller';
import { OverviewController } from '../app/components/controllers/overview/overview.controller';
import { ShowController } from '../app/components/controllers/show/show.controller';

import { TypewriterDirective } from '../app/components/directives/typewriter';

import { models } from '../app/components/common/models';
import { globals } from '../app/components/common/globals';

module site {
  'use strict';

  angular.module('site', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'mgcrea.ngStrap', 'kendo.directives', 'ui.grid', 'firebase', 'ngMaterial'])
    .constant('globals', globals)
    .constant('models', models)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .controller('SiteController', SiteController)
    .controller('SiteHoneymoonController', SiteHoneymoonController)
    .controller('SiteRsvpController', SiteRsvpController)
    .controller('OverviewController', OverviewController)
    .controller('ShowController', ShowController)
    .controller('SiteHandlerController', SiteHandlerController)
    .directive('typewrite', ['$timeout', TypewriterDirective])
    .filter('shortDateRange', () => {
      return (start, end, parseFormat) => {

        // Leave format null if format javascript date or moment type

        let s = moment(start, parseFormat);
        let e = moment(end, parseFormat);

        if (s.format('l') === e.format('l')) {
          // same day event
          return s.format('MMM Do');
        } else {
          // multi day event

          let part1 = s.format('MMM Do');
          let part2 = e.format('MMM Do');

          return part1 + ' - ' + part2;
        }

      };
    })
    .filter('longDateTimeRange', () => {
      return (start, end, parseFormat) => {
        // Leave format null if format javascript date or moment type

        let s = moment(start, parseFormat);
        let e = moment(end, parseFormat);

        if (s.format('l') === e.format('l')) {
          // same day event
          return s.format('MMMM Do') + ' from ' + s.format('hh:mm a') + ' to ' + e.format('hh:mm a');
        } else {
          // multi day event
          return s.format('MMMM Do hh:mm a') + ' thru ' + e.format('MMMM Do hh:mm a');
        }

      };
    })
    .filter('datetime', () => {
      return (str, parseFormatIn, parseFormatOut) => {
        return moment(str, parseFormatIn).format(parseFormatOut);
      };
    })
    .filter('singleMultiDay', () => {
      return (start, end, parseFormat) => {
        // Leave format null if format javascript date or moment type

        let s = moment(start, parseFormat);
        let e = moment(end, parseFormat);

        if (s.format('l') === e.format('l')) {
          // same day event
          return 'Single day';
        } else {
          // multi day event
          return 'Multi day';
        }

      };
    })
    .filter('itemRange', function () {
      // Filters a list of items with specified start and end date

      return function (items, f, t, parseFormat, listParseFormat) {
        let df = moment(f, parseFormat);
        let dt = moment(t, parseFormat);
        let results = [];

        for (let i = 0; i < items.length; i++) {

          let itemStart = moment(items[i].start, listParseFormat),
            itemEnd = moment(items[i].end, listParseFormat);

          if (itemStart >= df && itemEnd <= dt) {
            results.push(items[i]);
          }

        }

        return results;
      };
    })
    .filter('sameOrRange', () => {
      return (min, max) => {
        // displays a range if min and max are not equal

        if (min === max) {
          return min;
        } else {
          return min + ' to ' + max;
        }

      };
    })
    .filter('slots', () => {
      return (taken, totalAllowed) => {
        // displays slot availability

        let avail = totalAllowed - taken;

        if (avail <= 0) {
          return 'No more slots left';
        } else {
          return avail + ' slots left';
        }

      };
    })
    .filter('title', () => {
      return (str) => {

        // convert '-' to space
        str = str.replace('-', ' ');

        // convert '_' to space
        str = str.replace('_', ' ');

        // capitalize first letter
        str = str.charAt(0).toUpperCase() + str.slice(1);

        return str;

      };
    });
}
