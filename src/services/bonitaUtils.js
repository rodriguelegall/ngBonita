'use strict';

angular.module('ngBonita').factory('bonitaUtils', function ($http) {
	var api = {};

	/**
	 * Configure the Bonita application URL (must include application name
	 * without trailing slash)
	 * 
	 * @param url
	 */
	var paginateResponse = function (data, headersGetter) {
		// Parse pagination header
		var strContentRange = headersGetter()['content-range'];
		var arrayContentRange = strContentRange.split('/');
		var arrayIndexNumPerPage = arrayContentRange[0].split('-');
		// Assemble response data with pagination
		return {
			items : angular.fromJson(data),
			pageIndex : Number(arrayIndexNumPerPage[0]),
			pageSize : Number(arrayIndexNumPerPage[1]),
			totalCount : Number(arrayContentRange[1])
		};
	};

	api.transformPaginateresponse = function () {
		return [ paginateResponse ].concat($http.defaults.transformResponse);
	};

	return api;
});
