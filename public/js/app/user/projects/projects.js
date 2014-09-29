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
                    can.view(self.options.viewpath + 'index.stache', { })
                );

                if (self.options.isReady) {
                    self.projectsContainer = $('.projectsWrapper');
                    self.options.isReady.resolve();
                    self.renderFirstProject();
                }
            },

            leftRightImg: function() {

                var self = this,
                    width = $(window).width(),
                    $bgWrapper = $('.bgWrapper'),
                    project = self.firstProject(),
                    last,
                    second;

                last = project.img[project.img.length-1];
                second = project.img[1];

                $bgWrapper.append('<div class="projectBg right" style="background-image: url(' + appState.uploadPath + second + '); ' +
                                                                       'left:' + width +   'px;">');

                $bgWrapper.append('<div class="projectBg left" style="background-image: url(' + appState.uploadPath + last + '); ' +
                    'left: -' + width +   'px;">');
            },

            '.btn-proj-r click': function() {
                var widthCurrent = $(window).width(),
                    widthLeft = - widthCurrent;


//                $('.right').animate({left: 0}, 1000, function(){
//                    $('.current').css({left: widthLeft});
//                    $('.current').toggleClass('current  left');
//                    $('.right').toggleClass('right current');
//                }); need replaced by velocity

            },

            '.btn-proj-l click': function() {
                var widthCurrent = $(window).width(),
                    widthRight = widthCurrent;

//
//                $('.left').animate({left: 0}, 1000, function(){
//                    $('.current').css({left: widthRight});
//                    $('.current').toggleClass('current right');
//                    $('.left').toggleClass('left current');
//                });

            },

            renderFirstProject: function () {
                var self = this,
                    firstProject;

                firstProject = self.firstProject();

                self.projectsContainer.html(
                    can.view(self.options.viewpath + 'project.stache', {
                        appState: appState,
                        project: firstProject
                    })
                );

                self.leftRightImg();
            },

            firstProject: function() {
                var firstProject;

                firstProject = appState.projects[0];

                return firstProject;

            }

        });

    }
);
