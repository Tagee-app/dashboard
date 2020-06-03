import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Login from '../views/Login.vue'
import Homepage from '../views/Homepage.vue'
import * as firebase from "firebase";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '*',
        redirect: '/login'
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'Login'
        }
    },
    {
        path: '/homepage',
        name: 'Homepage',
        component: Homepage,
        meta: {
            requiresAuth: true,
            title: 'Homepage'
        }
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    window.document.title = to.meta && to.meta.title ? to.meta.title : '-';

    if (requiresAuth && !currentUser) next('login')
    else if (!requiresAuth && currentUser) next('homepage');
    else next();
});

export default router
