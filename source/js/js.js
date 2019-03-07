// --------------------------------------------------------------------------------
// hash location + smooth scrolling
// 모든 anchor에 이벤트 바인딩하자. internal link로 판명될 경우 smooth scrolling 처리
// 최초 로딩,URL에서 hash가 변경될 경우 smooth scrolling 하지 않기로
// --------------------------------------------------------------------------------
(function ($) {
    var _isSetClassName = true;
    var indicatorNum = 0;
    var _isWheelState = true;

    function smoothScrollTo(hash, e) {
        if (hash === '') { return false; } 

        if ($(hash).length > 0) {

            if(typeof e !== 'undefined') {
                if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                }

                e.preventDefault();
                var insertQuery;

                if (e.type === 'click') {

                    insertQuery = $(e.target).attr('href');
                    history.pushState(null, null, insertQuery);
                }
            }

            _isSetClassName = false;

            $(hash).siblings().children('div').removeClass('active');
            $(hash + '> div').addClass('active');

            TweenLite.to('html,body', .9, {
                scrollTop:$(hash).offset().top, 
                ease:Expo.easeOut,
                overwrite:1,
                onComplete: function(){
                    _isSetClassName = true;
                }
            });
            // !!!! element의 길이에 따라서 스크롤 이동하는 타이밍 받도록 변경해야 됨
        }

    }

    // indicator / gnb / foot gnb / Be our partner button
    $(function() {
        $('#quickMenu .indicator a[href*="#"], #gnb a[href*="#"], .foot-gnb nav a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(e) {
            var idx = $(this).index();
            var indi = $(this).parent().hasClass('.indicator');

            if(indi){
                $('#quickMenu .indicator a[href*="#"]').removeClass('active');
                $(this).addClass('active');
            }else {
                $('#header').removeClass('active');
            }
            smoothScrollTo(this.hash, e);
        });

        $('a.button[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(e) {

            smoothScrollTo(this.hash, e);
        });
        

        smoothScrollTo(location.hash);

        $(window).on('hashchange',function (e){
            smoothScrollTo(location.hash, e);
        });

    });


    // arrow button click
    $(function(){
        var arrow = $('#quickMenu .arrow a');
        var indicator = $('#quickMenu .indicator a');
        var leng = indicator.length;

        $(arrow).on('click', function(){
            var $this = $(this);
            var idx = $this.index();

            if(!_isSetClassName) return false;

            (idx == 0) ? ( (indicatorNum <= 0) ? indicatorNum = 0 : indicatorNum-- ) : ( (indicatorNum >= leng) ? indicatorNum = leng : indicatorNum++ ) ;

            indicator.eq(indicatorNum).trigger('click');

            return false;
        });

        // mouse wheel event
        // $("#contents").on('mousewheel DOMMouseScroll', function(e) {

        //     var E = e.originalEvent;
        //     var delta = 0;
        //     (E.detail) ? delta = E.detail / 120 : delta = E.wheelDelta / 120 ;

        //     if(!_isWheelState) return false;

        //     if(indicatorNum < leng){
        //         _isWheelState = false;
        //         setTimeout(function(){
        //             _isWheelState = true;
        //         }, 1200);
        //     }

        //     if(delta < 0) {
        //         (indicatorNum >= leng) ? indicatorNum = leng : indicatorNum++ ;
        //     }else {
        //         (indicatorNum <= 0) ? indicatorNum = 0 : indicatorNum-- ;
        //     }
        //     indicator.eq(indicatorNum).trigger('click');
            
        //     return false;

        // });
    });

    $(function (){
        
        // 스크롤 위치에 따라서 link에 클래스 바인딩을 한다.
        var sectionHeight = (function (sectionGroup) {
            var sectionGroup
            ,   max = sectionGroup.length
            ;

            var result = [];

            $.each(sectionGroup, function(i, section) {
                if (!!$(section).attr('id')) {
                    result.push({
                        id : $(section).attr('id'),
                        position : {
                            from : $(section).offset().top,
                            to : $(section).offset().top + $(section).outerHeight()
                        },
                        hash : (function (id){
                            return id === '' ? null : '#'+id
                        })($(section).attr('id'))
                    })
                }
            });
            return result;

        })($('#contents > section'));
        
        $(document).on('scroll', function(e) {
            var scrollTop = $(document).scrollTop()
            ,   element
            ,   windH = $(window).height();
            ;

            // gnb active
            for (var i=0; i < sectionHeight.length; i++) {
                if (sectionHeight[i].position.from <= scrollTop && sectionHeight[i].position.to > scrollTop) {
                    element = sectionHeight[i].id;
                    if (_isSetClassName) {
                        indicatorNum = i;
                        $('#quickMenu .indicator a[href="#' + element + '"]').siblings().removeClass('active');
                        $('#quickMenu .indicator a[href="#' + element + '"]').addClass('active');
                    }
                }
                if (sectionHeight[i].position.from <= scrollTop + windH/2 && sectionHeight[i].position.to > scrollTop + windH/2) {
                    element = sectionHeight[i].id;
                    if (_isSetClassName) {
                        $(`#contents #${element}`).siblings().find(' > div').removeClass('active');
                        $(`#contents #${element} > div`).addClass('active');
                    }
                }
            }

        });

    });
})(jQuery);


// --------------------------------------------------------------------------------
// header menu
// click Event
// --------------------------------------------------------------------------------

(function ($) {

    $(function(){
        const header = $('#header');
        const menu = header.find('.menu');

        menu.on('click', function(){
            const $this = $(this);

            header.toggleClass('active');
            return false;
            
        });
    });

})(jQuery);


