export default class Link extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.onclick.bind(this));
    this.style.cursor = 'pointer';
  }

  onclick(event) {
    const newLocation = event.target.getAttribute('href');
    router.navigateTo(newLocation);
  }

}

customElements.define('k8-link', Link);
