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
