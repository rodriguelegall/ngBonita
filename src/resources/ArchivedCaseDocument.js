'use strict';

/**
 * Resource used to access Bonita achived process documents
 * Available from Bonita 6.4 onward
 */
angular.module('ngBonita').factory('ArchivedCaseDocument', function ($resource, bonitaConfig, bonitaUtils) {
	var data = angular.extend({
		id : '@id'
	}, bonitaConfig.getDefaultPager());

	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedCaseDocument/:id', data, {
		getUploadedByCurrentUser : {
			method : 'GET',
			params : {
				f : function () {
					return [ 'submittedBy=' + bonitaConfig.getUserId() ];
				}
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		},
		search : {
			method : 'GET',
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
