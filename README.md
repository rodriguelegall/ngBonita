ngBonita

**WARNING: this project is no longer maintained.**

========
**Table of Content**
- [About](#about)
- [Installation](#installation)
  - Download
  - Dependencies
  - Build instructions
- [Examples](#examples)
  - Basic example with authentication
  - Business Data example
- [Resource Documentation](#resource-documentation)

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

## Release instructions
A new release should always start with a fresh build :

```
grunt
```

That will guarantee that the *dist* folder is up-to-date.

This project use [grunt-release](https://github.com/geddski/grunt-release) for its release process.
To release a new version, you simply have to use one of these *grunt-release* process, depending on the version you want to set :

```
grunt release
grunt release:minor
grunt release:major
```

If you're afraid to try it directly, you can see what it will do with a dry run, using one of these :

```
grunt release --no-write
grunt release:minor --no-write
grunt release:major --no-write
```

# Examples:

## Basic example with authentication
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

## Business Data example
The following example will retrieve BDM objects of type `com.company.model.Supplier` using a `find` query.<br/>
Note that the authentication part is ommited in this sample and be sure to add the `BusinessData` dependency in your controller.
``` js
BusinessData.getDataQuery({businessDataType:'com.company.model.Supplier', q:'find'}).$promise.then(function (data) {
	$log.log('Listing '+ data.items.length +' Supplier BDM(s):');
	$log.log(data.items);
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

Starting form ngBonita 1.6 a new `BusinessData` resource is avalailable to query BDMs.<br/>
Each call to this resource requires a mandatory parameter `businessDataType` with the fully qualified Java class of the BDM object.
