'use strict';

define(
	[
		'canjs',
		'underscore',
		'app/projects/project',
		'app/projects/projectsModel',
		'core/appState',
		'css!app/projects/css/projects'
	], 

	function (can, _, Project, ProjectsModel, appState) {

		var ViewModel = can.Map.extend({
			define: {
                projects: {
				value: new ProjectsModel.List({})
				},
				viewState: {
					value: 'list',
					serialize: false
				}
			},
			reOrderProjects: function () {
				var projects = this.attr('projects'),
					orderedProjects = _.sortBy(projects, function (project) {
						return +project.position;
					});
                projects.replace(orderedProjects);
			},
			toList: function () {
				can.route.attr({
					module: 'projects'
				}, true);
				this.attr('viewState', 'list');
			},
			toEntity: function (project_id) {
				can.route.attr({
					entity_id: project_id,
					action: 'set',
					module: 'projects'
				}, true);
			}
		});

		return can.Control.extend({
			defaults: {
				viewpath: 'app/projects/views/',
                ProjectsModel: ProjectsModel
			}
		}, {
			init: function () {
				var self = this,
					route = can.route.attr();

				self.viewModel = new ViewModel;

				if (route.entity_id && route.action) {
					self.viewModel.attr('viewState', 'edit');
				}

				self.element.html(can.view(self.options.viewpath + 'index.stache', this.viewModel, {
                    langs: langs
				}));

				var projects = self.viewModel.attr('projects');

				can.when(projects).then(function () {
					if (route.entity_id && route.action) {
						self.setProject(route.entity_id, route.action);
					}
				});

			},

			/*
			 * Routes
			 */

			':module route': function (data) {
				var viewModel = this.viewModel;
				if (data.module === 'projects' && viewModel.attr('viewState') !== 'list') {
					viewModel.toList();
				}
			},

			':module/:action/:entity_id route': function (data) {
				if (data.module === 'projects') {
					this.setProject(data.entity_id, data.action);
				}
			},

			/*
			 * Set project functions
			 */

			'.addProject click': function (el) {
				this.viewModel.toEntity('0');				
			},

			'.editProject click': function (el) {
				var project = el.parents('.project').data('project');
				this.viewModel.toEntity(project.attr('_id'));
			},

			setProject: function (id) {
				this.viewModel.attr({
					'id': Date.now(),
					'viewState': 'edit'
				})				

				var formWrap = this.element.find('.setProjectWrap'),
                    project = _.find(this.viewModel.projects, function (project) {
						return project.attr('_id') === id;
					});

				new Project(formWrap, {
                    project: project ? project : new ProjectsModel()
				});
			},

			'.removeProject click': function (el) {
				var project = el.parents('.project').data('project');
                var name = project.attr('lang.0.name') ? project.attr('lang.0.name') : '';
				if (confirm('Вы действительно хотите удалить проект: "' + name + '"?')) {
                    project.destroy().always(function (project, status, def) {
                        console.log(arguments);
						appState.attr('notification', {
							status: status,
							msg: project['lang'][0]['name'] + '. '+ def.responseJSON.message
						})
					});
				}
			},

			'{ProjectsModel} updated': function () {
				this.viewModel.reOrderProjects();
			},

			'{ProjectsModel} created': function (Model, ev, project) {
				var self = this,
                    projects = self.viewModel.attr('projects');
                projects.push(project);
				this.viewModel.reOrderProjects();
			}

		});

	}
);