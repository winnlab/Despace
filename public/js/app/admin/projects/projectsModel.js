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
                console.log(value);

                var images = this.attr('img').attr();

//                if(value instanceof Object){
//                    images.push(value.name);
//                    this.attr('img', images);
//                } else {
                    value.forEach(function (val){
                       images.push(val.name);
                        console.log(val.name);
                    });
                    this.attr('img', images);
//                }

//                if (typeof this.attr('img') === 'object') {
//                    this.attr('img').push(value.name);
//                } else {
//                    this.attr('img', [value]);
//                }



			},
			removeUploaded: function (name, index) {
                this.attr('img').splice(index, 1);
			}
		});

	}
);