define(
	[
		'canjs',
		'core/appState',
        '../../../admin/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min',
        'css!../../../admin/plugins/bootstrap-wysihtml5/css/bootstrap3-wysihtml5.min.css'
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

                console.log(project.attr());

				if (!projectData.active) {
                    projectData.active = false;
				}

                project.attr(projectData);

                project.save()
				.done(function() {					
					can.route.attr({'entity_id': project.attr('_id')});
					self.setNotification('success', 'Проект "' + project.getName() + '" успешно сохранен!')
				})
				.fail(function (project) {
					console.error(project);
					self.setNotification('error', 'Ошибка сохранения проекта "' + project.getName() + '"!')
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