// --------------------------------------------------------------------------------
// hash location + smooth scrolling
// 모든 anchor에 이벤트 바인딩하자. internal link로 판명될 경우 smooth scrolling 처리
// 최초 로딩,URL에서 hash가 변경될 경우 smooth scrolling 하지 않기로
// --------------------------------------------------------------------------------
(function ($) {
    var _isSetClassName = true;

    function smoothScrollTo(hash, e) {
        if (hash === '') { return false; } 

        if ($(hash).length > 0 && (!($(hash)[0].id === 'policy') && !($(hash)[0].id === 'provision'))) {

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
        $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').not('[href="#provision"]').not('[href="#policy"]').click(function(e) {
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
        setTimeout(function (){
            $('#barrior').addClass('remove').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){

                // modal block 삭제
                $('body').removeClass('loading').addClass('animate').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                    $('body').removeAttr('class');
                });
                document.getElementById('barrior').outerHTML = '';

                // body의 class 삭제
            });
        },500)
    });
})(jQuery);



// 스크롤 시작되면 header에 이벤트 부착
(function ($) {
    function setHeaderStyleReflection () {
        var isScrolled = parseInt($(window).scrollTop());
        var isOpenPopup = (localStorage.getItem('isOpenPopup') === 'opened');
        isScrolled > 0 ? document.querySelector('header').classList.add('reflection') : document.querySelector('header').classList.remove('reflection')
        if (isOpenPopup) {
            document.querySelector('header').classList.add('reflection')
        }

    }

    window.addEventListener('DOMContentLoaded',function (){
        setHeaderStyleReflection();
    })
    window.addEventListener('scroll',function (){
        setHeaderStyleReflection();
    });
})(jQuery);



// 팝업
function popupHandling () {
    if (location.hash === '#provision') {
        document.querySelector('#provision').classList.add('viewing');
        bodyScrollLock.disableBodyScroll(document.querySelector('#provision article'));
    } else if (location.hash === '#policy') {
        document.querySelector('#policy').classList.add('viewing');
        bodyScrollLock.disableBodyScroll(document.querySelector('#policy article'));
    } else {
        bodyScrollLock.clearAllBodyScrollLocks();
        document.querySelector('#policy').classList.remove('viewing');
        document.querySelector('#provision').classList.remove('viewing');
    }
}

// hash가 change되거나 페이지 로딩시 popup의 hash가 걸려있을때
window.addEventListener('hashchange',function (e){
    popupHandling();
});



window.addEventListener('DOMContentLoaded',function (e) {
    popupHandling();
});



