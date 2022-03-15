import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { later, bind, cancel, schedule } from '@ember/runloop';
import { createGesture } from 'ember-side-menu/utils/gestures';
import { addObserver, removeObserver } from '@ember/object/observers';
import { dependentKeyCompat } from '@ember/object/compat';

const styleProps = ['shadowStyle', 'positionStyle', 'transitionStyle', 'transformStyle'];

export default class SideMenuComponent extends Component {
  @service sideMenu;

  get menu() {
    return this.sideMenu.menus[this.id];
  }
  get progress() {
    return this.menu.progress;
  }
  get isOpen() {
    return this.menu.isOpen;
  }
  @dependentKeyCompat
  get isClosed() {
    return this.menu.isClosed;
  }
  get isSlightlyOpen() {
    return this.menu.isSlightlyOpen;
  }
  isTouching = false;
  disableMenu = false;

  get id() {
    return this.args.id ?? 'default';
  }

  get side() {
    return this.args.side ?? 'left';
  }
  get width() {
    return this.args.width ?? '70%';
  }
  get rootNodeSelector() {
    return this.args.rootNodeSelector ?? 'body';
  }

  get initialTapAreaWidth() {
    return this.args.initialTapAreaWidth ?? 30;
  }
  get slightlyOpenWidth() {
    return this.args.slightlyOpenWidth ?? 20;
  }
  get slightlyOpenAfter() {
    return this.args.slightlyOpenAfter ?? 300;
  }

  get shadowStyle() {
    const progress = this.progress;
    return progress === 0 ? 'box-shadow: none;' : '';
  }

  get positionStyle() {
    const width = this.width;
    const side = this.side;

    if (side === 'left') {
      return `width: ${width}; right: initial; left: -${width};`;
    }

    return `width: ${width}; left: initial; right: -${width};`;
  }

  get transitionStyle() {
    const progress = this.progress;
    return progress === 0 || progress === 100 ? 'transition: transform 0.2s ease-out;' : 'transition: none;';
  }

  get transformStyle() {
    const side = this.side;
    const isSlightlyOpen = this.isSlightlyOpen;
    const slightlyOpenWidth = this.slightlyOpenWidth;
    const direction = side === 'right' ? '-' : '';
    const unit = isSlightlyOpen ? 'px' : '%';
    const progress = isSlightlyOpen ? slightlyOpenWidth : this.progress;

    return `transform: translateX(${direction}${progress}${unit});`;
  }

  get style() {
    const combinedStyle = styleProps.reduce((acc, style) => acc + this[style], '');

    return htmlSafe(combinedStyle);
  }

  _setScrollDisable() {
    const isClosed = this.isClosed;
    const wasClosed = this.wasClosed;

    if (isClosed === wasClosed) return;

    const rootNode = document.querySelector(this.rootNodeSelector);

    if (isClosed) {
      rootNode.classList.remove('disable-scroll');
    } else {
      rootNode.classList.add('disable-scroll');
    }

    this.wasClosed = isClosed;
  }

  constructor() {
    super(...arguments);
    this._initMenu();
  }

  @action
  didInsert(element) {
    this._setupEventListeners(element);
    this._setupObservers();
  }

  willDestroy() {
    this._destroyMenu();
    this._removeEventListeners();
    this._removeObservers();
    super.willDestroy(...arguments);
  }

  _initMenu() {
    const sideMenu = this.sideMenu;
    sideMenu.create(this.id);
  }

  _destroyMenu() {
    const sideMenu = this.sideMenu;
    sideMenu.destroy(this.id);
  }

  _setupEventListeners(element) {
    const rootNode = document.querySelector(this.rootNodeSelector);
    const onRootNodeTouch = bind(this, this._onRootNodeTouch);

    rootNode.addEventListener('touchstart', onRootNodeTouch);

    schedule('afterRender', () => {
      this.onTouchStart = onRootNodeTouch;
    });
    const onMenuScroll = () => {
      if (!this.disableMenu && !this.isInProgress) {
        const enableMenuOnce = (e) => {
          this.disableMenu = false;
          e.target.removeEventListener(e.type, enableMenuOnce);
        };
        this.disableMenu = true;
        element.addEventListener('touchend', enableMenuOnce);
      }
    };
    element.addEventListener('scroll', onMenuScroll);
  }

