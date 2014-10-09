define([
	'canjs',
    'underscore'
],
	function (can, _) {

        function computedVal (value) {
            if (typeof value === 'function') {
                value = value();
            }
            return value;
        };

		can.mustache.registerHelper('checkState', function (options) {
			return options.context.attr('viewState') === 'list'
				? options.fn()
				: options.inverse();
		});

		can.mustache.registerHelper('isPrimitive', function (observer, primitive, options) {
			return observer() === primitive ? options.fn() : options.inverse();
		});

		can.mustache.registerHelper('getArrayObjValue', function (array, index, key) {			
			return array() ? array().attr(index + '.' + key) : '';
		});

        can.mustache.registerHelper('sortedBy', function (collection, prop, direction, options) {
            if (arguments.length == 3) {
                options = direction;
                direction = false;
            }
            collection = computedVal(collection);
            if (collection && collection.attr('length') && prop) {
                var sorted = _.sortBy(collection, function (member) {
                    return member.attr(prop);
                });

                if (direction && direction == 'desc') {
                    sorted.reverse();
                }

                return _.map(sorted, function (member, index) {
                    return options.fn(options.scope
                        .add({'@index': index})
                        .add(member)
                    );
                }).join('');
            }
        });
		
		can.mustache.registerHelper('createForm', function (id, className) {
			return '<div id="' + id() + '" class="right-side ' + className + '"></div>';
		});

		can.mustache.registerHelper('checkSelected', function (id, anotherId) {
			return id() === anotherId() ? 'selected' : '';
		});

		can.mustache.registerHelper('checkRelation', function (id, relId, options) {
			return id() === relId() ? options.fn() : options.inverse();
		});		

		can.mustache.registerHelper('getBoxName', function (index) {
			var classes = ['bg-light-blue', 'bg-red', 'bg-green', 'bg-yellow', 'bg-maroon', 'bg-purple', 'bg-aqua'];
			return classes[computedVal(index) % classes.length]
		});

		can.mustache.registerHelper('make3Col', function (index) {
			return (index() + 1) % 3 === 0 ? '<div class="clearfix"></div>' : '';
		});

        can.mustache.registerHelper('checkLanguages', function (languages, name, description) {
        });

        can.mustache.registerHelper('wysihtml5', function (index) {
            return function (el) {
                $(el).wysihtml5();
            };
        });

	}
);