document.querySelector('#provision .close.popup.button').addEventListener('click',function (){
    var windowPosition = window.scrollY;
    event.preventDefault();

    if (location.hash === '#provision') {
        bodyScrollLock.clearAllBodyScrollLocks();
        document.querySelector('#provision').classList.remove('viewing');
        document.querySelector('#provision article').scroll(0,0)
        location.hash="";

        var noHashURL = window.location.href.replace(/#.*$/, '');
        window.history.replaceState('', document.title, noHashURL)
        window.scrollTo(0,windowPosition);
    }
});

document.querySelector('#policy .close.popup.button').addEventListener('click',function (){
    var windowPosition = window.scrollY;
    event.preventDefault();

    if (location.hash === '#policy') {
        bodyScrollLock.clearAllBodyScrollLocks();
        document.querySelector('#policy').classList.remove('viewing');
        document.querySelector('#policy article').scroll(0,0)
        location.hash="";


        var noHashURL = window.location.href.replace(/#.*$/, '');
        window.history.replaceState('', document.title, noHashURL)
        window.scrollTo(0,windowPosition);
    }
});




// rolling interaction
(function ($){
    // 롤링할 대상을 받아온다.
    var item = document.querySelector('#touchSlider').dataset.max;
    var order = {
        before : 0,
        now : 0
    };

    // order에 따라서 attribute를 바인딩을 해줘야지?
    function setDataInteraction (direction,direct) {
        if (!direct) {
            if (direction === 'next') {
                order.before = parseInt(order.now);
                order.now++;
                if (order.now > item) {
                    order.now = 0;
                }
            } else if (direction === 'prev') {
                order.before = parseInt(order.now);
                order.now--;
                if (order.now < 0) {
                    order.now = item;
                }
            } else {
                return;
            }
        }

        var controller = document.querySelector('#touchSlider');

        // 배경이미지
        // ------------------------------------------------------------
        $('#touchSlider div.prev').removeClass('prev');
        $('#touchSlider div.next').removeClass('next');

        $('#touchSlider .background.image div:eq('+order.before+')').removeClass('viewing');
        $('#touchSlider .background.image div:eq('+order.before+')').addClass('hiding');
        $('#touchSlider .background.image div:eq('+order.now+')').on('animationend',function (){
            $('#touchSlider .background.image div:eq('+order.before+')').removeAttr('class');
        });

        if (direction === 'prev') {
            $('#touchSlider .background.image > div:eq('+order.now+')').addClass('prev').addClass('viewing');
        } else if (direction === 'next') {
            $('#touchSlider .background.image > div:eq('+order.now+')').addClass('next').addClass('viewing');
        }


        // 타이틀 텍스트
        // ------------------------------------------------------------
        $('#touchSlider div.title.wrapper > div:eq('+order.before+')').removeClass('viewing');
        setTimeout(function (){
            $('#touchSlider div.title.wrapper > div:eq('+order.now+')').addClass('viewing');
        },200);


        // phone mockup
        // ------------------------------------------------------------
        $('#touchSlider div.phone.image.wrapper > img:eq('+order.now+')').addClass('viewing');
        $('#touchSlider div.phone.image.wrapper > img:eq('+order.before+')').addClass('hiding');
        $('#touchSlider div.phone.image.wrapper > img:eq('+order.now+')').on('transitionend',function () {
            $('#touchSlider div.phone.image.wrapper > img:eq('+order.before+')').removeAttr('class');
        })

        // navigate button binding
        // ------------------------------------------------------------
        $('button.ts-paging-btn:eq('+order.before+')').removeClass('ts-paging-active');
        $('button.ts-paging-btn:eq('+order.now+')').addClass('ts-paging-active');
    }

    // initialize
    // 페이지네이션 바인딩
    (function (itemCount){
        var dom = '';
        for (var i=0; i<=itemCount; i++) {
            if (i === 0) {
                dom += '<button type="button" class="ts-paging-btn ts-paging-active" data-index="'+parseInt(i)+'">page'+parseInt(i+1)+'</button>'
            } else {
                dom += '<button type="button" class="ts-paging-btn" data-index="'+parseInt(i)+'">page'+parseInt(i+1)+'</button>'
            }
        }
        // binding
        document.querySelector('.ts-paging').innerHTML = dom;
    })(item);

    // 버튼에 이벤트 바인딩
    $('button.ts-paging-btn').on('click',function (){
        order.before = parseInt(order.now);
        order.now = $(this).data().index;

        $(this).attr('disabled','disabled');

        var interval = (function (){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                return 700
            } else {
                return 1300
            }
        })();

        // arrow function이 안될수도 있으므로.
        (function ($this) {
            setTimeout(function () {
                $this.removeAttr('disabled');
            },interval);
        })($(this))

        if (order.before > order.now) {
            setDataInteraction('prev','direct');
        } else if (order.before < order.now) {
            setDataInteraction('next','direct');
        } else {
            return;
        }
    });

    // 왼쪽 오른쪽 화살표는 항상 노출되어 있다. html안에 static하게 생성하는 것으로 처리
    // 화살표의 dom을 받아온다.
    var arrow = {
        left : document.querySelector('.ts-prev'),
        right : document.querySelector('.ts-next')
    };

    arrow.left.addEventListener('click',function (e){
        setDataInteraction('prev');
        arrow.left.setAttribute('disabled','disabled')
        arrow.right.setAttribute('disabled','disabled')
        setTimeout(function (){
            arrow.left.removeAttribute('disabled')
            arrow.right.setAttribute('disabled')
        },1300)
    });

    arrow.right.addEventListener('click',function (e){
        setDataInteraction('next');
        arrow.left.setAttribute('disabled','disabled')
        arrow.right.setAttribute('disabled','disabled')
        setTimeout(function (){
            arrow.left.removeAttribute('disabled');
            arrow.right.removeAttribute('disabled');
        },1300)
    });

    // 데스크탑에서 7초마다 롤링시킨다.
    if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        var rolling;

        rolling = setInterval(function () {
            setDataInteraction('next')
        },7000)

        // 마우스가 올라가면 중지시킨다.
        $('#summary').on('mouseenter',function () {
            clearInterval(rolling);
        });

        $('#summary').on('mouseleave',function () {
            rolling = setInterval(function () {
                setDataInteraction('next')
            },7000)
        });
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        var bStartEvent = false; //touchstart 이벤트 발생 여부 플래그
        var nMoveType = {
            axis : -1, //현재 판단된 사용자 움직임의 방향
            direction : ''
        };
        var htTouchInfo = { //touchstart 시점의 좌표와 시간을 저장하기
            nStartX : -1,
            nStartY : -1,
            nStartTime : 0
        };
        //수평 방향을 판단하는 기준 기울기
        var nHSlope = ((window.innerHeight) / (window.innerWidth/2)).toFixed(2) * 1;

        function initTouchInfo() { //터치 정보들의 값을 초기화하는 함수
            htTouchInfo.nStartX = -1;
            htTouchInfo.nStartY = -1;
            htTouchInfo.nStartTime = 0;
        }

        //touchstart 좌표값과 비교하여 현재 사용자의 움직임을 판단하는 함수
        function getMoveType(x, y) {
            //0은 수평방향, 1은 수직방향
            var nMoveType = -1;

            var nX = Math.abs(htTouchInfo.nStartX - x);
            var nY = Math.abs(htTouchInfo.nStartY - y);

            var direction = (function (before,after){
                return htTouchInfo.nStartX - x > 0 ? 'next' : 'prev'
            })(htTouchInfo.nStartX,x)

            var nDis = nX + nY;
            //현재 움직인 거리가 기준 거리보다 작을 땐 방향을 판단하지 않는다.


            if(nDis < 10) {
                return {
                    axis : nMoveType
                }
            }

            var nSlope = parseFloat((nY / nX).toFixed(2), 10);

            if(nSlope > nHSlope) {
                nMoveType = 1;
            } else {
                nMoveType = 0;
            }

            return {
                axis : nMoveType,
                direction : direction,
                distance : nDis
            }
        }

        function onStart(e) {
            e.stopPropagation();
            initTouchInfo(); //터치 정보를 초기화한다.
            nMoveType = -1; //이전 터치에 대해 분석한 움직임의 방향도 초기화한다.
            //touchstart 이벤트 시점에 정보를 갱신한다.
            htTouchInfo.nStartX = e.changedTouches[0].pageX;
            htTouchInfo.nStartY = e.changedTouches[0].pageY;
            htTouchInfo.nStartTime = e.timeStamp;
            bStartEvent = true;
        }

        function onMove(e) {
            e.stopPropagation();
            if(!bStartEvent) {
                return
            }
            var nX = e.changedTouches[0].pageX;
            var nY = e.changedTouches[0].pageY;

            //현재 touchmMove에서 사용자 터치에 대한 움직임을 판단한다.
            nMoveType = getMoveType(nX, nY);

            //현재 사용자 움직임을 수직으로 판단해 기본 브라우저의 스크롤 기능을 막고 싶으면 아래 코드를 사용한다.
            if(nMoveType.axis === 0) {
                e.preventDefault();
            }
        }

        function onEnd(e) {
            if (animating === true) {
                return;
            }
            e.stopPropagation();
            if(!bStartEvent) {
                return
            }

            if (nMoveType.axis  === 0 && nMoveType.distance > 100) {
                setDataInteraction(nMoveType.direction);
            }
            bStartEvent = false;
            animating = true;
            setTimeout(function(){
                animating = false;
            },600)

            nMoveType.axis = -1; //분석한 움직임의 방향도 초기화한다.
            initTouchInfo(); //터치 정보를 초기화한다.
        }

        function preventDefault(e) {
            e.preventDefault();
        }

        var animating = false;
        document.querySelector('#summary').addEventListener('touchstart', onStart,false);
        document.querySelector('#summary').addEventListener('touchmove', onMove, false);
        document.querySelector('#summary').addEventListener('touchend', onEnd,false);
        document.querySelector('#summary').addEventListener('dragstart', preventDefault, false);
    }
})(jQuery)

// scroll animation
AOS.init();
AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tabvar', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 1, // the delay on throttle used while scrolling the page (advanced)


    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 80, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: 'ease-out-cubic', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: true, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});
