# Ember-side-menu

[![Build Status](https://travis-ci.org/tsubik/ember-side-menu.svg?branch=master)](https://travis-ci.org/tsubik/ember-side-menu)
[![npm version](https://badge.fury.io/js/ember-side-menu.svg)](https://badge.fury.io/js/ember-side-menu)

Mobile friendly Ember menu component using CSS transitions. More effects and SVG path animations coming soon.

![menu](https://cloud.githubusercontent.com/assets/1286444/16232587/722922f2-37cb-11e6-89bc-e529a916b80f.gif)

## Demo

Check out the live demo [here][live-demo]

## Ember Compability

This addon is compatible with and tested against Ember 1.13 and higher.

## Installation

`ember install ember-side-menu`

Import ember-side-menu styles in your application's `app.scss` file.

`@import "ember-side-menu";`

## Usage

### Side Menu

`{{#side-menu}}` component is a main container of your menu. Place it on some top level of your DOM
document for example in `application.hbs` file.

``` handlebars

{{#side-menu}}
  <header class="navbar navbar-default">
    <div class="navbar-header">
    ...
    </div>
  </header>
  <ul class="nav">
    <li class="header">Events</li>
    <li>
      {{#side-menu-link-to "new"}}
        {{inline-svg "plus" class="icon"}}
        New Event
      {{/side-menu-link-to}}
    </li>
    <li class="divider"></li>
    ...
    <li>
      <a href="https://cowbell-labs.com/" target="_blank">
        {{inline-svg "cowbell" class="icon cowbell"}}
        Cowbell Labs
      </a>
    </li>
  </ul>
{{/side-menu}}
{{content-backdrop}}
<div class="page-content">
  {{partial "shared/navbar"}}

  <main>
    <div class="container">
      {{outlet}}
    </div>
  </main>

  {{outlet "footer"}}
</div>

```

#### Parameters

* side - (string), which side of screen your menu takes. Possible values: ["left", "right"], default: "left"
* width - (string), target width of open menu. CSS width - example values: ["40px", "40%", ...], default: null (default width set in
CSS stylesheet to 70%)
* initialTapAreaWidth - (integer, in px) - area width on left/right screen edge when menu swipe opening
is initiated, default: 30
* slightlyOpenWidth - (integer, in px) - width of slightly open menu. Menu is opened slightly on tap event
within `initialTapAreaWidth` to the edge, default: 20
* slightlyOpenAfter - (integer, in ms) - time delay after which menu is slighlty opened if it is still closed,
default: 300

### Content Backdrop

If you want to add backdrop to the rest of the layout while menu opening, then just place `{{content-backdrop}}`
component after `{{#side-menu}}` component.

``` handlebars

{{#side-menu}}
...
{{/side-menu}}
{{content-backdrop}}

```

### Side Menu Toggle

Like a button component to toggle menu.

You can use default toggle button consist with some toggle bars

``` handlebars
{{side-menu-toggle}}
```

You can use your own design block.

``` handlebars
{{#side-menu-toggle}}
  <span class="glyphicon glyphicon-menu-hamburger"></span>
{{/side-menu-toggle}}
```

You can create a custom one by extending the main component.

``` javascript
import SideMenuToggle from "ember-side-menu/components/side-menu-toggle";

export default SideMenuToggle.extend({
    tagName: "button",
    classNames: ["navbar-btn", "btn", "btn-link", "pull-left"],
});
```

#### Parameters

* side - (string), which side of screen your menu toggle takes. Possible values: ["left", "right"], default: "left"

### Side Menu Link To

Works like a standard `{{link-to}}` helper, but also closes the menu.

``` handlebars
{{#side-menu-link-to "new"}}
  New Event
{{/side-menu-link-to}
```

### Side Menu Service

There is an available `sideMenu` service to control the menu.

``` javascript
export default Ember.Route.extend({
  sideMenu: Ember.inject.service(),

  actions: {
    openSideMenu() {
      this.get("sideMenu").open();
    },
  },
});
```

#### Methods

* open
* close
* toggle

#### Properties

* isOpen (boolean)
* isClosed (boolean)
* isSlightlyOpen (boolean)
* progress (number) 0-100

## License

MIT

[live-demo]: https://tsubik.com/ember-side-menu
