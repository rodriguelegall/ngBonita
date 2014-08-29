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
 * This module provide easy access to all rest api of Bonita BPM Engine
 *
 * @author Philippe Ozil
 * @author Rodrigue Le Gall
 */
(function() {
	var app = angular.module('ngBonita', ['ngResource', 'ngCookies']);
	
	app.factory('bonita', ['$log', '$http', '$cookies', function($log, $http, $cookies){
		var bonita = {};
		
		bonita.username = null;
		bonita.userId = null;
        app.bonitaUrl = '';

        /**
         * Configure the Bonita server root url
         * @param url
         */
        bonita.setBonitaUrl = function(url){
            app.bonitaUrl = url;
        }
		
		/**
		* Performs a Bonita login
		* @param username
		* @param password
		* @param fnCallback function called after operation: fnCallback(boolean isSuccess)
		*/
		bonita.login = function(username, password, fnCallback)
		{
			$http({
				method: 'POST',
				url: app.bonitaUrl+'/bonita/loginservice',
				data: $.param({username : username, password : password, redirect : false}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).success(function (data) {
				$log.log('bonita.login success');
				bonita.getSession(function(session) {
					if (session == null)
						fnCallback(false);
					else
					{
						bonita.username = session.user_name;
						bonita.userId = session.user_id;
						
						$cookies.username = session.user_name;
						$cookies.userId = session.user_id;
						
						fnCallback(true);
					}
				});
			}).error(function (data, status) {
				$log.log('bonita.login failure response '+ status);
				fnCallback(false);
			});
		};
		
		/**
		* Performs a Bonita logout
		*/
		bonita.logout = function()
		{
			$http({
				method: 'GET',
				url: app.bonitaUrl+'/bonita/logoutservice',
				data: $.param({redirect : false}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			});
		};
		
		/**
		* Gets the current Bonita user session (called by login method in order to retrieve user id and to check for existing Bonita session)
		* @param fnCallback function called after operation: fnCallback(object session). If an error occurs, callback is passed null parameter.
		*/
		bonita.getSession = function(fnCallback)
		{
			$http.get(app.bonitaUrl+'/bonita/API/system/session/1').success(function (data) {
				$log.log('bonita.getSession success: user_name='+ data.user_name +", user_id="+ data.user_id);
				fnCallback(data);
			}).error(function (data, status) {
				$log.log('bonita.getSession failure response '+ status +': '+ data);
				fnCallback(null);
			});
		}
		
		return bonita;
	}]);
	
	app.factory('HumanTask', ['$resource', '$cookies', function($resource, $cookies){
		return $resource(app.bonitaUrl+'/bonita/API/bpm/humanTask', {p:0, c:10, o : 'priority ASC'},
			{
				getFromCurrentUser : {method:'GET', params:{f : ['state=ready', 'user_id='+ $cookies.userId]}, isArray : true}
			}
		);
	}]);
	
	app.factory('ProcessDefinition', ['$resource', '$cookies', function($resource, $cookies){
		return $resource(app.bonitaUrl+'/bonita/API/bpm/process', {p:0, c:10, o : 'displayName ASC'},
			{
				getAllStartableByCurrentUser : {method:'GET', params:{f : ['user_id='+ $cookies.userId]}, isArray : true}
			}
		);
	}]);
	
})();

