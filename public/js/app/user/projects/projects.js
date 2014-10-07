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
                    'projects': appState.attr('projects'),
                    'projectsPage': [],
                    'visibleBtn': true,
                    'index': 1,
                    'indexSplice': 2,
                    'direction': '',
                    'current': 0
                });

                /*
                 *  push new projects 1-3
                 */

                var arr = self.module.attr('projects');

                if (arr.length -1 >= 2) {
                    var firstProject = arr[0],
                        secondProject = arr[1],
                        lastProject = arr[arr.length-1];

                    self.module.attr('projectsPage').push(firstProject);
                    self.module.attr('projectsPage').push(secondProject);
                    self.module.attr('projectsPage').push(lastProject);

                } else if (arr.length -1 == 1) {
                    self.module.attr('projectsPage', arr);

                } else {
                    self.module.attr('projectsPage', arr);
                    self.module.attr('visibleBtn', false);
                }

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
                                    result = 'prev-project';
                                } else if (current > 0 && index === current - 1) {
                                    result = 'prev-project';
                                }
                            }

                            if (direction == 'bottom') {
                                if (current === projectsLength - 1 && index === 0) {
                                    result = 'next-project';
                                } else if (current < projectsLength - 1 && index === current + 1) {
                                    result = 'next-project';
                                }
                            }

                            return result;
                        }
                    },
                    function(html) {
                        self.element.html(html);

                        if (self.options.isReady) {
                            self.options.isReady.resolve();
                        }

                        self.calculateBlockSizes();
                        $('.carousel').carousel({interval: 0});

                    }
                );
            },

            calculateBlockSizes: function () {
                var self = this,
                    windowHeight = $(window).height(),
                    windowWidth = $(window).width();

                $('.img-gallery').css('height', windowHeight); // подгоняем background под разрешение пользователя
            },

            '{window} resize': function () {
                var self = this;
                self.calculateBlockSizes();
            },

            setProject: function (direction) {
                var self = this,
                    arrIndex = self.module.attr('projects').length -1,
                    arrPageIndex = self.module.attr('projectsPage').length -1,
                    indexSplice = self.module.attr('indexSplice'),
                    index = self.module.attr('index');

                switch(direction) {
                    case -1:
                        if (arrPageIndex < arrIndex) {
                            if (!self.findProject(index)) {
                                self.module.attr('projectsPage').splice(indexSplice, 0, self.module.attr('projects')[index]);
                            }
                        }
                        break;
                    case 1:
                        if (arrPageIndex < arrIndex) {
                            if (!self.findProject(index)) {
                                self.module.attr('indexSplice', indexSplice +1);
                                self.module.attr('projectsPage').splice(index, 0, self.module.attr('projects')[index]);
                            }
                        }
                        break;
                    default:
                        console.error('Error!');
                }

            },

            findProject: function (index) {
                var self = this,
                    arr = self.module.attr('projects'),
                    arrPage= self.module.attr('projectsPage');

                for (var i = (arrPage.length -1); i >= 0; i--) {
                    if (arr[index]['_id'] == arrPage[i]['_id']) {
                        return true;
                    }
                }
                return false;
            },

            '.btn-proj-t click': function () {
                var self = this;

                var index = self.module.attr('index');

                if (index == 1) {
                    self.module.attr('index', self.module.attr('projects').length - 2);
                } else {
                    self.module.attr('index', index - 1);
                }

                this.setProject(-1);

                //................................................

                var current = self.module.attr('current') + 1;

                if (current == self.module.attr('projects.length')) {
                    current = 0;
                }

                self.module.attr('direction', 'top');

//                $('.current').animate({top: 100+'%'}, 500);
//                $('.top').animate({top: 0+'%'}, 500);

                setTimeout(function () {
                    self.module.attr('direction', '');
                    self.module.attr('current', current);
                }, 500);

            },

            '.btn-proj-b click': function () {
                var self = this;

                var index = self.module.attr('index');

                if (index == self.module.attr('projects').length - 2) {
                    self.module.attr('index', 1);
                } else {
                    self.module.attr('index', index + 1);
                }

                this.setProject(1);

                //................................................

                var current = self.module.attr('current') - 1;

                if (current < 0) {
                    current = self.module.attr('projects.length') - 1;
                }

                self.module.attr('direction', 'bottom');
//                $('.current').animate({top: -100+'%'}, 500);
//                $('.top').animate({top: 0+'%'}, 500);

                setTimeout(function () {
                    self.module.attr('direction', '');
                    self.module.attr('current', current);
                }, 500);

            }

        });

    }
);
