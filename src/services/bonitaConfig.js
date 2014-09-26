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
