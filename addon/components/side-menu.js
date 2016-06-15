import Ember from "ember";

export default Ember.Component.extend({
    sideMenu: Ember.inject.service(),

    progress: Ember.computed.alias("sideMenu.progress"),
    isOpen: Ember.computed.alias("sideMenu.isOpen"),
    isClosed: Ember.computed.alias("sideMenu.isClosed"),

    attributeBindings: ["style"],
    classNames: ["side-menu"],

    side: "left",
    width: "70%",

    positionStyle: Ember.computed("width", "side", function () {
        const width = this.get("width");
        const side = this.get("side");

        if (side === "left") {
            return `width: ${width}; right: initial; left: -${width};`;
        }

        return `width: ${width}; left: initial; right: -${width};`;
    }),

    transitionStyle: Ember.computed("progress", function () {
        const progress = this.get("progress");
        return (progress === 0 || progress === 100)
                  ? "transition: transform 0.2s ease-out;"
                  : "transition: none;";
    }),

    transformStyle: Ember.computed("progress", "side", function () {
        let progress = this.get("progress");

        if (this.get("side") === "right") {
            progress = -progress;
        }

        return `transform: translateX(${progress}%);`;
    }),

    style: Ember.computed("widthStyle", "transitionStyle", "transformStyle", function () {
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
        const rootNode = this.get("rootNode");

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
        const rootNode = document.querySelector("body");
        const onTouchStart = Ember.run.bind(this, this.rootNodeTouch);

        rootNode.addEventListener("touchstart", onTouchStart);

        Ember.run.schedule("afterRender", () => {
            this.set("rootNode", rootNode);
            this.set("onTouchStart", onTouchStart);
        });
    },

    removeEventListeners() {
        const onTouchStart = this.get("onTouchStart");
        const rootNode = this.get("rootNode");

        rootNode.removeEventListener("touchstart", onTouchStart);
    },

    rootNodeTouch() {
        const rootNode = this.get("rootNode");
        const onTouchMove = (event) => {
            event.preventDefault();
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

        if (this.needToTrack(event)) {
            this.set("touchStartEvent", event);

            this.setTouchOffset(event);

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
        const side = this.get("side");
        const pageX = event.touches[0].pageX;

        return this.get("isOpen") ||
            (side === "left" && pageX < 40) ||
            (side === "right" && pageX > window.innerWidth - 40);
    },

    calculateVelocityX(startX, startTimeStamp, endX, endTimeStamp) {
        const deltaX = startX - endX;
        const deltaTime = endTimeStamp - startTimeStamp;

        return deltaX / deltaTime;
    },
});
