define([
    'canjs',
    'core/appState',
    'carousel',
    'app/projects/project',
    'css!app/projects/css/projects.css'
],
    function (can, appState, carousel) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/projects/'
            }
        }, {
            init: function () {
                var self = this;

                self.module = new can.Map({
                    projects: appState.attr('projects'),
                    direction: '',
                    current: 0
                });

                can.view(self.options.viewpath + 'index.stache', self.module,
                    {
                        getClassName: function (index, options) {
                            var result = '',
                                direction = self.module.attr('direction'),
                                current = self.module.attr('current'),
                                projectsLength = self.module.attr('projects.length');
                            index = index();

                            if (index === current) {
                                result = 'current';
                            }

                            if (direction == 'top') {
                                if (current === 0 && index === projectsLength - 1) {
                                    result = 'prev';
                                } else if (current > 0 && index === current - 1) {
                                    result = 'prev';
                                }
                            }

                            if (direction == 'bottom') {
                                if (current === projectsLength - 1 && index === 0) {
                                    result = 'next';
                                } else if (current < projectsLength - 1 && index === current + 1) {
                                    result = 'next';
                                }
                            }

                            return result;
                        }
                    },
                    function(html) {
                        self.element.html(html);

                        if (self.options.isReady) {
                            self.options.isReady.resolve();
                            $('.carousel').carousel({interval: 0});
                        }
                    }
                );
            },

            '.btn-proj-t click': function () {
                var self = this,
                    current = self.module.attr('current') + 1;

                if (current == self.module.attr('projects.length')) {
                    current = 0;
                }

                self.module.attr('direction', 'top');

                setTimeout(function () {
                    self.module.attr('direction', '');
                    self.module.attr('current', current);
                }, 500);

            },

            '.btn-proj-b click': function () {
                var self = this,
                    current = self.module.attr('current') - 1;

                if (current < 0) {
                    current = self.module.attr('projects.length') - 1;
                }

                self.module.attr('direction', 'bottom');

                setTimeout(function () {
                    self.module.attr('direction', '');
                    self.module.attr('current', current);
                }, 500);
            }

        });

    }
);