  _setupObservers() {
    this._setScrollDisable();
    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'isClosed', this, '_setScrollDisable');
  }

  _removeObservers() {
    removeObserver(this, 'isClosed', this, '_setScrollDisable');
  }

  _removeEventListeners() {
    const onTouchStart = this.onTouchStart;
    const rootNode = document.querySelector(this.rootNodeSelector);

    rootNode.removeEventListener('touchstart', onTouchStart);
  }

  _onRootNodeTouch(evt) {
    let runOpenMenuSlightly;
    const rootNode = document.querySelector(this.rootNodeSelector);
    const onTouchMove = (event) => {
      if (runOpenMenuSlightly) {
        cancel(runOpenMenuSlightly);
      }

      if (this.disableMenu) return;

      if (!(this._isTouchWithin(event, this.slightlyOpenWidth) && this.isClosed)) {
        if (this.isSlightlyOpen) {
          this.isSlightlyOpen = false;
        }

        if (!this.isInProgress && this._isInitialGesture(event)) {
          this.isInProgress = true;
        }

        if (this.isInProgress) {
          this._updateProgress(event.touches[0].pageX);
        }
      }
    };
    const onTouchEnd = (event) => {
      rootNode.removeEventListener('touchmove', onTouchMove);
      rootNode.removeEventListener('touchend', onTouchEnd);
      this.isTouching = false;
      this.isInProgress = false;

      if (runOpenMenuSlightly) {
        cancel(runOpenMenuSlightly);
      }

      this._completeMenuTransition(event);
    };

    this.isTouching = true;

    if (this._validToStartTracking(evt)) {
      this.touchStartEvent = evt;
      this._setTouchOffset(evt);

      if (this._isTouchWithin(evt, this.initialTapAreaWidth)) {
        runOpenMenuSlightly = later(() => {
          if (this.isClosed && this.isTouching) {
            this.isSlightlyOpen = true;
          }
        }, this.slightlyOpenAfter);
      }

      rootNode.addEventListener('touchmove', onTouchMove);
      rootNode.addEventListener('touchend', onTouchEnd);
    }
  }

  _setTouchOffset(event) {
    const isOpen = this.isOpen;
    const pageX = event.touches[0].pageX;
    const side = this.side;

    if (isOpen) {
      if (side === 'left') {
        this.touchOffset = Math.max(0, this.element.offsetWidth - pageX);
      } else {
        this.touchOffset = Math.max(0, this.element.offsetWidth - (window.innerWidth - pageX));
      }
    } else {
      this.touchOffset = 0;
    }
  }

  _updateProgress(touchPageX) {
    const elementWidth = this.element.offsetWidth;
    const touchOffset = this.touchOffset;
    const side = this.side;
    const relativeX = side === 'left' ? touchPageX : window.innerWidth - touchPageX;
    const progress = Math.min(((relativeX + touchOffset) / elementWidth) * 100, 100);

    this.menu.progress = progress;
  }

  _completeMenuTransition(event) {
    const progress = this.progress;
    const touchStartEvent = this.touchStartEvent;
    const side = this.side;
    const gesture = createGesture(touchStartEvent, event);
    const minClosingVelocity = 0.3;
    const autoCompleteThreshold = 50;
    const isSwipingLeft = gesture.velocityX > minClosingVelocity;
    const isSwipingRight = gesture.velocityX < -minClosingVelocity;

    const isClosingMovement = (side === 'left' && isSwipingLeft) || (side === 'right' && isSwipingRight);
    const isOpeningMovement = (side === 'left' && isSwipingRight) || (side === 'right' && isSwipingLeft);

    if (isClosingMovement || progress < autoCompleteThreshold) {
      this.sideMenu.close(this.id);
    } else if (isOpeningMovement || progress >= autoCompleteThreshold) {
      this.sideMenu.open(this.id);
    }
  }

  _validToStartTracking(event) {
    return this.isOpen || this._isTouchWithin(event, this.initialTapAreaWidth);
  }

  _isInitialGesture(event) {
    const touchStartEvent = this.touchStartEvent;
    const gesture = createGesture(touchStartEvent, event);
    const minTime = 10; // 10 ms minimum time of gesture
    const isMoreSwiping = Math.abs(gesture.velocityX) > Math.abs(gesture.velocityY);
    return gesture.time > minTime && isMoreSwiping;
  }

  _isTouchWithin(event, areaWidth) {
    const side = this.side;
    const pageX = event.touches[0].pageX;

    return (side === 'left' && pageX < areaWidth) || (side === 'right' && pageX > window.innerWidth - areaWidth);
  }
}
