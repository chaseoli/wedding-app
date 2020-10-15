export class SomeController {
    constructor($firebaseObject, $scope) {
        'ngInject';

        //using the firebase SDK 3.0
        let obj = $firebaseObject(firebase.database().ref().child('profiles'));

        // to take an action after the data loads, use the $loaded() promise
        obj.$loaded().then(function(data) {

            console.log('loaded record:', obj.$id, obj.chaseoli);

            // To iterate the key/value pairs of the object, use angular.forEach()
            angular.forEach(obj, function(value, key) {

                console.log(key, value);

            });
        });


        // To make the data available in the DOM, assign it to
        // 'this.data' accessible from DOM as $ctrl.data
        this.data = obj;

        // For three-way data bindings, you will still need to inject '$scope'
        // but you can alias your controller on $scope
        obj.$bindTo($scope, '$ctrl.data');

        // Why does this work?
        // This works because angular 1x puts controllerAs
        // on top of $scope. So '$scope.$ctrl.data' is the same as 'this.data'.
        // Note: $ctrl is the default controllerAs syntax if not specified,
        // just change $ctrl to your defined controllerAs ailias if
        // specified.
    }
}

