define([
    'canjs',
    'core/appState',
    'css!app/projects/css/projects.css'
],
    function (can, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/projects/'
            }
        }, {
            init: function () {
                var self = this;

                self.element.html(
                    can.view(self.options.viewpath + 'index.stache', { }));

                if (self.options.isReady) {
                    self.options.isReady.resolve();
                    self.imageProjects();
                }
            },

            imageProjects: function() {
            var ga = appState.projects[0].img[0];
                console.log(ga);

            }

        });

    }
);
