
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
import videojs from "video.js";
window.$ = require('jquery')
window.JQuery = require('jquery')

window.Vue = require('vue').default;

Vue.component('login-component', require('./components/LoginComponent.vue').default);
Vue.component('products', require('./components/ProductsComponent.vue').default);
Vue.component('pagination', require('laravel-vue-pagination'));
Vue.component('products-create', require('./components/ProductCreateComponent.vue').default);
Vue.component('products-edit', require('./components/ProductEditComponent.vue').default);
Vue.component('video-player', require('./components/VideoComponent.vue').default);

Vue.config.ignoredElements =[
    'video-js'
]
const app = new Vue({
    el: '#app',
});
