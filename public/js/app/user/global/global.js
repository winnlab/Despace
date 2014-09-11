define([
	'canjs',
	'core/appState',
	
	'css!app/global/css/global.css'
],
	function (can) {
		
		return can.Control.extend({
			defaults: {
				viewpath: 'app/global/',
				hidden: ['contacts', 'checker']
			}
		}, {

			init: function () {
				var self = this,
					html = can.view(self.options.viewpath + 'index.stache', {
						appState: appState
					});

				self.element.append(html);
			},

            '.scroll click': function(el, ev) {
                var navi = el.data();
                $('html, body').animate({scrollTop: $(navi['scroll']).offset().top}, 1000);
            }
		});
	}
);