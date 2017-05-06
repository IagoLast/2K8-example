const LOCATION_CHANGED = '$location-changed';

/**
 * Define the app routing.
 *
 */
export default class Router {
  constructor() {
    this.routes = {};
    addEventListener(LOCATION_CHANGED, this.onLocationChange.bind(this));
    window.onpopstate = this.onLocationChange.bind(this);
    return this;
  }

  init() {
    dispatchEvent(new Event(LOCATION_CHANGED));
    return this;
  }

  onLocationChange() {
    const route = window.location.pathname;
    const Component = this._getComponent(route);
    this._updateContent(Component);
  }

  _updateContent(Component) {
    document.body.innerHTML = '';
    if (Component) {
      let component = new Component()
      document.body.appendChild(component);
    }
  }

  navigateTo(url) {
    history.pushState({}, null, url);
    dispatchEvent(new Event(LOCATION_CHANGED));
  }

  when(route, component) {
    this.routes[route] = component;
    return this;
  }

  _getComponent(route) {
    return this.routes[route];
  }

}
