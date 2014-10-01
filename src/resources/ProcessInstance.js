'use strict';

/**
 * Resource used to access Bonita process instances (cases)
 */
angular.module('ngBonita').factory('ProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/case/:id', data, {
		getStartedByCurrentUser : {
			method : 'GET',
			params : {
				f : function () {
					return [ 'started_by=' + bonitaConfig.getUserId() ];
				}
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
