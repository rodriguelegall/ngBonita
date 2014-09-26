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
