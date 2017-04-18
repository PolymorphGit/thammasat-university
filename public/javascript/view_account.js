angular.module('accountApp', [])
.controller('mainController', ($scope, $http) => {
  $scope.account = {};
  
  //Get a account Detail
  $scope.getData = (accountId) => {
    $http.delete('/userinfo/' + accountId)
    .success((data) => {
      $scope.account = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  };
});