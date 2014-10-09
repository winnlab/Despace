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

                console.log(this.attr('img'));
                if (!this.attr('img')) {
                    this.attr('img', []);
                }
                var images = this.attr('img').attr();


                if(value instanceof Array){
                    value.forEach(function (val){
                        images.push(val.name);
                     });
                    this.attr('img', images);
                } else if(value instanceof Object) {
                    images.push(value.name);
                    this.attr('img', images);
                }

			},
			removeUploaded: function (name, index) {
                this.attr('img').splice(index, 1);
			}
		});

	}
);