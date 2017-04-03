import Ember from "ember";

const {
    Component,
    computed,
    computed: { alias },
    String: { htmlSafe },
    get,
    set,
    $,
    inject: { service },
    run: { schedule, cancel, bind, later, throttle, once },
} = Ember;

const styleProps = [
    "shadowStyle",
    "positionStyle",
    "transitionStyle",
    "transformStyle",
];

export default Component.extend({
    sideMenu: service(),

    progress: alias("sideMenu.progress"),
    isOpen: alias("sideMenu.isOpen"),
    isClosed: alias("sideMenu.isClosed"),
    isSlightlyOpen: alias("sideMenu.isSlightlyOpen"),
    isTouching: false,

    attributeBindings: ["style"],
    classNames: ["side-menu"],

    side: "left",
    width: "70%",
    rootNodeSelector: "body",

    initialTapAreaWidth: 30,
    slightlyOpenWidth: 20,
    slightlyOpenAfter: 300,

    shadowStyle: computed("progress", function () {
        const progress = get(this, "progress");
        return progress === 0 ? "box-shadow: none;" : "";
    }),

    positionStyle: computed("width", "side", function () {
        const width = get(this, "width");
        const side = get(this, "side");

        if (side === "left") {
            return `width: ${width}; right: initial; left: -${width};`;
        }

        return `width: ${width}; left: initial; right: -${width};`;
    }),

    transitionStyle: computed("progress", function () {
        const progress = get(this, "progress");
        return (progress === 0 || progress === 100)
                  ? "transition: transform 0.2s ease-out;"
                  : "transition: none;";
    }),

    transformStyle: computed("progress", "side", "isSlightlyOpen", function () {
        const side = get(this, "side");
        const isSlightlyOpen = get(this, "isSlightlyOpen");
        const slightlyOpenWidth = get(this, "slightlyOpenWidth");
        const direction = side === "right" ? "-" : "";
        const unit = isSlightlyOpen ? "px" : "%";
        const progress = isSlightlyOpen ? slightlyOpenWidth : get(this, "progress");

        return `transform: translateX(${direction}${progress}${unit});`;
    }),

    style: computed(...styleProps, function () {
        const combinedStyle = styleProps.reduce(
            (acc, style) => acc + get(this, style),
            ""
        );

        return htmlSafe(combinedStyle);
    }),

    // disableScroll: on("init", observer("isClosed", function () {
    //     const isClosed = get(this, "isClosed");
    //     const wasClosed = get(this, "wasClosed");

    //     if (isClosed === wasClosed) {
    //         return;
    //     }

    //     const $rootNode = $(get(this, "rootNodeSelector"));

    //     if (isClosed) {
    //         $rootNode.removeClass("disable-scroll");
    //     } else {
    //         $rootNode.addClass("disable-scroll");
    //     }

    //     set(this, "wasClosed", isClosed);
    // })),

    _setScrollDisable() {
        const isClosed = get(this, "isClosed");
        const $rootNode = $(get(this, "rootNodeSelector"));

        if (isClosed) {
            $rootNode.removeClass("disable-scroll");
        } else {
            $rootNode.addClass("disable-scroll");
        }
    },

    didInsertElement() {
        this._super(...arguments);
        this._setupEventListeners();
    },

    willDestroyElement() {
        this._super(...arguments);
        this._removeEventListeners();
    },

    _setupEventListeners() {
        const $rootNode = $(get(this, "rootNodeSelector"));
        const onRootNodeTouch = bind(this, this._onRootNodeTouch);

        $rootNode.on("touchstart", onRootNodeTouch);

        schedule("afterRender", () => {
            set(this, "onTouchStart", onRootNodeTouch);
        });
    },

    _setupObservers() {
        this.addObserver("isClosed", () => {
            once(this, "_setScrollDisable");
        });
    },

    _removeEventListeners() {
        const onTouchStart = get(this, "onTouchStart");
        const $rootNode = $(get(this, "rootNodeSelector"));

        $rootNode.off("touchstart", onTouchStart);
    },

    _onRootNodeTouch(evt) {
        let runOpenMenuSlightly;
        const $rootNode = $(get(this, "rootNodeSelector"));
        const onTouchMove = (event) => {
            event.preventDefault();

            if (runOpenMenuSlightly) {
                cancel(runOpenMenuSlightly);
            }

            if (!(this._isTouchWithin(event, get(this, "slightlyOpenWidth"))
                  && this.get("isClosed"))) {
                if (get(this, "isSlightlyOpen")) {
                    set(this, "isSlightlyOpen", false);
                }
                this._updateProgress(event.originalEvent.touches[0].pageX);
            }
        };
        const throttledOnTouchMove = (event) => {
            throttle(this, onTouchMove, event, 10);
        };
        const onTouchEnd = bind(this, (event) => {
            $rootNode.off("touchmove", throttledOnTouchMove);
            $rootNode.off("touchend", onTouchEnd);
            set(this, "isTouching", false);

            if (runOpenMenuSlightly) {
                cancel(runOpenMenuSlightly);
            }

            this._completeMenuTransition(event);
        });

        set(this, "isTouching", true);

        if (this._needToTrack(evt)) {
            set(this, "touchStartEvent", evt);
            this._setTouchOffset(evt);

            if (this._isTouchWithin(evt, get(this, "initialTapAreaWidth"))) {
                runOpenMenuSlightly = later(() => {
                    if (get(this, "isClosed") && get(this, "isTouching")) {
                        set(this, "isSlightlyOpen", true);
                    }
                }, get(this, "slightlyOpenAfter"));
            }

            $rootNode.on("touchmove", throttledOnTouchMove);
            $rootNode.on("touchend", onTouchEnd);
        }
    },

    _setTouchOffset(event) {
        const isOpen = get(this, "isOpen");
        const pageX = event.originalEvent.touches[0].pageX;
        const side = get(this, "side");

        if (isOpen) {
            if (side === "left") {
                set(this, "touchOffset", Math.max(0, this.element.offsetWidth - pageX));
            } else {
                set(
                    this,
                    "touchOffset",
                    Math.max(0, this.element.offsetWidth - (window.innerWidth - pageX))
                );
            }
        } else {
            set(this, "touchOffset", 0);
        }
    },

    _updateProgress(touchPageX) {
        const elementWidth = this.element.offsetWidth;
        const touchOffset = get(this, "touchOffset");
        const side = get(this, "side");
        const relativeX = side === "left" ? touchPageX : window.innerWidth - touchPageX;
        const progress = Math.min((relativeX + touchOffset) / elementWidth * 100, 100);

        set(this, "progress", progress);
    },

    _completeMenuTransition(event) {
        const progress = get(this, "progress");
        const touchStartEvent = get(this, "touchStartEvent");
        const side = get(this, "side");
        const velocityX = this._calculateVelocityX(
            touchStartEvent.originalEvent.touches[0].pageX,
            touchStartEvent.originalEvent.timeStamp,
            event.originalEvent.changedTouches[0].pageX,
            event.originalEvent.timeStamp
        );
        const minClosingVelocity = 0.3;
        const autoCompleteThreshold = 50;
        const isSwipingLeft = velocityX > minClosingVelocity;
        const isSwipingRight = velocityX < -minClosingVelocity;

        const isClosingMovement = (side === "left" && isSwipingLeft) ||
                  (side === "right" && isSwipingRight);
        const isOpeningMovement = (side === "left" && isSwipingRight) ||
                  (side === "right" && isSwipingLeft);

        if (isClosingMovement || progress < autoCompleteThreshold) {
            get(this, "sideMenu").close();
        } else if (isOpeningMovement || progress >= autoCompleteThreshold) {
            get(this, "sideMenu").open();
        }
    },

    _needToTrack(event) {
        return get(this, "isOpen") ||
            this._isTouchWithin(event, get(this, "initialTapAreaWidth"));
    },

    _isTouchWithin(event, areaWidth) {
        const side = get(this, "side");
        const pageX = event.originalEvent.touches[0].pageX;

        return (side === "left" && pageX < areaWidth) ||
            (side === "right" && pageX > window.innerWidth - areaWidth);
    },

    _calculateVelocityX(startX, startTimeStamp, endX, endTimeStamp) {
        const deltaX = startX - endX;
        const deltaTime = endTimeStamp - startTimeStamp;

        return deltaX / deltaTime;
    },
});
