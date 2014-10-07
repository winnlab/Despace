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
            'index': 1,
            'indexSplice': 2,
            'lang': appState.attr('lang'),
            'content': [],
            'contentCurrentLang': '@',
            'visibleClass': true,
            'visibleInfo': false,
            'visibleButtons': true,

            setImg: function (direction) {
                var self = this,
                    arrIndex = self.attr('imagesArr').length -1,
                    arrPageIndex = self.attr('imagesPageArr').length -1,
                    indexSplice = self.attr('indexSplice'),
                    index = self.attr('index');

                console.log(self.attr('content'));

                switch(direction) {
                    case -1:
                        if (arrPageIndex < arrIndex) {
                            if (!self.findImg(index)) {
                                self.attr('imagesPageArr').splice(indexSplice, 0, self.attr('imagesArr')[index]);
                            }
                        }
                        break;
                    case 1:
                        if (arrPageIndex < arrIndex) {
                            if (!self.findImg(index)) {
                                  self.attr('indexSplice', indexSplice +1);
                                  self.attr('imagesPageArr').splice(index, 0, self.attr('imagesArr')[index]);
                            }
                        }
                        break;
                    default:
                        console.error('Error!');
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
            },

            setContent: function () {
                    var self = this,
                        langsArr = ['/', '/en/'],
                        locale = appState.attr('locale'),
                        content = self.attr('content'),
                        result = '';

                    if (locale == langsArr[0] ) {
                        result = content[0];
                    } else {
                        result = content[1];
                    }

                    return result;
            }

        });

        can.Component.extend({
            tag: "project",
            scope:  Gallery,

            init: function () {
                var self = this,
                    arr = self.scope.attr('images').attr();

                    self.scope.attr('imagesArr', arr);

                self.scope.attr('currentContentLang', self.scope.setContent());

                if (arr.length -1 >= 2) {
                    var firstImg = arr[0],
                        secondImg = arr[1],
                        lastImg = arr[arr.length-1];

                    self.scope.attr('imagesPageArr').push(firstImg);
                    self.scope.attr('imagesPageArr').push(secondImg);
                    self.scope.attr('imagesPageArr').push(lastImg);

                } else if (arr.length -1 == 1) {
                    self.scope.attr('imagesPageArr', arr);

                } else {
                    self.scope.attr('imagesPageArr', arr);
                    self.scope.attr('visibleButtons', false);
                }
            },

            template: '<div class="projectItem">' +
                                '<div class="bgWrapper">' +
                                '<div id="carousel{{gid}}" class="carousel slide" data-ride="carousel">' +
                                    '<div class="carousel-inner">' +
                                        '{{#each imagesPageArr}}' +
                                        '<div class="item {{setClass @index}}">' +
                                            '<div class="img-gallery" style="background-image: url({{uploadPath}}{{.}});"></div>' +
                                        '</div>' +
                                        '{{/each}}' +
                                    '</div>' +
                                '{{#if visibleButtons}}' +
                                '<a class="btn-project btn-proj-r carousel-control" data-gallery="#carousel{{gid}}" role="button" data-slide="next"> </a>' +
                                '<a class="btn-project btn-proj-l carousel-control" data-gallery="#carousel{{gid}}" role="button" data-slide="prev"> </a>' +
                                '{{/if}}' +
                                '</div>' +
                            '<div class="btn-proj-info">' +
                            '{{#if visibleInfo}}' +
                                '<div class="info-proj">' +
                                    '{{{currentContentLang.content}}}' +
                                    '<div class="info-triangle"> </div>' +
                                '</div>' +
                            '{{/if}}' +
                             '</div>' +
                        '</div>',

            events: {
                '.btn-proj-r click': function (){
                    var index = this.scope.attr('index');

                    if (index == this.scope.attr('imagesArr').length - 2) {
                        this.scope.attr('index', 1);
                    } else {
                        this.scope.attr('index', index + 1);
                    }

                        this.scope.setImg(1);
                },

                '.btn-proj-l click': function (){
                    var index = this.scope.attr('index');

                    if (index == 1) {
                        this.scope.attr('index', this.scope.attr('imagesArr').length - 2);
                    } else {
                        this.scope.attr('index', index - 1);
                    }

                    this.scope.setImg(-1);
                },

                '.btn-proj-info click': function(){

                    if(this.scope.attr('visibleInfo')) {
                        this.scope.attr('visibleInfo', false);
                    } else {
                        this.scope.attr('visibleInfo', true);
                    }

                },

                inserted: function () {

//                    console.log(this.scope.attr('images').attr());
//                    console.log(this.scope.attr('gid'));
//                    console.log(this.scope.attr('content').attr());

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