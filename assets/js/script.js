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


    /*$(".tab-list__item").on("click", function(){
     setSelectedTab($(this));
     });
     $(".tab-list__item").on("keyup", function(event){
     keyupTab(event);
     });*/


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







});

class TabsManual {
    constructor(groupNode){
        this.tablistNode = groupNode;

        this.tabs = [];

        this.firstTab = null;
        this.lastTab = null;

        this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
        this.tabpanels = [];

        for (var i = 0; i < this.tabs.length; i += 1) {
            var tab = this.tabs[i];
            var tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

            tab.tabIndex = -1;
            tab.setAttribute('aria-selected', 'false');
            this.tabpanels.push(tabpanel);

            tab.addEventListener('keydown', this.onKeydown.bind(this));
            tab.addEventListener('click', this.onClick.bind(this));

            if (!this.firstTab) {
                this.firstTab = tab;
            }
            this.lastTab = tab;
        }

        this.setSelectedTab(this.firstTab);
    }

    setSelectedTab(currentTab){
        for (var i = 0; i < this.tabs.length; i += 1) {
            var tab = this.tabs[i];
            if (currentTab === tab) {
                tab.setAttribute('aria-selected', 'true');
                tab.removeAttribute('tabindex');
                this.tabpanels[i].classList.add('active');
            } else {
                tab.setAttribute('aria-selected', 'false');
                tab.tabIndex = -1;
                this.tabpanels[i].classList.remove('active');
            }
        }
    }

    moveFocusToTab(currentTab){
        currentTab.focus();
    }

    moveFocusToPreviousTab(currentTab){
        var index;

        if (currentTab === this.firstTab) {
            this.moveFocusToTab(this.lastTab);
        } else {
            index = this.tabs.indexOf(currentTab);
            this.moveFocusToTab(this.tabs[index - 1]);
        }
    }

    moveFocusToNextTab(currentTab){
        var index;

        if (currentTab === this.lastTab) {
            this.moveFocusToTab(this.firstTab);
        } else {
            index = this.tabs.indexOf(currentTab);
            this.moveFocusToTab(this.tabs[index + 1]);
        }
    }

    /* EVENT HANDLERS */

    onKeydown(event){
        var tgt = event.currentTarget,
                flag = false;

        switch (event.key) {
            case 'ArrowLeft':
                this.moveFocusToPreviousTab(tgt);
                flag = true;
                break;

            case 'ArrowRight':
                this.moveFocusToNextTab(tgt);
                flag = true;
                break;

            case 'Home':
                this.moveFocusToTab(this.firstTab);
                flag = true;
                break;

            case 'End':
                this.moveFocusToTab(this.lastTab);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    // Since this example uses buttons for the tabs, the click onr also is activated
    // with the space and enter keys
    onClick(event){
        this.setSelectedTab(event.currentTarget);
    }
}

// Initialize tablist

window.addEventListener('load', function(){
    var tablists = document.querySelectorAll('.tab-list');
    for (var i = 0; i < tablists.length; i++) {
        new TabsManual(tablists[i]);
    }
});