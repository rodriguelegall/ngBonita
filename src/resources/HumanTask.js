'use strict';

/**
 * Resource used to access Bonita human tasks instances
 */
angular.module('ngBonita').factory('HumanTask', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id',
		o : 'priority ASC'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/humanTask/:id', data, {
		getFromCurrentUser : {
			method : 'GET',
			params : {
				f : function () {
					return [ 'state=ready', 'user_id=' + bonitaConfig.getUserId() ];
				}
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
