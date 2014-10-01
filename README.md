ngBonita
========

AngularJS module for Bonita BPM platform. This module acts as a Bonita REST API client.
It allows to quickly build business application by providing user management API, authentication API, business process API, ...

## Simple Example:
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
		ProcessDefinition.getAllStartableByCurrentUser().$promise.then(function (processDefinitions) {
			$log.log('Listing '+ processDefinitions.items.length +' process definition(s):');
			for (var i=0; i<processDefinitions.items.length; i++)
				$log.log('  - '+ processDefinitions.items[i].name +' '+ processDefinitions.items[i].version);
				
			// Logs out of Bonita
			bonitaAuthentication.logout();
		});
	});
});
```

## Build instructions

1. Make sure you have installed grunt. See (http://gruntjs.com/getting-started) for more instructions.
2. Open a command line at the project root directory
3. Run "npm install"
4. Run "grunt build"
5. [optional, but good to check] Run "grunt" to validate your code through JSHint (note: you may need to add the "--force" option if it complains about "$" not being defined)


**Note:** This module is still under development and is not an official extension of Bonita BPM
