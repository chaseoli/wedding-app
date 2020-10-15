export function ValidateDateDirective($q, $timeout) {
    'ngInject';

    let directive = {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            let empty = (modelValue) => {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return true;
                }
            };

            ctrl.$validators.beforetoday = function(modelValue, viewValue) {

                empty(modelValue);

                console.log('modelValue', modelValue);
                console.log('viewValue', viewValue);
                console.log('attrs', attrs);
                console.log('ctrl', ctrl);

                //start must not be before today
                if (modelValue < new Date()) {
                    return false;
                }

                // //end must not be before today
                // if (newDate < new Date()) {
                //     return false
                // }
                // //end should not be before start
                // if (this.end < newDate) {
                //     return false
                // }

                return true;

            };
        }
    };

    return directive;
}





// export function ValidateDateDirective() {
//     'ngInject';

//     let directive = {
//         restrict: 'E',
//         templateUrl: 'app/components/directives/validateDate/validate-date.html',
//         scope: {
//             start: '=',
//             end: '='
//         },
//         controller: ValidateDateController,
//         controllerAs: 'vm',
//         bindToController: true
//     };

//     return directive;
// }

// class ValidateDateController {
//     constructor($scope) {
//         'ngInject';

//         let self = this;

//         this.message;

//         $scope.$watch('vm.start', function(newDate, oldDate) {

//            //start must not be before today
//            if(newDate < new Date()) {
//                this.message = 'Start date must be made in the future';
//            }

//         });

//         $scope.$watch('vm.end', function(newDate, oldval) {

//             //end must not be before today
//            if(newDate < new Date()) {
//                this.message = 'End date must be made in the future';
//            }
//             //end should not be before start
//             if(this.end < newDate ) {
//                this.message = 'End date must not be before start date';
//            }

//         });

//         // setInterval(function() {
//         //     console.log(self.start);
//         // }, 5000);






//     }
// }
