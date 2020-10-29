import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { set, get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, bind, cancel, schedule } from '@ember/runloop';
import { createGesture } from 'ember-side-menu/utils/gestures';

const styleProps = ['shadowStyle', 'positionStyle', 'transitionStyle', 'transformStyle'];

export default Component.extend({
  sideMenu: service(),

  menu: null,
  progress: alias('menu.progress'),
  isOpen: alias('menu.isOpen'),
  isClosed: alias('menu.isClosed'),
  isSlightlyOpen: alias('menu.isSlightlyOpen'),
  isTouching: false,
  disableMenu: false,

  attributeBindings: ['style'],
  classNames: ['side-menu'],
  classNameBindings: ['isInProgress:disable-scroll'],

  side: 'left',
  width: '70%',
  rootNodeSelector: 'body',

  initialTapAreaWidth: 30,
  slightlyOpenWidth: 20,
  slightlyOpenAfter: 300,

  shadowStyle: computed('progress', function() {
    const progress = get(this, 'progress');
    return progress === 0 ? 'box-shadow: none;' : '';
  }),

  positionStyle: computed('width', 'side', function() {
    const width = get(this, 'width');
    const side = get(this, 'side');

    if (side === 'left') {
      return `width: ${width}; right: initial; left: -${width};`;
    }

    return `width: ${width}; left: initial; right: -${width};`;
  }),

  transitionStyle: computed('progress', function() {
    const progress = get(this, 'progress');
    return progress === 0 || progress === 100 ? 'transition: transform 0.2s ease-out;' : 'transition: none;';
  }),

  transformStyle: computed('progress', 'side', 'isSlightlyOpen', function() {
    const side = get(this, 'side');
    const isSlightlyOpen = get(this, 'isSlightlyOpen');
    const slightlyOpenWidth = get(this, 'slightlyOpenWidth');
    const direction = side === 'right' ? '-' : '';
    const unit = isSlightlyOpen ? 'px' : '%';
    const progress = isSlightlyOpen ? slightlyOpenWidth : get(this, 'progress');

    return `transform: translateX(${direction}${progress}${unit});`;
  }),

  style: computed(...styleProps, function() {
    const combinedStyle = styleProps.reduce((acc, style) => acc + get(this, style), '');

    return htmlSafe(combinedStyle);
  }),

  _setScrollDisable() {
    const isClosed = get(this, 'isClosed');
    const wasClosed = get(this, 'wasClosed');

    if (isClosed === wasClosed) return;

    const rootNode = document.querySelector(get(this, 'rootNodeSelector'));

    if (isClosed) {
      rootNode.classList.remove('disable-scroll');
    } else {
      rootNode.classList.add('disable-scroll');
    }

    set(this, 'wasClosed', isClosed);
  },

  didInsertElement() {
    this._super(...arguments);
    this._initMenu();
    this._setupEventListeners();
    this._setupObservers();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._destroyMenu();
    this._removeEventListeners();
    this._removeObservers();
  },

  _initMenu() {
    const sideMenu = get(this, 'sideMenu');
    const menu = sideMenu.create(get(this, 'id'));
    set(this, 'menu', menu);
  },

  _destroyMenu() {
    const sideMenu = get(this, 'sideMenu');
    sideMenu.destroy(get(this, 'id'));
  },

  _setupEventListeners() {
    const rootNode = document.querySelector(get(this, 'rootNodeSelector'));
    const onRootNodeTouch = bind(this, this._onRootNodeTouch);

    rootNode.addEventListener('touchstart', onRootNodeTouch);

    schedule('afterRender', () => {
      set(this, 'onTouchStart', onRootNodeTouch);
    });
    const onMenuScroll = () => {
      if (!get(this, 'disableMenu') && !get(this, 'isInProgress')) {
        const enableMenuOnce = e => {
          set(this, 'disableMenu', false);
          e.target.removeEventListener(e.type, enableMenuOnce);
        };
        set(this, 'disableMenu', true);
        get(this, 'element').addEventListener('touchend', enableMenuOnce);
      }
    };
    get(this, 'element').addEventListener('scroll', onMenuScroll);
  },

  _setupObservers() {
    this._setScrollDisable();
    this.addObserver('isClosed', this, '_setScrollDisable');
  },

  _removeObservers() {
    this.removeObserver('isClosed', this, '_setScrollDisable');
  },

  _removeEventListeners() {
    const onTouchStart = get(this, 'onTouchStart');
    const rootNode = document.querySelector(get(this, 'rootNodeSelector'));

    rootNode.removeEventListener('touchstart', onTouchStart);
  },

  _onRootNodeTouch(evt) {
    let runOpenMenuSlightly;
    const rootNode = document.querySelector(get(this, 'rootNodeSelector'));
    const onTouchMove = event => {
      if (runOpenMenuSlightly) {
        cancel(runOpenMenuSlightly);
      }

      if (get(this, 'disableMenu')) return;

      if (!(this._isTouchWithin(event, get(this, 'slightlyOpenWidth')) && get(this, 'isClosed'))) {
        if (get(this, 'isSlightlyOpen')) {
          set(this, 'isSlightlyOpen', false);
        }

        if (!get(this, 'isInProgress') && this._isInitialGesture(event)) {
          set(this, 'isInProgress', true);
        }

        if (get(this, 'isInProgress')) {
          this._updateProgress(event.touches[0].pageX);
        }
      }
    };
    const onTouchEnd = event => {
      rootNode.removeEventListener('touchmove', onTouchMove);
      rootNode.removeEventListener('touchend', onTouchEnd);
      set(this, 'isTouching', false);
      set(this, 'isInProgress', false);

      if (runOpenMenuSlightly) {
        cancel(runOpenMenuSlightly);
      }

      this._completeMenuTransition(event);
    };

    set(this, 'isTouching', true);

    if (this._validToStartTracking(evt)) {
      set(this, 'touchStartEvent', evt);
      this._setTouchOffset(evt);

      if (this._isTouchWithin(evt, get(this, 'initialTapAreaWidth'))) {
        runOpenMenuSlightly = later(() => {
          if (get(this, 'isClosed') && get(this, 'isTouching')) {
            set(this, 'isSlightlyOpen', true);
          }
        }, get(this, 'slightlyOpenAfter'));
      }

      rootNode.addEventListener('touchmove', onTouchMove);
      rootNode.addEventListener('touchend', onTouchEnd);
    }
  },

  _setTouchOffset(event) {
    const isOpen = get(this, 'isOpen');
    const pageX = event.touches[0].pageX;
    const side = get(this, 'side');

    if (isOpen) {
      if (side === 'left') {
        set(this, 'touchOffset', Math.max(0, this.element.offsetWidth - pageX));
      } else {
        set(this, 'touchOffset', Math.max(0, this.element.offsetWidth - (window.innerWidth - pageX)));
      }
    } else {
      set(this, 'touchOffset', 0);
    }
  },

  _updateProgress(touchPageX) {
    const elementWidth = this.element.offsetWidth;
    const touchOffset = get(this, 'touchOffset');
    const side = get(this, 'side');
    const relativeX = side === 'left' ? touchPageX : window.innerWidth - touchPageX;
    const progress = Math.min(((relativeX + touchOffset) / elementWidth) * 100, 100);

    set(this, 'progress', progress);
  },

  _completeMenuTransition(event) {
    const progress = get(this, 'progress');
    const touchStartEvent = get(this, 'touchStartEvent');
    const side = get(this, 'side');
    const gesture = createGesture(touchStartEvent, event);
    const minClosingVelocity = 0.3;
    const autoCompleteThreshold = 50;
    const isSwipingLeft = gesture.velocityX > minClosingVelocity;
    const isSwipingRight = gesture.velocityX < -minClosingVelocity;

    const isClosingMovement = (side === 'left' && isSwipingLeft) || (side === 'right' && isSwipingRight);
    const isOpeningMovement = (side === 'left' && isSwipingRight) || (side === 'right' && isSwipingLeft);

    if (isClosingMovement || progress < autoCompleteThreshold) {
      get(this, 'sideMenu').close(get(this, 'id'));
    } else if (isOpeningMovement || progress >= autoCompleteThreshold) {
      get(this, 'sideMenu').open(get(this, 'id'));
    }
  },

  _validToStartTracking(event) {
    return get(this, 'isOpen') || this._isTouchWithin(event, get(this, 'initialTapAreaWidth'));
  },

  _isInitialGesture(event) {
    const touchStartEvent = get(this, 'touchStartEvent');
    const gesture = createGesture(touchStartEvent, event);
    const minTime = 10; // 10 ms minimum time of gesture
    const isMoreSwiping = Math.abs(gesture.velocityX) > Math.abs(gesture.velocityY);
    return gesture.time > minTime && isMoreSwiping;
  },

  _isTouchWithin(event, areaWidth) {
    const side = get(this, 'side');
    const pageX = event.touches[0].pageX;

    return (side === 'left' && pageX < areaWidth) || (side === 'right' && pageX > window.innerWidth - areaWidth);
  }
});
