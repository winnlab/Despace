define([
    'canjs',
    'carousel',
    'core/appState',
    'css!app/projects/css/projects.css'
],
    function (can, carousel, appState) {

        var Gallery = can.Map.extend({
            'uploadPath': appState.attr('uploadPath'),
            'imagesArr': [],
            'imagesPageArr': [],
            'index': 0,
            'visibleClass': true,
            'visibleInfo': false,
            'visibleButtons': true,

            setImg: function () {
                var self = this,
                    arrIndex = self.attr('imagesArr').length -1,
                    arrPageIndex = self.attr('imagesPageArr').length -1,
                    index = self.attr('index');

                if (arrPageIndex < arrIndex) {
                    if (!self.findImg(index)) {
                    self.attr('imagesPageArr').push(self.attr('imagesArr')[index]);
                    }
                }

            },

            findImg: function (index) {
                var self = this,
                    arr = self.attr('imagesArr'),
                    arrPage= self.attr('imagesPageArr');

                for (var i = (arrPage.length -1); i >= 0; i--) {
                        if (arr[index] == arrPage[i]) {
                         return true;
                    }
                }
                return false;
            }

        });

        can.Component.extend({
            tag: "project",
            scope:  Gallery,

            init: function () {
                var self = this,
                    arr = self.scope.attr('images').attr(),
                    firstImg = arr[0];

                if (arr.length -1 >= 1) {
                    self.scope.attr('imagesArr', arr);
                    self.scope.attr('imagesPageArr').push(firstImg);
                } else {
                    self.scope.attr('imagesPageArr').push(firstImg);
                    self.scope.attr('visibleButtons', false);
                }


            },

            template: '<div class="projectItem">' +
                                '<div class="bgWrapper">' +
                                '<div id="carousel" class="carousel slide" data-ride="carousel">' +
                                    '<div class="carousel-inner">' +
                                        '{{#each imagesPageArr}}' +
                                        '<div class="item {{setClass @index}}">' +
                                            '<img src="{{uploadPath}}{{.}}">' +
                                        '</div>' +
                                        '{{/each}}' +
                                    '</div>' +
                                '{{#if visibleButtons}}' +
                                '<a class="btn-project btn-proj-r carousel-control" data-gallery="#carousel" role="button" data-slide="next"> </a>' +
                                '<a class="btn-project btn-proj-l carousel-control" data-gallery="#carousel" role="button" data-slide="prev"> </a>' +
                                '{{/if}}' +
                                '</div>' +
                            '<div class="btn-proj-info">' +
                            '{{#if visibleInfo}}' +
                                '<div class="info-proj">' +
                                    '<p> Donec ut lorem justo. Cras in. </p>' +
                                    '<p> Donec ut lorem justo. Cras in. </p>' +
                                    '<div class="info-triangle"> </div>' +
                                '</div>' +
                            '{{/if}}' +
                             '</div>' +
                        '</div>',

            events: {
                '.btn-proj-r click': function (){
                    var index = this.scope.attr('index');

                    if (index == this.scope.attr('imagesArr').length - 1) {
                        this.scope.attr('index', 0);
                    } else {
                        this.scope.attr('index', index + 1);
                    }

                        this.scope.setImg();
                },

                '.btn-proj-l click': function (){
                    var index = this.scope.attr('index');

                    if (index == 0) {
                        this.scope.attr('index', this.scope.attr('imagesArr').length - 1);
                    } else {
                        this.scope.attr('index', index - 1);
                    }

                    this.scope.setImg();
                },

                '.btn-proj-info click': function(){

                    if(this.scope.attr('visibleInfo')) {
                        this.scope.attr('visibleInfo', false);
                    } else {
                        this.scope.attr('visibleInfo', true);
                    }

                },

                inserted: function () {

//                    console.log(self.scope.attr('images').attr());

                }
            },

            helpers: {
                setClass: function (index, options) {
                    var index = index(),
                        active;

                    if (index == 0) {
                        active = 'active';
                    } else {
                        active = '';
                    }

                    return active;
                }
            }
        });

    }
);