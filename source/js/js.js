// --------------------------------------------------------------------------------
// hash location + smooth scrolling
// 모든 anchor에 이벤트 바인딩하자. internal link로 판명될 경우 smooth scrolling 처리
// 최초 로딩,URL에서 hash가 변경될 경우 smooth scrolling 하지 않기로
// --------------------------------------------------------------------------------
(function ($) {
    var _isSetClassName = true;

    function smoothScrollTo(hash, e) {
        if (hash === '') { return false; } 

        if ($(hash).length > 0 && !$(hash+'#provision') && !$(hash+'#policy')) {

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

            $('html,body').animate({
                scrollTop: $(hash).offset().top - $('#header').outerHeight()
            }, 350, function() {
                _isSetClassName = true;
            });
        }
    }

    $(function() {
        $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').not('[href="#provision"]').not('[href="policy"]').click(function(e) {
            $('#header a[href*="#"]').removeClass('viewing');
            $(this).addClass('viewing');
            smoothScrollTo(this.hash, e);
        });

        smoothScrollTo(location.hash);

        $(window).on('hashchange',function (e){
            smoothScrollTo(location.hash, e);
        });
    });


    $(function (){
        var sectionHeight = (function (sectionGroup) {
            var sectionGroup
            ,   max = sectionGroup.length
            ;

            var result = [];

            // 미리 선처리를 해서 각 섹션의 길이를 가져오는 방법을 취해야겠구나.
            $.each(sectionGroup, function(i, section) {
                if (!!$(section).attr('id')) {
                    result.push({
                        id : $(section).attr('id'),
                        position : {
                            from : $(section).offset().top - $('#header').outerHeight(),
                            to : (function (next) {
                                return $(next).length > 0 ? parseInt($(next).offset().top - $('#header').outerHeight()) : parseInt($(document).height())
                            })($(section).closest('section').nextAll('section[id]:first'))
                        },
                        hash : (function (id){
                            return id === 'summary' ? null : '#'+id
                        })($(section).attr('id'))
                    })
                }
            });
            return result;

        })($('article > section'));

        $(document).on('scroll', function(e) {
            var scrollTop = $(document).scrollTop()
            ,   element
            ;

            for (var i=0; i < sectionHeight.length; i++) {
                if (sectionHeight[i].position.from <= scrollTop && sectionHeight[i].position.to > scrollTop) {
                    element = sectionHeight[i].id;
                    if (_isSetClassName) {
                        $('#header a[href*="#"]').removeClass('viewing');
                        $('#header a[href="#' + element + '"]').addClass('viewing');
                    }
                }
            }
        });
    });
})(jQuery);


// 모든 리소스가 로딩 된 후 화면 보여줌
(function ($) {
    $('body').addClass('loading');
    $(window).on('load',function () {
        $('#barrior').addClass('remove').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){

            // modal block 삭제
            $('body').removeClass('loading').addClass('animate');
            document.getElementById('barrior').outerHTML = '';

            // body의 class 삭제
        });
    });
})(jQuery);






// 스크롤 시작되면 header에 이벤트 부착
(function ($) {
    window.addEventListener('scroll',function (){
        
        let isScrolled = parseInt($(window).scrollTop())

        !!isScrolled ? document.querySelector('header').classList.add('reflection') : document.querySelector('header').classList.remove('reflection')

    });
})(jQuery)



// 터치슬라이더 작동
$("#touchSlider").touchSlider({
	// Options
	page: 1,
    speed: 500
});



// 팝업
window.addEventListener('hashchange',function (e){
    if (location.hash === '#provision') {
        document.querySelector('#provision').classList.add('viewing');
        bodyScrollLock.disableBodyScroll(document.querySelector('#provision article'));
    } else if (location.hash === '#policy') {
        document.querySelector('#policy').classList.add('viewing');
        bodyScrollLock.disableBodyScroll(document.querySelector('#policy article'));
    } else {
        document.querySelector('#policy').classList.remove('viewing');
        document.querySelector('#provision').classList.remove('viewing');
        bodyScrollLock.clearAllBodyScrollLocks();
    }
});

window.addEventListener('DOMContentLoaded',function (e) {
    if (location.hash === ('#provision' || '#policy')) {
        if (document.body.style.overflow === "hidden") {
            document.body.removeAtrribute('style');
        }
    }

    if (location.hash === '#provision') {
        document.body.style.overflow="hidden";
        document.querySelector('#provision').classList.add('viewing');
    } else {
        document.querySelector('#provision').classList.remove('viewing');
    }
    if (location.hash === '#policy') {
        document.body.style.overflow="hidden";
        document.querySelector('#policy').classList.add('viewing');
    } else {
        document.querySelector('#policy').classList.remove('viewing');
    }
});

document.querySelector('#provision .close.popup.button').addEventListener('click',function (){
    var windowPosition = window.scrollY;
    event.preventDefault();

    if (location.hash === '#provision') {
        let target = document.querySelector('#provision')
        document.querySelector('#provision').classList.remove('viewing');
        // target.addEventListener('transitionend',function viewing (){
            document.querySelector('#provision article').scroll(0,0)
            location.hash="";

            var noHashURL = window.location.href.replace(/#.*$/, '');
            window.history.replaceState('', document.title, noHashURL)
            window.scrollTo(0,windowPosition);

            // target.removeEventListener('transitionend',viewing);
        // })
    }

});

document.querySelector('#policy .close.popup.button').addEventListener('click',function (){
    var windowPosition = window.scrollY;
    event.preventDefault();

    if (location.hash === '#policy') {
        let target = document.querySelector('#policy')
        document.querySelector('#policy').classList.remove('viewing');
        // target.addEventListener('transitionend',function viewing (){
            document.querySelector('#policy article').scroll(0,0)
            location.hash="";

            var noHashURL = window.location.href.replace(/#.*$/, '');
            window.history.replaceState('', document.title, noHashURL)
            window.scrollTo(0,windowPosition);

            // target.removeEventListener('transitionend',viewing);
        // })
    }
});
