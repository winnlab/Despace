// изменение размера хедера
var $header = $('#header');

$(window).scroll(function(){
    var $window = $(this),
        max_scroll = 200,// промежуток за который все должно быть
        start = 70, // размер блока
        max = 25, // размер блока стремится к размеру
        ratio,
        scroll_top,
        result_header,
        result_header_p;


    scroll_top = $window.scrollTop(); // реальное положение скролла

    scroll_top = scroll_top <= max_scroll ? scroll_top : max_scroll; // определяем позицию

    ratio = scroll_top / max_scroll; // подсчет коэффициента

    result_header = start + (max - start) * ratio;
    result_header_p = 2 + (1 - 2) * ratio; // подсчет padding-top (2 - начальное, 1 - нужный)

    $($header).css({'height': result_header, 'padding-top': result_header_p + '%'});
});

// подгонка под размер страницы
var windowHeight = $(window).height();

$(document).ready(function(){
    $('.pages').css('height', windowHeight);
});

// скролл кнопка-стрелка
$('#button-scroll').on('click', function(){
    //var scroll_to =
});