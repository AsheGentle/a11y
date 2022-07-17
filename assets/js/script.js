$(function(){
    $("a[href*='#']").on("click", function(){
        $("html, body").animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 1000);
        return false;
    });

    var modalId;
    var buttonModal;

    $("[data-modal]").on("click", function(){
        modalId = $(this).data("modal");
        buttonModal = $(this);
        $(".modal").removeClass("open");
        $(modalId).addClass("open");
        $(modalId).find("#form-name").focus();
        $("body").addClass("overflow").css("padding-right", scrollWidth);

        $(document).on('keyup', function(event){
            if (event.keyCode == 27) {
                $(modalId).removeClass("open");
                $("body").removeClass("overflow").css("padding-right", 0);
                buttonModal.focus();
            }
        });
    });

    $(".modal__close").on("click", function(){
        $(this).parents(".modal").removeClass("open");
        $("body").removeClass("overflow").css("padding-right", 0);
        buttonModal.focus();
    });

    $(".modal").on("click", function(e){
        var div = $(this).find(".modal__content");
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            $(this).removeClass("open");
            $("body").removeClass("overflow").css("padding-right", 0);
            buttonModal.focus();
        }
    });


    var scrollWidth = getScrollbarWidth();
    function getScrollbarWidth(){

        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);

        var inner = document.createElement('div');
        outer.appendChild(inner);

        var scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }


    $(".tab-list__item").on("click", function(){
        setSelectedTab($(this));
    });
    $(".tab-list__item").on("keyup", keyupTab);


    function setSelectedTab(currentTab){
        $(".tab-list__item").each(function(index){
            var dataTab = $(this).data("tab");

            if (currentTab.is($(this))) {
                $(this).attr("aria-selected", "true");
                $(this).removeAttr("tabindex");
                $(this).addClass("active");
                $(".tab-content__item[data-tab='" + dataTab + "']").addClass("active");
            } else {
                $(this).attr("aria-selected", "false");
                $(this).attr("tabindex", "-1");
                $(this).removeClass("active");
                $(".tab-content__item[data-tab='" + dataTab + "']").removeClass("active");
            }
        });
    }

    var tabs = $(".tab-list").children();

    function moveFocusToTab(currentTab){
        currentTab.focus();
    }

    function moveFocusToPreviousTab(currentTab){
        if (!($(currentTab).index() === 0)) {
            moveFocusToTab($(currentTab).prev());
        }
    }

    function moveFocusToNextTab(currentTab){
        if (!($(currentTab).index() === (tabs.length - 1))) {
            moveFocusToTab($(currentTab).next());
        }
    }

    function keyupTab(event){
        var tgt = event.target;

        switch (event.keyCode) {
            case 37:
                moveFocusToPreviousTab(tgt);
                break;

            case 39:
                moveFocusToNextTab(tgt);
                break;

            default:
                break;
        }
    }



});