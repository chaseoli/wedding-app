//use to check digest on complete $scope
$scope.$watch(
    // This function returns the value being watched. It is called for each turn of the $digest loop
    function() {
        console.log('digest');
    },
    // This is the change listener, called when the value returned from the above function changes
    function(newValue, oldValue) {
        if (newValue !== oldValue) {
            // Only increment the counter if the value changed
            console.log('change');
        }
    }
);