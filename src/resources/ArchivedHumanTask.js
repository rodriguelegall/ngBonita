'use strict';

/**
 * Resource used to access Bonita archived human tasks instances
 */
angular.module('ngBonita').factory('ArchivedHumanTask', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id',
		o : 'reached_state_date ASC'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedHumanTask/:id', data, {
		getCompletedByCurrentUser : {
			method : 'GET',
			params : {
				f : function () {
					return [ 'assigned_id=' + bonitaConfig.getUserId() ];
				}
			},
			transformResponse : bonitaUtils.transformPaginateResponse()
		}
	});
});
