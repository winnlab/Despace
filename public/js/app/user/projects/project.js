define([
    'canjs',
    'core/appState',
    'css!app/projects/css/projects.css'
],
    function (can, appState) {

        var Gallery = can.Map.extend({
            'uploadPath': appState.attr('uploadPath'),
            'index': 0,
            'visible': true,
            'size': 0,

            setImage: function() {
                var self = this,
                    index = this.attr('index'),
                    img = $('project').find('.img_' + index),
                    imgPrev = (index-1),
                    imgNext = (index+1),
                    classCurrent = 'current',
                    classRight = 'right',
                    classLeft = 'left';

                if(!img.length) {
                    console.log(self.attr('images')[index]);
                    img = $('<img />').attr({
                        'class': 'projectBg img_' + index,
                        'src': self.attr('uploadPath') + self.attr('images')[index]
                    });
                    img.appendTo($('project').find('.bgWrapper'));
                }

                if (imgPrev == -1) {
                    imgPrev = $('project').find('.img_' + (this.images.length -1)); //  need length el page last
                } else {
                    imgPrev = $('project').find('.img_' + (index-1));
                }

                if (imgNext == this.images.length) { // need length el page first
                    imgNext = $('project').find('.img_' + 0);
                } else {
                    imgNext = $('project').find('.img_' + (index+1));
                }

                $('project').find('.projectBg').removeClass(classRight).removeClass(classLeft).removeClass(classCurrent).css({opacity: 0});

                imgPrev.addClass(classLeft).css({opacity: 1});
                imgNext.addClass(classRight).css({opacity: 1});
                img.addClass(classCurrent).css({opacity: 1});

            }

        });

        can.Component.extend({
            tag: "project",
            scope:  Gallery,

            template: '<div class="projectItem">' +
                            '<div class="btn-project btn-proj-r"> </div>' +
                            '<div class="btn-project btn-proj-l"> </div>' +
                            '<div class="bgWrapper">' +

                            '</div>' +
                            '<div class="btn-proj-info">' +
                            '{{#if visible}}' +
                                '<div class="info-proj">' +
                                    '<p> Donec ut lorem justo. Cras in. </p>' +
                                    '<p> Donec ut lorem justo. Cras in. </p>' +
                                    '<div class="info-triangle"> </div>' +
                                '</div>' +
                            '{{/if}}' +
                             '</div>' +
                        '</div>',

            events: {
                '.btn-proj-r click': function(){
                    var index = this.scope.attr('index');

                    if (index == this.scope.attr('images').length - 1) {

                        this.scope.attr('index', 0);
                    } else {

                        this.scope.attr('index', index + 1);
                    }

                    this.scope.setImage();
                },

                '.btn-proj-l click': function(){
                    var index = this.scope.attr('index');

                    if (index == 0) {

                        this.scope.attr('index', this.scope.attr('images').length - 1);
                    } else {

                        this.scope.attr('index', index - 1);
                    }

                    this.scope.setImage();
                },

                '.btn-proj-info click': function(){

                    if(this.scope.attr('visible')) {

                        this.scope.attr('visible', false);
                    } else {

                        this.scope.attr('visible', true);
                    }

                },

                inserted: function () {
                    var self = this;

//                    var test = self.scope.attr('images');
//                    self.scope.attr('images').push(test[0]);
//                    self.scope.attr('images').push(test[1]);

                    self.scope.setImage();


                    console.log(self.scope.attr('images').attr());

                }
            }
        });

    }
);