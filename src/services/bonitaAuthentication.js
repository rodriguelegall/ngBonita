'use strict';

/**
 * Factory that manages Bonita authentication
 */
angular.module('ngBonita').factory('bonitaAuthentication', function ($log, $http, $cookies, $q, BonitaSession, bonitaUtils) {

	var bonitaAuthentication = {};

	/**
	 * Configure the Bonita application URL (must include application name
	 * without trailing slash)
	 * 
	 * @param url
	 */
	bonitaAuthentication.setBonitaUrl = function (url) {
		$cookies.bonitaUrl = url;
	};

	/**
	 * Gets the Bonita application URL
	 * 
	 * @param url
	 */
	bonitaAuthentication.getBonitaUrl = function () {
		return $cookies.bonitaUrl;
	};

	/**
	 * Retrieves the currently logged Bonita user id
	 * 
	 * @return logged Bonita user id
	 */
	bonitaAuthentication.getUserId = function () {
		return $cookies.bonitaUserId;
	};

	/**
	 * Retrieves the currently logged Bonita user name
	 * 
	 * @return logged Bonita user name
	 */
	bonitaAuthentication.getUsername = function () {
		return $cookies.bonitaUsername;
	};

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
			url : $cookies.bonitaUrl + '/loginservice',
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
			// Retrieve current session
			// to get user id
			BonitaSession.getCurrent().$promise.then(function (session) {
				if (session === null) {
					deferred.reject('No active session found');
				} else {
					// Save
					// basic
					// session
					// data
					$cookies.bonitaUsername = session.user_name;
					$cookies.bonitaUserId = session.user_id;
					deferred.resolve(session);
				}
			});
		}).error(function (data, status, headers, config) {
			$log.log('BonitaAuthentication.login failure response ' + status);
			$log.log('Bonita URL: ' + $cookies.bonitaUrl);
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
			url : $cookies.bonitaUrl + '/logoutservice',
			data : bonitaUtils.serializeData({
				redirect : false
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).success(function () {
			$log.log('BonitaAuthentication.logout success');
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
