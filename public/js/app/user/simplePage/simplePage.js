'use strict';

define([
	'canjs',
	'core/appState',
	'core/helpers/preloader',
    'velocity',
	'css!app/simplePage/css/simplePage.css'
],
	function (can, appState, preloader, velocity) {

		return can.Control.extend({
			defaults: {
				viewpath: 'app/simplePage/',
				alternateViewpath: 'app/simplePage/alternateViews/'
			}
		}, {
			init: function () {
				var self = this;
                self.$body_html= $('html, body');
                self.scrollPage = 0;
                self.scrollBox = [];

                //this.routeChanged(can.route.attr());

                this.map_options = {
                    zoom: 17,
                    scrollwheel: false
                };

				var simplePage = self.getSimplePage();

				var viewfile =
					simplePage.alternate_view_path.length > 0 ?
					self.options.alternateViewpath + simplePage.alternate_view_path + '.stache' :
					self.options.viewpath + 'index.stache';

                can.view(viewfile, {
                    simplePage: simplePage,
                    appState: appState
                }, function(html) {

                    self.element.html(html);

                    if (self.options.isReady) {
                        self.options.isReady.resolve();
                    }

                    self.calculateBlockSizes();
                    self.calculateScrollArray();
                    self.initializeMap();
                    self.scrollTo();
                });
			},

			getSimplePage: function () {
  				var id = this.options.data.id;
				return _.find(appState.attr('simplePages'), function(element) {
					return element.url == id;
				});
			},

            scrollTo: function () {
                var elScrollTo = appState.attr('scrollTo');

                if (elScrollTo) {
                    $('html, body').animate({scrollTop: $(elScrollTo).offset().top}, 500);
                    appState.attr('scrollTo', 0);
                }
            },

            initializeMap: function() {
                var self = this,
                    map = $("#googleMap");

                self.map_options.center = new google.maps.LatLng(50.438833, 30.478147);
                self.googlemap = new google.maps.Map(map[0], self.map_options);

                new google.maps.Marker({
                    position: self.map_options.center,
                    map: self.googlemap
                });
            },

            '{window} resize': function () {
                var self = this;

                self.calculateBlockSizes();
                self.calculateScrollArray();
                self.googlemap.setCenter(self.map_options.center);
            },

            '{window} scroll': function (el, ev) {
                var self = this;

                var $window = $(window),
                    max_scroll = 200,// промежуток за который все должно быть
                    start = 90, // размер блока
                    max = 65, // размер блока стремится к размеру
                    ratio,
                    scroll_top,
                    result_header,
                    i;

                scroll_top = $window.scrollTop(); // реальное положение скролла
                scroll_top = scroll_top <= max_scroll ? scroll_top : max_scroll; // определяем позицию
                ratio = scroll_top / max_scroll; // подсчет коэффициента

                result_header = start + (max - start) * ratio;
                //result_header_top = 2 + (1 - 2) * ratio; // подсчет padding-top (2 - начальное, 1 - нужный)

                $('#header').css({'height': result_header});

                scroll_top = $window.scrollTop();

                for(i = this.scrollBox.length; i--;) { // считаем индексы положения блоков для скролла
                    if(scroll_top >= this.scrollBox[i]){
                        self.scrollPage = i;
                        break;
                    }
                }

                if(self.scrollPage == 4){
                    $('#scroll-down').attr('id', 'scroll-up');
                    $('.button-scroll').velocity({
                        rotateZ: "-180deg"
                    }, 300);

                }

                if(scroll_top == 0) {
                    $('#scroll-up').attr('id', 'scroll-down');
                    $('.button-scroll').velocity({
                        rotateZ: "0deg"
                    }, 300);
                }
            },

            '/ route': 'routeChanged',
            ':module route': 'routeChanged',
            ':module/:id route': 'routeChanged',

            routeChanged: function (data) {
                var self = this;

                if(!data.module) {
                    self.initializeMap();
                }
            },

            calculateBlockSizes: function () {
                var userHeight = $(window).outerHeight();

                if(userHeight < 768) {
                    userHeight = 768;
                }

               $('.pages').css('height', userHeight); // подгоняем background под разрешение пользователя
            },

            'calculateScrollArray': function () {
                var self = this,
                    userHeight = $(window).outerHeight();

                if(userHeight < 768) {
                    userHeight = 768;
                }

                for(var i = 0; i < 5; i++) {
                    self.scrollBox[i] = (userHeight * i);
                }
            },

            '#scroll-down click': function () {
                var self = this;

                self.$body_html.animate({'scrollTop': self.scrollBox[self.scrollPage+1]}, 300);
            },

            '#scroll-up click': function () {
                var self = this;

                if($(window).scrollTop() == self.scrollBox[self.scrollPage]) {
                    self.$body_html.animate({'scrollTop': self.scrollBox[self.scrollPage-1]},300);

                } else {
                    self.$body_html.animate({'scrollTop': self.scrollBox[self.scrollPage]}, 300);
                }
            }
		});
	}
);