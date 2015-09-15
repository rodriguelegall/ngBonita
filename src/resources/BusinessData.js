'use strict';


angular
	.module('ngBonita')
	.factory('BusinessData', function ($resource, bonitaConfig, bonitaUtils) {
		var data = angular.extend({
			businessDataType: '@businessDataType',
			q: '@queryName',
			f: '@fields',
			persistanceId: '@persistenceId'

		}, bonitaConfig.getDefaultPager());
		
		//$resource(url,[paramDefaults],[actions],options);		
		return $resource(
			bonitaConfig.getBonitaUrl() + '/API/bdm/businessData/:businessDataType/:persistenceId', // url
			data, //paramDefaults
			{
				getDataQuery: {
					method: 'GET',
					params: {
						q: function () {
							return data.q;
						},
						f: function () {
							return data.f;
						}
					},
					transformResponse: bonitaUtils.transformPaginateResponse()
				},// actions
				getBusinessData: {
					method: 'GET'					
				}
			});
	});