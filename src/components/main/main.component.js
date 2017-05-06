import Header from '../header/header.component.js';

export default class Main extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <k8-header></k8-header>
      <section>
        <h1> Main </h1>
        <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis libero voluptatem at quidem provident doloremque accusantium consectetur. Facilis a, labore ex, dicta, dolorum quam iusto dignissimos, ipsum perspiciatis nulla qui. </p>
      </section>
    `;
  }
}

customElements.define('k8-main', Main);
