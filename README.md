# Ember-side-menu

[![Build Status](https://travis-ci.org/tsubik/ember-side-menu.svg?branch=master)](https://travis-ci.org/tsubik/ember-side-menu)
[![Ember Observer Score](https://emberobserver.com/badges/ember-side-menu.svg)](https://emberobserver.com/addons/ember-side-menu)
[![npm version](https://badge.fury.io/js/ember-side-menu.svg)](https://badge.fury.io/js/ember-side-menu)

Mobile friendly Ember menu component using CSS transitions. More effects and SVG path animations coming soon.

![menu](https://cloud.githubusercontent.com/assets/1286444/16232587/722922f2-37cb-11e6-89bc-e529a916b80f.gif)

## Demo

Check out the live demo [here](https://tsubik.com/ember-side-menu)

## Compatibility

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v12 or above


## Installation

`ember install ember-side-menu`

Import ember-side-menu styles in your application's `app.scss` file.

`@import "ember-side-menu";`

## Usage

### Side Menu

`<SideMenu>` component is a main container of your menu. Place it on some top level of your DOM
document for example in `application.hbs` file.

``` handlebars

<SideMenu>
  <header class="navbar navbar-default">
    <div class="navbar-header">
    ...
    </div>
  </header>
  <ul class="nav">
    <li class="header">Events</li>
    <li>
      <SideMenuLinkTo @route="new">
        {{inline-svg "plus" class="icon"}}
        New Event
      </SideMenuLinkTo>
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
</SideMenu>
<ContentBackdrop />
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

* id - (string), menu Id, use when using multiple menus, default: "default"
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

If you want to add backdrop to the rest of the layout while menu opening, then just place `<ContentBackdrop />`
component after `<SideMenu>` component.

``` handlebars

<SideMenu>
...
</SideMenu>
</ContentBackdrop />

```

#### Parameters

* menuId - (string), id of controlled menu, default: "default"

### Side Menu Toggle

Like a button component to toggle menu.

You can use default toggle button consist with some toggle bars

``` handlebars
<SideMenuToggle />
```

You can use your own design block.

``` handlebars
<SideMenuToggle>
  <span class="glyphicon glyphicon-menu-hamburger"></span>
</SideMenuToggle>
```

You can create a custom one by extending the main component.

``` javascript
import SideMenuToggle from "ember-side-menu/components/side-menu-toggle";

export default class MyComponent extends SideMenuToggle {
    get class() {
        return "navbar-btn btn btn-link pull-left";
    }
}
```

#### Parameters

* side - (string), which side of screen your menu toggle takes. Possible values: ["left", "right"], default: "left"
* menuId - (string), id of controlled menu, default: "default"

### Side Menu Link To

Works like a standard `<LinkTo>` component, but also closes the menu.

``` handlebars
<SideMenuLinkTo @route="new">
  New Event
</SideMenuLinkTo>

```

#### Parameters

* menuId - (string), id of menu which should be closed when clicking, default: "default"

### Using multiple side menus

There is a possiblity to declare more instances of side menu components, and control them separately.
Default menu id is `default` and it could be omitted, if you want to use more than one instance of side-menu
you should not forget about setting relevant `menuId` for connected menu components.

``` handlebars

<SideMenu @side="left" @id="leftMenu">
  Left Menu
</SideMenu>
<SideMenu @side="right" @id="rightMenu">
  Right Menu
</SideMenu>

<SideMenuToggle @menuId="leftMenu" />
<SideMenuToggle @menuId="rightMenu" />

<ContentBackdrop @menuId="leftMenu" />
<ContentBackdrop @menuId="rightMenu" />

```

### Side Menu Service

There is an available `sideMenu` service to control the menu.

``` javascript
export default class MyRoute extends Route {
  @service sideMenu;

  @action
  openSideMenu() {
    this.sideMenu.open();
  }
}
```

#### Methods

* open(menuId='default')
* close(menuId='default')
* toggle(menuId='default')

#### Properties

For backward compability there is a possiblity to control or check `default` menu properties directly on service object.

* isOpen (boolean)
* isClosed (boolean)
* isSlightlyOpen (boolean)
* progress (number) 0-100

When using mutliple menus or changing default `menuId` then menu's state is held in `menus` object.

For example to get `isOpen` property for menu with id `sampleMenu` we can use `this.sideMenu.menus.sampleMenu.isOpen`.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
