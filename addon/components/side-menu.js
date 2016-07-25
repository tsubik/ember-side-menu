import Ember from "ember";

const {
    inject: { service },
    computed,
} = Ember;

export default Ember.Component.extend({
    sideMenu: service(),

    progress: computed.alias("sideMenu.progress"),
    isOpen: computed.alias("sideMenu.isOpen"),
    isClosed: computed.alias("sideMenu.isClosed"),
    isSlightlyOpen: computed.alias("sideMenu.isSlightlyOpen"),

    attributeBindings: ["style"],
    classNames: ["side-menu"],

    side: "left",
    width: "70%",
    rootNodeSelector: "body",

    initialTapAreaWidth: 40,
    slightlyOpenWidth: 20,

    positionStyle: computed("width", "side", function () {
        const width = this.get("width");
        const side = this.get("side");

        if (side === "left") {
            return `width: ${width}; right: initial; left: -${width};`;
        }

        return `width: ${width}; left: initial; right: -${width};`;
    }),

    transitionStyle: computed("progress", function () {
        const progress = this.get("progress");
        return (progress === 0 || progress === 100)
                  ? "transition: transform 0.2s ease-out;"
                  : "transition: none;";
    }),

    transformStyle: computed("progress", "side", "isSlightlyOpen", function () {
        const side = this.get("side");
        const isSlightlyOpen = this.get("isSlightlyOpen");
        const slightlyOpenWidth = this.get("slightlyOpenWidth");
        const direction = side === "right" ? "-" : "";
        const unit = isSlightlyOpen ? "px" : "%";
        const progress = isSlightlyOpen ? slightlyOpenWidth : this.get("progress");

        return `transform: translateX(${direction}${progress}${unit});`;
    }),

    style: computed("widthStyle", "transitionStyle", "transformStyle", function () {
        const transformStyle = this.get("transformStyle");
        const transitionStyle = this.get("transitionStyle");
        const positionStyle = this.get("positionStyle");

        return new Ember.Handlebars.SafeString(
            `${transformStyle}${transitionStyle}${positionStyle}`
        );
    }),

    disableScroll: Ember.on("init", Ember.observer("isClosed", function () {
        const isClosed = this.get("isClosed");
        const wasClosed = this.get("wasClosed");
        const rootNode = document.querySelector(this.get("rootNodeSelector"));

        if (isClosed === wasClosed) {
            return;
        }

        if (isClosed) {
            Ember.$(rootNode).removeClass("disable-scroll");
        } else {
            Ember.$(rootNode).addClass("disable-scroll");
        }

        this.set("wasClosed", isClosed);
    })),

    didInsertElement() {
        this._super(...arguments);
        this.setupEventListeners();
    },

    willDestroyElement() {
        this._super(...arguments);
        this.removeEventListeners();
    },

    setupEventListeners() {
        const rootNode = document.querySelector(this.get("rootNodeSelector"));
        const onTouchStart = Ember.run.bind(this, this.rootNodeTouch);

        rootNode.addEventListener("touchstart", onTouchStart);

        Ember.run.schedule("afterRender", () => {
            this.set("onTouchStart", onTouchStart);
        });
    },

    removeEventListeners() {
        const onTouchStart = this.get("onTouchStart");
        const rootNode = document.querySelector(this.get("rootNodeSelector"));

        rootNode.removeEventListener("touchstart", onTouchStart);
    },

    rootNodeTouch(evt) {
        const rootNode = document.querySelector(this.get("rootNodeSelector"));
        const onTouchMove = (event) => {
            event.preventDefault();
            if (this.get("isSlightlyOpen")) {
                this.set("isSlightlyOpen", false);
            }
            this.updateProgress(event.touches[0].pageX);
        };
        const throttledOnTouchMove = (event) => {
            Ember.run.throttle(this, onTouchMove, event, 10);
        };
        const onTouchEnd = Ember.run.bind(this, (event) => {
            rootNode.removeEventListener("touchmove", throttledOnTouchMove);
            rootNode.removeEventListener("touchend", onTouchEnd);

            this.completeMenuTransition(event);
        });

        if (this.needToTrack(evt)) {
            this.set("touchStartEvent", evt);
            this.setTouchOffset(evt);

            if (this.isTapInInitialTapArea(evt)) {
                Ember.run.later(() => {
                    if (this.get("isClosed")) {
                        this.set("isSlightlyOpen", true);
                    }
                }, 200);
            }

            rootNode.addEventListener("touchmove", throttledOnTouchMove);
            rootNode.addEventListener("touchend", onTouchEnd);
        }
    },

    setTouchOffset(event) {
        const isOpen = this.get("isOpen");
        const pageX = event.touches[0].pageX;
        const side = this.get("side");

        if (isOpen) {
            if (side === "left") {
                this.set("touchOffset", Math.max(0, this.element.offsetWidth - pageX));
            } else {
                this.set(
                    "touchOffset",
                    Math.max(0, this.element.offsetWidth - (window.innerWidth - pageX))
                );
            }
        } else {
            this.set("touchOffset", 0);
        }
    },

    updateProgress(touchPageX) {
        const elementWidth = this.element.offsetWidth;
        const touchOffset = this.get("touchOffset");
        const side = this.get("side");
        const relativeX = side === "left" ? touchPageX : window.innerWidth - touchPageX;
        const progress = Math.min((relativeX + touchOffset) / elementWidth * 100, 100);

        this.set("progress", progress);
    },

    completeMenuTransition(event) {
        const progress = this.get("progress");
        const touchStartEvent = this.get("touchStartEvent");
        const side = this.get("side");
        const velocityX = this.calculateVelocityX(
            touchStartEvent.touches[0].pageX,
            touchStartEvent.timeStamp,
            event.changedTouches[0].pageX,
            event.timeStamp
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
            this.get("sideMenu").close();
        } else if (isOpeningMovement || progress >= autoCompleteThreshold) {
            this.get("sideMenu").open();
        }
    },

    needToTrack(event) {
        return this.get("isOpen") || this.isTapInInitialTapArea(event);
    },

    isTapInInitialTapArea(event) {
        const side = this.get("side");
        const pageX = event.touches[0].pageX;
        const initialTapAreaWidth = this.get("initialTapAreaWidth");

        return (side === "left" && pageX < initialTapAreaWidth) ||
            (side === "right" && pageX > window.innerWidth - initialTapAreaWidth);
    },

    calculateVelocityX(startX, startTimeStamp, endX, endTimeStamp) {
        const deltaX = startX - endX;
        const deltaTime = endTimeStamp - startTimeStamp;

        return deltaX / deltaTime;
    },
});
