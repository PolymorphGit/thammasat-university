angular.module('accountApp', [])
.controller('mainController', ($scope, $http) => {
  $scope.account = {
		  identification_number__c : "1234567890123"
		  
  };
  
  //Get a account Detail
  $scope.getData = (accountId) => {
	  identification_number__c : "1234567890123"
	  /*
    $http.delete('/userinfo/' + accountId)
    .success((data) => {
      $scope.account = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
    */
  };
  
  $scope.myfunction = function (data) {
      alert("---" + data);
  };
});