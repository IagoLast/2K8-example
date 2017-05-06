export default class Header extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
            <k8-link href="/"> Main </k8-link>
            <k8-link href="/blog"> Blog </k8-link>
            <k8-link href="/about"> About </k8-link>
    `;
  }
}

customElements.define('k8-header', Header);
