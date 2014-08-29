ngBonita
========

AngularJS Module for Bonita BPM platform. This module allows you to quickly build business application by providing user management api, authentication api, business process api, ...

Simple Example:
``` js
var app = angular.module('angularPortal', ['ngBonita']);

var bonitaUrl = 'http://localhost:8080';

// Application controller
app.controller('AppController', ['$scope', 'bonita', 'ProcessDefinition', 'HumanTask', function($scope, bonita, ProcessDefinition, HumanTask){

    // Set the Bonita server url
    bonita.setBonitaUrl(bonitaUrl);
    // Login into the server
    bonita.login('walter.bates','bpm', function(isSuccess) {
        // Get the list of process startable by Walter Bates
        var processDefinitions = ProcessDefinition.getAllStartableByCurrentUser();
        // Get the list of tasks for Walter Bates
        var tasks = HumanTask.getFromCurrentUser();
    });

}]);

```

Note: This module is still under development and is not an official extension of Bonita BPM