'use strict';
/**
 * Copyright (C) 2014 BonitaSoft S.A.
 * BonitaSoft, 32 rue Gustave Eiffel - 38000 Grenoble
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module provides easy access to Bonita BPM REST APIs
 *
 * @author Philippe Ozil
 * @author Rodrigue Le Gall
 */
angular.module('ngBonita', [ 'ngResource', 'ngCookies' ]);

angular.module('ngBonita').config(function (bonitaConfigProvider) {
	bonitaConfigProvider.setBonitaUrl('http://localhost:8080/bonita');
});

'use strict';

/**
 * Factory that manages Bonita authentication
 */
angular.module('ngBonita').factory('bonitaAuthentication', function ($log, $http, $q, BonitaSession, bonitaConfig) {

	var bonitaAuthentication = {};


	/**
	 * Performs a Bonita login
	 * 
	 * @param username
	 * @param password
	 */
	bonitaAuthentication.login = function (username, password) {
		var deferred = $q.defer();

		$http({
			method : 'POST',
			url : bonitaConfig.getBonitaUrl() + '/loginservice',
			data : $.param({
				username : username,
				password : password,
				redirect : false
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).success(function () {
			$log.log('BonitaAuthentication.login success');
			// Retrieve current session
			// to get user id
			BonitaSession.getCurrent().$promise.then(function (session) {
				if (session === null) {
					deferred.reject('No active session found');
				} else {
					// Save basic session data
					bonitaConfig.setUsername(session.user_name);
					bonitaConfig.setUserId(session.user_id);
					deferred.resolve(session);
				}
			});
		}).error(function (data, status, headers, config) {
			$log.log('BonitaAuthentication.login failure response ' + status);
			$log.log('Bonita URL: ' + bonitaConfig.getBonitaUrl());
			deferred.reject({
				data : data,
				status : status,
				headers : headers,
				config : config
			});
		});

		return deferred.promise;
	};

	/**
	 * Performs a Bonita logout
	 */
	bonitaAuthentication.logout = function () {
		var deferred = $q.defer();

		$http({
			method : 'GET',
			url : bonitaConfig.getBonitaUrl() + '/logoutservice',
			data : $.param({
				redirect : false
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).success(function () {
			$log.log('BonitaAuthentication.logout success');
			bonitaConfig.setUsername(null);
			bonitaConfig.setUserId(null);
			deferred.resolve();
		}).error(function (data, status, headers, config) {
			$log.log('BonitaAuthentication.logout failure response ' + status);
			deferred.reject({
				data : data,
				status : status,
				headers : headers,
				config : config
			});
		});

		return deferred.promise;
	};

	return bonitaAuthentication;
});

'use strict';

angular.module('ngBonita').provider('bonitaConfig', function () {
	var bonitaUrl = 'http://localhost:8080/bonita';

	/**
	 * Configure the Bonita application URL (must include application name
	 * without trailing slash)
	 * 
	 * @param url
	 */
	this.setBonitaUrl = function (url) {
		bonitaUrl = url;
	};

	this.$get = function ($cookies) {
		var api = {};
		var bonitaUserId, bonitaUsername;

		// FIXME is storing into cookies really necessary ?
		$cookies.bonitaUrl = bonitaUrl;

		/**
		 * Gets the Bonita application URL
		 * 
		 * @return Bonita url
		 */
		api.getBonitaUrl = function () {
			return bonitaUrl;
		};

		/**
		 * Retrieves the currently logged Bonita user id
		 * 
		 * @return logged Bonita user id
		 */
		api.getUserId = function () {
			return bonitaUserId;
		};

		/**
		 * Set the currently logged Bonita user id
		 * 
		 * @param newBonitaUserId
		 */
		api.setUserId = function (newBonitaUserId) {
			bonitaUserId = newBonitaUserId;

			// FIXME is storing into cookies really necessary ?
			$cookies.bonitaUserId = newBonitaUserId;
		};

		/**
		 * Retrieves the currently logged Bonita user name
		 * 
		 * @return logged Bonita user name
		 */
		api.getUsername = function () {
			return bonitaUsername;
		};

		/**
		 * Set the currently logged Bonita user name
		 * 
		 * @param newBonitaUsername
		 */
		api.setUsername = function (newBonitaUsername) {
			bonitaUsername = newBonitaUsername;

			// FIXME is storing into cookies really necessary ?
			$cookies.bonitaUsername = newBonitaUsername;
		};

		return api;
	};
});

'use strict';

angular.module('ngBonita').factory('bonitaUtils', function ($http) {
	var api = {};

	/**
	 * Configure the Bonita application URL (must include application name
	 * without trailing slash)
	 * 
	 * @param url
	 */
	var paginateResponse = function (data, headersGetter) {
		// Parse pagination header
		var strContentRange = headersGetter()['content-range'];
		var arrayContentRange = strContentRange.split('/');
		var arrayIndexNumPerPage = arrayContentRange[0].split('-');
		// Assemble response data with pagination
		return {
			items : angular.fromJson(data),
			pageIndex : Number(arrayIndexNumPerPage[0]),
			pageSize : Number(arrayIndexNumPerPage[1]),
			totalCount : Number(arrayContentRange[1])
		};
	};

	api.transformPaginateresponse = function () {
		return [ paginateResponse ].concat($http.defaults.transformResponse);
	};

	return api;
});

'use strict';

/**
 * Resource used to access Bonita archived human tasks instances
 */
angular.module('ngBonita').factory('ArchivedHumanTask', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedHumanTask/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'reached_state_date ASC'
	}, {
		getCompletedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'assigned_id=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});

'use strict';

/**
 * Resource used to access Bonita archived process instances (cases)
 */
angular.module('ngBonita').factory('ArchivedProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedCase/:id', {
		id : '@id',
		p : 0,
		c : 10
	}, {
		getStartedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'started_by=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});

'use strict';

/**
 * Resource used to access Bonita session information
 */
angular.module('ngBonita').factory('BonitaSession', function ($resource, bonitaConfig) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/system/session/unused', {}, {
		getCurrent : {
			method : 'GET'
		}
	});
});

'use strict';

/**
 * Resource used to access Bonita human tasks instances
 */
angular.module('ngBonita').factory('HumanTask', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/humanTask/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'priority ASC'
	}, {
		getFromCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'state=ready', 'user_id=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});

'use strict';

/**
 * Resource used to access Bonita process definition (apps)
 */
angular.module('ngBonita').factory('ProcessDefinition', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/process/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'displayName ASC'
	}, {
		getStartableByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'user_id=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});

'use strict';

/**
 * Resource used to access Bonita process instances (cases)
 */
angular.module('ngBonita').factory('ProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/case/:id', {
		id : '@id',
		p : 0,
		c : 10
	}, {
		getStartedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'started_by=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});

'use strict';

/**
 * Resource used to access Bonita users
 */
angular.module('ngBonita').factory('User', function ($resource, bonitaConfig) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/identity/user/:id', {
		id : '@id'
	});
});
