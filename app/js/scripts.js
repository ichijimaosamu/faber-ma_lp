(function($) {
  $(function() {

    /* SPメニュー開閉
     ***************************************/
    var touch = false;
    $('.p-iconAnimation').on('click touchstart',function(e){
      switch (e.type) {
        case 'touchstart':
            drawerToggle();
            touch = true;
            return false;
          break;
          case 'click':
            if(!touch)
               drawerToggle();
            return false;
          break;
       }
      function drawerToggle(){
        $('.p-globalMenu').toggleClass('-is-open');
        $('.p-iconAnimation span').toggleClass('-is-open');
        $('.p-overlay').toggleClass('-is-open');
        touch = false;
      }
    })
    $('.p-overlay').on('click touchstart',function(){
      $('.p-globalMenu').removeClass('-is-open');
      $('.p-iconAnimation span').removeClass('-is-open');
      $('.p-overlay').removeClass('-is-open');
    })

    /***************************************/

    /* ページTOPへ
     ***************************************/
    var showFlag = false;
    var pageTop = $('[data-js="pageTop"]');
    pageTop.click(function() {
      $('body,html').animate({
        scrollTop: 0
      }, 500);
      return false;
    });

    var percent, rightNav;
    percent = 0.2;
    rightNav = $(".p-pageTop");
    rightNav.hide();
    $(window).scroll(function() {
      if ($(this).scrollTop() > $(document).height() * percent) {
        rightNav.fadeIn();
      } else {
        rightNav.fadeOut();
      }
    });
    /***************************************/


    /* 追従ブロック
    ***************************************/

   var followingBlock, scrollHeight, scrollHeight2;
   followingBlock = $('.p-followingBlock');
   scrollHeight = $(document).height();
   if ($('.l-bodyInner').hasClass('-top')) {
    scrollHeight2 = scrollHeight * 0.8;
   } else {
    scrollHeight2 = scrollHeight * 0.5;
   }
   followingBlock.hide();

   $(window).scroll(function() {
      var scroll = $(this).scrollTop();    
      
      if(scroll >= 300 && scroll < scrollHeight2) {
        followingBlock.fadeIn();
      } else if(scroll < 300 || scroll >= scrollHeight2) {
        followingBlock.fadeOut();
      }
   });

    /***************************************/


    /* モーダル
     ***************************************/
    // 画面内の特定のボタンを押下したらモーダルを開く
    $(document).on('click', '[data-js="modal-open"]', function() {
      var modalNum = $(this).attr('data-modal');
      var modalContent = $('[data-modal-content="' + modalNum + '"]');
      modalContent.addClass('is-active');
      $('body').addClass('is-overflow-y');
      modalOpen();
    });

    // モーダル内の特定のボタンを押下したらモーダルを閉じる
    $(document).on('click', '[data-js="modal-apply"]', function() {
      modalClose();
    });

    // モーダル閉じるボタン
    $(document).on('click', '.c-modal__bg,[data-js="modal-close"]', function() {
      modalClose();
    });

    // モーダル表示
    function modalOpen() {
      $('.c-modal__bg').fadeIn(function() {
        $('.c-modal__contents').fadeIn();
      });
    }

    // モーダル非表示
    function modalClose() {
      $('.c-modal__contents').fadeOut(function() {
        $('.c-modal__bg').fadeOut();
        $('body').removeClass('is-overflow-y');
        $('.is-active[data-js="modal-contents"]').removeClass('is-active');
      });
    }
    /***************************************/

    /* モーダル
     ***************************************/
    // 画面内の特定のボタンを押下したらモーダルを開く
    $(document).on('click', '[data-js="loading-open"]', function() {
      $('body').addClass('is-overflow-y');
      $('.c-modal__bg').fadeIn(function() {
        $('.c-modal__contents--loading').fadeIn();
      });
    });
    /****************************************/

    /* タブ
     ***************************************/
    $('[data-js="change-tab"]').on('click', function() {
      var tabNum = $(this).attr('data-tab');
      var tabContent = $('[data-tab-content="' + tabNum + '"]');

      // タブナビを活性化
      $('[data-js="change-tab"]').removeClass('is-active');
      $(this).addClass('is-active');

      // タブの高さを指定
      tabContent.css('height', tabContent.height() + 'px');

      // タブの切替
      $('.c-tab__content').removeClass('is-active');
      tabContent.addClass('is-active');
    });

    initTabContentHeight();

    function initTabContentHeight() {
      var tabNum = $('[data-js="change-tab"].is-active').attr('data-tab');
      var tabContent = $('[data-tab-content="' + tabNum + '"]');

      // タブナビを活性化
      $(this).addClass('is-active');

      // タブの高さを指定
      tabContent.css('height', tabContent.height() + 'px');

      // タブの切替
      $('.c-tab__content').removeClass('is-active');
      tabContent.addClass('is-active');
    }
    /****************************************/

    /* アコーディオン
     ***************************************/
    $('[data-js="accordion-toggle"]').on('click', function() {
      if ($(this).closest('[data-js="accordion-box"]').hasClass('is-active')) {
        $(this).closest('[data-js="accordion-box"]').removeClass('is-active');
      } else {
        $(this).closest('[data-js="accordion-box"]').addClass('is-active');
      }
    });
    

    var $winWidth = $(window).width();
    if($winWidth < 1341) {
      $('.p-footer__lower__heading').on('click', function() {
        $(this).parent().find('.-accordion').slideToggle(200);
        $(this).toggleClass("-is-open");
      });
    }
    /****************************************/

    $('[data-js="toggle-globalNav"]').on('click', function() {
      var gnav = $(this).closest('.c-globalNav');
      if (gnav.hasClass('is-active')) {
        gnav.removeClass('is-active');
      } else {
        gnav.addClass('is-active');
      }
      $(this).closest('.c-globalNav__body').toggle();
    });

    /* スムーススクロール
     ***************************************/
    var offsetY = 0;
    var time = 500;

    $('a[href*="#"]').on('click', function() {
      if ($(this)[0].hash) {
        anchorScroll($(this)[0].hash);
      }
    });
    if (location.hash) {
      anchorScroll(location.hash);
    }

    function anchorScroll(scrollTarget) {
      scrollTarget = $(scrollTarget);
      if (!scrollTarget.length) return;
      var scrollTargetY = scrollTarget.offset().top + offsetY;
      $('html,body').animate({
        scrollTop: scrollTargetY
      }, time, 'swing');
      return false;
    }
    /****************************************/

    /* パララックス
     ***************************************/
    var parallaxBkImg = function(){
      $(window).on('load resize', function() {
        $(window).on('load scroll', function(){
          var $winTop = $(window).scrollTop();
          var $target = $('.p-parallaxBlock');
          var $winWidth = $(window).width();
          if($winWidth < 1341) {
            $target.each(function(index){
              var $position = $winTop - $target.eq(index).offset().top;
              if($winTop > $target.eq(index).offset().top - 800) {
                $target.eq(index).css({
                  'background-position-y': $position * .4
                });
              }
            });
          }
        });
      });
    }();
    /****************************************/

    /* スライダー（slickslider）
     ***************************************/
    if($('.l-container').hasClass('-recruit')) {
      $('.p-gallery__list').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        prevArrow: '<img src="/files/user/images/slickslider/slick_arrow_prev.png" class="slick-prev slick-arrow">',
        nextArrow: '<img src="/files/user/images/slickslider/slick_arrow_next.png" class="slick-next slick-arrow">',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
            }
          }
        ]
      });
    }
    /***************************************/
    
    /* Q&A
     ***************************************/
    if($('.l-container').hasClass('-recruit')) {
      $(function(){
        var flg = "default";
        $('.p-qa__box .more').click(function(){
          if(flg == "default"){
            $(this).text("閉じる");
            flg = "changed";
            $(this).prev('.p-qa__box__list').css({
              'height': 'auto',
              'overflow': 'inherit'
            });
            $(this).addClass("is-open");
          }else{
            $(this).text("もっと見る");
            flg = "default";
            $(this).prev('.p-qa__box__list').css({
              'height': '117px',
              'overflow': 'hidden'
            });
            $(this).removeClass("is-open");
          }
        });
      });
    }
    /***************************************/

  });
})(jQuery);
