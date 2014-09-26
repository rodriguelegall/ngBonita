'use strict';

/**
 * Resource used to access Bonita process definition (apps)
 */
angular.module('ngBonita').factory('ProcessDefinition', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id',
		o : 'displayName ASC'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/process/:id', data, {
		getStartableByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'user_id=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
