define([
	'canjs'
],
	function (can) {

		var AppState = can.Map.extend({

				//Settings
				imgPath: '/img/user/',
				uploadPath: '/uploads/',

				// Data
				locale: data && data.locale ? data.locale : false,
				lang: data && data.lang ? '/' + data.lang + '/' : '/',
				langs: data && data.langs ? data.langs : false,

                simplePages: data && data.simplePages ? data.simplePages : false,
                projects: data && data.projects ? data.projects : false

			}),
			appState = new AppState();

		window['appState'] = appState;
		// delete window.data;

		return appState;
	}
);