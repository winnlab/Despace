define(
	[
		'canjs'		
	], 

	function (can) {

		return can.Model.extend({
			id: "_id",
			findAll: "GET /admin/project",
			findOne: "GET /admin/project/{id}",
			create:  'POST /admin/project',
			update:  'PUT /admin/project',
			destroy: 'DELETE /admin/project/{id}',
			parseModel: function (data) {
				if (data.success) {
					data = data.message;
				}
				return data;
			},
			parseModels: function (data) {
				return data.message.projects;
			}
		}, {
			getName: function () {
				var name = this.attr('lang.0.name');
				return name ? name : '';
			},
			uploaded: function (name, value) {
				if (!this.attr('img')) {
					this.attr('img', {});
				}
				var imgs = this.attr('img');
				imgs.attr(name, value);
			},
			removeUploaded: function (name) {
				var imgs = this.attr('img');				
				imgs.attr(name, undefined);
			}
		});

	}
); 