export default class Entry extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <h1> ${this.getAttribute('title')} </h1>
        <p> ${this.getAttribute('content')} </p>
    `;
  }
}

customElements.define('blog-entry', Entry);
