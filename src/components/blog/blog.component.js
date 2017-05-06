import Link from '../link.component.js';
import Header from '../header/header.component.js';
import Entry from './entry.component.js';

// Simulate a database or an async request...
import posts from './database.js';


export default class Blog extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <k8-header></k8-header>
      <section>
        ${this._posts(posts)}
      </section>
    `;
  }

  _posts(posts) {
    return posts.map(post => this._entry(post)).join('');
  }
  _entry(post) {
    return `<blog-entry title="${post.title}" content="${post.content}"></blog-entry>`;
  }
}

customElements.define('k8-blog', Blog);
