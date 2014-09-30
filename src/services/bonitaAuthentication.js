'use strict';

/**
 * Factory that manages Bonita authentication
 */
angular.module('ngBonita').factory('bonitaAuthentication', function ($log, $http, $q, BonitaSession, bonitaConfig, bonitaUtils) {

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
			data : bonitaUtils.serializeData({
				username : username,
				password : password,
				redirect : false
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).success(function () {
			$log.log('BonitaAuthentication.login success');
			// Retrieve current session to get user id
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
			data : bonitaUtils.serializeData({
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
