'use strict';

angular.module('ngBonita').factory('bonitaUtils', function ($http,bonitaConfig) {
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
		var arrayContentRange = strContentRange ? strContentRange.split('/') :[ bonitaConfig.getDefaultPager().p + '-' + bonitaConfig.getDefaultPager().c];
		var arrayIndexNumPerPage = arrayContentRange[0].split('-');
		// Assemble response data with pagination
		return {
			items : angular.fromJson(data),
			pageIndex : Number(arrayIndexNumPerPage[0]),
			pageSize : Number(arrayIndexNumPerPage[1]),
			totalCount : Number(arrayContentRange[1])
		};
	};

	api.transformPaginateResponse = function () {
		return [ paginateResponse ].concat($http.defaults.transformResponse);
	};

	/**
	* Serializes data into an URI format (credit: Sudhir from stackoverflow)
	*/
	api.serializeData = function (data) {
		// If this is not an object, defer to native stringification.
		if (!angular.isObject(data)) {
			return (data === null) ? '' : data.toString(); 
		}
		
		var buffer = [];

		// Serialize each key in the object.
		for (var name in data) { 
			if (!data.hasOwnProperty(name)) {
				continue; 
			}

			var value = data[name];

			buffer.push(
				encodeURIComponent(name) + '=' + encodeURIComponent((value === null) ? '' : value)
			); 
		}

		// Serialize the buffer and clean it up for transportation.
		var source = buffer.join('&').replace(/%20/g, '+'); 
		return (source); 
	};
	 
	return api;
});
