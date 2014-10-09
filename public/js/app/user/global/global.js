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
                var element = el.data(),
                    elementScrollOffset = $(element['scroll']).offset();

                if (elementScrollOffset) {
                    $('html, body').animate({scrollTop: $(element['scroll']).offset().top}, 1000);
                }
            }

		});
	}
);