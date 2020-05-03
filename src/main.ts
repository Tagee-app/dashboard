import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as firebase from "firebase";
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

Vue.config.productionTip = false

const firebaseConfig = {
    apiKey: "AIzaSyCYF8jqTzSE15698wNQKVqwpSFkMBXAoT8",
    authDomain: "tagee-181b1.firebaseapp.com",
    databaseURL: "https://tagee-181b1.firebaseio.com",
    projectId: "tagee-181b1",
    storageBucket: "tagee-181b1.appspot.com",
    messagingSenderId: "308347881338",
    appId: "1:308347881338:web:7d6977dffb4866c0b078c3",
    measurementId: "G-NKBRGL2TC1"
}

let app = '';

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            vuetify,
            render: h => h(App)
        }).$mount('#app')
    }
});

