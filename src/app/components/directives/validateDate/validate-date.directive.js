export function ValidateDateDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    template: '{{vm.message}}',
    scope: {
      start: '=',
      end: '=',
      endName: '=',       //camel case to snake case in DOM
      startName: '=',     //camel case to snake case in DOM
      form: '='           //need form for setting validity of form
    },
    controller: ValidateDateController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class ValidateDateController {
  constructor($scope) {
    'ngInject';

    let self = this;

    this.message;

    let toMoment = (date) => {
      return moment(date, 'M/D/YYYY h:mm A');
    };

    let cap = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    let updateMessage = (date, kind) => {
      if (!self.start || !self.end) {
        //handle empty values
        self.form[self.endName].$setValidity('dateRange', true);
      } else if (toMoment(date) <= moment()) {
        //start must not be before today
        self.message = cap(kind) + ' date must be in the future';
        self.form[self.endName].$setValidity('dateRange', false);
      } else if (toMoment(self.end) < toMoment(self.start)) {
        //end should not be before start
        self.message = cap(self.startName) + ' date must be before ' + cap(self.endName) + ' date';
        self.form[self.endName].$setValidity('dateRange', false);
      } else {
        self.message = '';
        self.form[self.endName].$setValidity('dateRange', true);
      }

    };

    $scope.$watch('vm.start', function(newDate, oldDate) {

      updateMessage(self.start, self.startName);

    });

    $scope.$watch('vm.end', function(newDate, oldval) {

      updateMessage(self.end, self.endName);

    });

  }
}