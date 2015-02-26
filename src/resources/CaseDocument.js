'use strict';

/**
 * Resource used to access Bonita process documents
 * Available from Bonita 6.4 onward
 */
angular.module('ngBonita').factory('CaseDocument', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/caseDocument/:id', data, {
		getUploadedByCurrentUser : {
			method : 'GET',
			params : {
				f : function () {
					return [ 'submittedBy=' + bonitaConfig.getUserId() ];
				}
			},
			transformResponse : bonitaUtils.transformPaginateResponse()
		},
		search : {
			method : 'GET',
			transformResponse : bonitaUtils.transformPaginateResponse()
		}
	});
});
