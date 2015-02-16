ngBonita
========
# Table of Content
- About
- Installation
  - Download
  - Dependencies
  - Build instructions
- Simple example
- Resource Documentation

# About
AngularJS module for Bonita BPM platform. This module acts as a Bonita REST API client.
It allows to quickly build business application by providing user management API, authentication API, business process API, 
...

**Notes:**
- this module is not an official extension of Bonita BPM
- this module is compatible with Bonita BPM 6.0 and onward but some resources may be missing in early Bonita versions

# Installation

## Download
The project binaries are available [here](https://github.com/rodriguelegall/ngBonita/releases)

## Dependencies
In order to use ngBonita, you will need the following JS dependencies:
- Angular core 1.3.0 or upper
- Angular resource module

## Build instructions
If you wish to build the project from the sources, follow these instructions:

1. Make sure you have installed grunt. See [this guide](http://gruntjs.com/getting-started) for more instructions.
2. Open a command line at the project root directory
3. Run "npm install"
4. Run "grunt build"

# Simple Example:

The following example will log in Bonita with user "walter.bates" and will list the process definitions that he has the right to start using the browser's console:
``` js
var app = angular.module('appMainModule', ['ngBonita']);

app.config(function (bonitaConfigProvider) {
	// Optional call to override Bonita URL setup
	bonitaConfigProvider.setBonitaUrl('http://localhost:8080/bonita');
});

// Application controller
app.controller('AppController', function($scope, $log, bonitaAuthentication, ProcessDefinition){
	// Logs into Bonita as 'walter.bates'
	bonitaAuthentication.login('walter.bates','bpm').then(function() {
	
		// Lists all process definitions that can be started by current user
		ProcessDefinition.getStartableByCurrentUser().$promise.then(function (processDefinitions) {
			$log.log('Listing '+ processDefinitions.items.length +' process definition(s):');
			for (var i=0; i<processDefinitions.items.length; i++)
				$log.log('  - '+ processDefinitions.items[i].name +' '+ processDefinitions.items[i].version);
				
			// Logs out of Bonita
			bonitaAuthentication.logout();
		});
	});
});
```

# Resource documentation

As of latest version, the following resources are available:
- ArchivedCaseDocument
- ArchivedHumanTask
- ArchivedProcessInstance
- BonitaSession
- CaseDocument
- HumanTask
- ProcessDefinition
- ProcessInstance
- User
