define(
	[
		'canjs',
		'core/appState'
	], 

	function (can, appState) {

		return can.Control.extend({
			defaults: {
                projectForm: '.setProject',
				viewpath: 'app/projects/views/'
			}
		}, {
			init: function () {
				var self = this,
                    project = self.options.project;

				self.element.html(can.view(self.options.viewpath + 'set.stache', {
                    project: project,
					langs: langs
				}));
			},

			'{projectForm} submit': function (el, ev) {
				ev.preventDefault();

				var self = this,
                    projectData = can.deparam(el.serialize()),
                    project = self.options.project;

				if (!projectData.active) {
                    projectData.active = false;
				}

                project.attr(projectData);

                project.save()
				.done(function() {					
					can.route.attr({'entity_id': project.attr('_id')});
					self.setNotification('success', 'Продукт "' + project.getName() + '" успешно сохранен!')
				})
				.fail(function (project) {
					console.error(project);
					self.setNotification('error', 'Ошибка сохранения продукта "' + project.getName() + '"!')
				});
				
			},

			setNotification: function (status, msg) {
				appState.attr('notification', {
					status: status,
					msg: msg
				});
			}
		});

	}
);