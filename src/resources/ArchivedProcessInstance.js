'use strict';

/**
 * Resource used to access Bonita archived process instances (cases)
 */
angular.module('ngBonita').factory('ArchivedProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedCase/:id', data, {
		getStartedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'started_by=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
