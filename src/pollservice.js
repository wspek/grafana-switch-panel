angular.module('grafana.services').factory("pollservice", function ($http, $timeout, $q) {
  var service = {};
  var _interval = 10; // seconds
  var _errorCount = 0;
  var _callback = null;
  var _loadPromise;

  service.start = function() {
    var promise = _poll();
    promise.then(function(greeting) {
      console.log('Success: ' + greeting);
    }, function(reason) {
      console.log('Failed: ' + reason);
    }, function(update) {
      console.log('Got notification: ' + update);
    });
  };

  var _poll = function() {
    var deferred = $q.defer();
  
    try {
      _callback();  
      deferred.resolve();
    } catch (error) {
      deferred.reject(error);
    }
      
    return deferred.promise;
  };

  service.setInterval = function(interval) {
    _interval = interval;
  };

  service.setCallback = function(callback) {
    _callback = callback;
  };

  return service;
});