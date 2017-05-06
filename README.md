Los módulos ES6 ya son casi una realidad:

- **Firefox**: Disponibles utilizando un flag a partir de Firefox 54+
- **Chrome**: Llegan a Chrome 60 de forma nativa y ya pueden probarse en chrome canary utilizando un flag.
- **EDGE**: Implementados utilizando un flag a partir de EDGE 15+
- **Webkit**: Ya estan funcionando a partir de Safari 10.1 (iOS 10.3)

Esto combinado a que `http2` y los `web components ` estan disponible en la mayoría de los navegadores, va a suponer por fin el gran cambio de paradigma en las aplicaciones web que todo el mundo estaba esperando.

## El futuro del desarrollo web.

He creado un repositorio de ejemplo en el que podemos ver lo que **creo** será una aplicación web en el 2018 cuyo funcionamiento se detalla a continuación en este artículo, para ser original la he llamado 2K8-example.

Para que esta app funcione se necesita un navegador compatible, a día de hoy  (mayo 2017) recomiendo usar Chrome Canary activando el flag chrome://flags/#enable-experimental-web-platform-features.

## Incluyendo Módulos ES6 en el navegador

Un módulo es6 es un archivo javascript normal, y se incluye en el navegador cambiando el atributo `type="text/javascript"`  por `type="module`

Es importante saber que estos archivos se ejecutan en modo estricto, además solamente se ejecutan una vez la página ha sido parseada por completo.

Se puede añadir el atributo `async` para que el script se ejecute inmediatamente después de cargarse.

Nuestras aplicaciones tendrán un punto de entrada, un script ES6 que cargará las dependencias bajo demanda. Tener múltiples archivos ya no es un problema sino una ventaja porque reducimos el peso inicial de la app y gracias a HTTP2 no necesitamos una nueva conexión por cada recurso que queramos descargar.

## Fallback para navegadores antiguos
Los navegadores no compatibles ignorarán los scripts de tipo `module` pero de ser necesario podemos dar soporte a navegadores antiguos añadiendo un script con el atributo `nomodule` que solamente será cargado si el navegador no soporta los módulos ES6.

Lo habitual será incluir un bundle.js con el compilado de nuestra app, pero en este ejemplo sencillamente se muestra un mensaje indicando que el navegador no es compatible.


## Problemas sin resolver

A pesar de estos nuevos avances, el desarrollo web sigue teniendo en mi opinion dos problemas fundamentales que habrá que afrontar:

- El routing: Hace falta una forma estandar y nativa de resolver el enrrutado en las SPA (single page apps)
- La implementación de la logica: Redux encaja muy bien con los web components, donde cada componente simplemente se encarga de renderizar un fragmento de estado, sin embargo aun no está claro como resolver cierto tipo de operaciones asíncronas, 


## Detalles de implementación


``` html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>2K8 Example</title>
	<!-- app entry point -->
	<script type="module" src="/src/main.js"></script>
  <!-- Fallback for "old" browsers -->
  <script defer nomodule src="/src/oldBrowsers.js"></script>
</head>
<body>
</body>
</html>
```


### main.js
Es el punto de entrada a nuestra aplicación, y el único script que se incluye en la web.

Dentro de `main.js` podemos orquestrar el resto de nuestra aplicación, en mi caso simplemente defino un router y 3 endpoints, destacar como se pueden usar los imports sin necesidad de ninguna clase de preprocesado como babel o browserify.

El router se encarga de procesar la ruta en la que nos encontramos y de instanciar el web-component correspondiente a cada ruta. Por ejemplo cuando la ruta sea `/` el router instanciara el componente `Main` y lo situará en el body de la web.

Ademas en el main se define un objeto global `router` que sera conocido en toda mi aplicación, este objeto tiene un método `navigateTo(url)` que permite navegar entre secciones actualizando la vista con el componente correspondiente. El elemento `k8-link` hace uso del router cuando es clickado.

```javascript
import Router from './router.js';

import Blog from './components/blog/blog.component.js';
import Main from './components/main/main.component.js';
import About from './components/about/about.component.js';


const router = new Router();
window.router = router; // make router global!

router
  .when('/', Main)
  .when('/blog', Blog)
  .when('/about', About)
  .init();
```

### Router.js

Router es una clase definida artesanalmente para resolver uno de los problemas que aun quedan en el desarrollo web, un routing efectivo de las SPA (single page application). Y no debe ser tomada como ejemplo de nada...

### Components
Aquí se encuentran los web-components utilizados en nuestra app de forma jerárquica. El header es compartido por el blog el main y el about y el link es compartido por todos los componentes.

La mayoría de los componentes son muy sencillos y solo definen un constructor y un html inicial, por ejemplo el propio header:

```javascript
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
```

Vemos que un componente puede hacer uso de otros componentes pero ha de importarlos previamente (`Header` define el componente `k8-header`)

### k8-link

Es un custom element, que se usa de forma similar a un link: `<k8-link href="/ruta"></k8-link>` pero que hace uso del objeto global router para cambiar la localización de la pestaña.

Lo ideal sería extender el elemento nativo `HTMLAnchorElement` alterando ligeramente el comportamiento nativo pero aprovechandonos de sus características nativas: el hover, focus, temas de accesibilidad... sin embargo no he sido capaz de extenderlo por lo que he creado un nuevo elemento desde cero.


```javascrit
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
```

### blog
Blog trata de demostrar una forma de renderizar una lista de posts utilizando web components.

La lista de posts esta definida dentro de `database.js` y es requerida desde el componente blog. Este componente tiene dos funciones internas `_entry` y `_post` que permiten renderizar (de forma arcaica) la lista de elementos.


```javascript 
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

```