// --------------------------------------------------------------------------------
// specialist
// hover Event
// --------------------------------------------------------------------------------

(function ($) {

    $(function(){
        const list = $('#specialist li');

        list.on('mouseenter', function(){
            const $this = $(this);
            const $sibl = $this.siblings('li');

            $this.addClass('active');
            $sibl.removeClass('active');
            
        });
    });

})(jQuery);



// --------------------------------------------------------------------------------
// service
// hover Event
// --------------------------------------------------------------------------------

(function ($) {

    $(function(){
        const list = $('#service .text-box li');
        const img = $('#service .image-box > div');

        list.on('mouseenter', function(){
            const $this = $(this);
            const idx = $this.index();
            const $sibl = $this.siblings('li');

            img.eq(idx).addClass('active');
            img.eq(idx).siblings().removeClass('active');

            $this.addClass('active');
            $sibl.removeClass('active');
            
        });
    });

})(jQuery);


// --------------------------------------------------------------------------------
// portfolio
// swiper Event
// --------------------------------------------------------------------------------

(function ($) {

    $(function(){
        const portfolio = $('#portfolio');
        const list = portfolio.find('.portfolio-list li');
        const listW = list.width();
        const listLeng = list.length;
        const totalW = listW*listLeng;
        const line = portfolio.find('.line span');
        
        const win = $(window);
        const winW = win.width();
        let swipeActiveNum = '';

        win.on('load', function(){
            (winW >= 1180) ? swipeActiveNum = 2 : swipeActiveNum = 1 ;
        
            line.width((listW/totalW)*swipeActiveNum*100+'%');
        });

        var mySwiperPortfolio = new Swiper ('#portfolio .swiper-container', {
            // Optional parameters
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 33,
        
            // Navigation arrows
            navigation: {
                nextEl: '#portfolio .swiper-next',
                prevEl: '#portfolio .swiper-prev',
            },
            breakpoints: {
                // when window width is <= 1080px
                1080: {
                  slidesPerView: 1,
                  spaceBetween: 16
                }
            }
        })

        // slide 시 라인 이동
        mySwiperPortfolio.on('slideChange', function () {
            TweenLite.to(line, .3, {
                left:parseInt(line.width()/swipeActiveNum*mySwiperPortfolio.activeIndex), 
                ease:Back.easeOut,
                overwrite:1
            });
        });

    });

})(jQuery);


// --------------------------------------------------------------------------------
// team
// swiper Event
// --------------------------------------------------------------------------------

(function ($) {

    $(function(){
        const team = $('#team');
        const list = team.find('.team-people li');
        const listW = list.width();
        const listLeng = list.length;
        const totalW = listW*listLeng;
        const line = team.find('.line span');

        line.width((listW/totalW)*100+'%');

        var mySwiper = new Swiper ('#team .swiper-container', {
            // Optional parameters
            // mousewheel: true,
            slidesPerView: 1,
            spaceBetween: 16,
            // loop: true,
        
            // Navigation arrows
            navigation: {
                nextEl: '#team .swiper-next',
                prevEl: '#team .swiper-prev',
            },
            formatFractionCurrent: function(index){
                TweenLite.to(line, .3, {
                    left:parseInt(line.width()*index), 
                    ease:Expo.easeOut,
                    overwrite:1
                });
            }
        })

        // slide 시 라인 이동
        mySwiper.on('slideChange', function () {
            TweenLite.to(line, .3, {
                left:parseInt(line.width()*mySwiper.activeIndex), 
                ease:Back.easeOut,
                overwrite:1
            });
        });

        // li click
        list.on('click', function(){
            const idx = $(this).index();
            mySwiper.slideTo(idx);
        });

    });

})(jQuery);


// --------------------------------------------------------------------------------
// contactus
// form post
// --------------------------------------------------------------------------------

(function ($) {

    $(function (){

        var form = $('#form');
        var name = form.find('#name');
        var email = form.find('#email');
        var message = form.find('#message');
        var url = 'https://script.google.com/macros/s/AKfycbxMiyHCfC7pnCgj32LLLOF45WpNKGdCVbW4W2gQhUS08RaNy94/exec';
        var layerSuccess = $('.layer-success');

        // submit 성공
        form.on('submit', function(e){
            e.preventDefault();
            if(formValidation()) {
                send();
            }
        });

        var send = function() {
            // data
            var data = {
                'name': name.val(), 
                'email': email.val(),
                'message': message.val()
            }

            // ajax post
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data) {
                    console.log('success');
                    document.getElementById('form').reset();
                    $('.loading').hide();
                    TweenLite.to(layerSuccess, .5, {
                        left:0,
                        opacity:1,
                        zIndex:20,
                        ease:Expo.easeOut,
                        onComplete:function(){
                            TweenLite.to(layerSuccess, .5, {
                                delay:2,
                                left:'100%',
                                ease:Expo.easeOut,
                                onComplete:function(){
                                    TweenLite.to(layerSuccess, 0, {
                                        left:'-100%',
                                        opacity:0,
                                    });
                                }
                            });
                        }
                    });
                },
                error: function(data) {
                    console.log('fail');
                }
            });
        }

        // email 체크
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // form validation
        function formValidation(){
            if(name.val() == '') {
                alert('Required Name field');
                name.focus();
                return false;
            }else if(!validateEmail(email.val()) || email.val() == '') {
                alert('Required Email field');
                email.focus();                
                return false;
            }else if(message.val() == '') {
                alert('Required Message field');
                message.focus();                
                return false;
            }else {
                $('.loading').show();
                return true;
            }
        }

    });
})(jQuery);