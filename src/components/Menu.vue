<template>
    <div>
        <Slide>
            <a id="home" href="#">
                <span>
                    <span class="material-icons-two-tone md-light"> home </span> Home</span>
            </a>
        </Slide>
    </div>
</template>

<script>
    import {Slide} from 'vue-burger-menu'
    import firebase from "firebase";

    export default {
        name: "Menu",
        components: {
            Slide
        },
        data() {
            return {
                icons: ['fas fa-home', 'fas fa-chart-bar', 'fas fa-user-cog', 'fas fa-sign-out-alt'],
                list: [
                    {
                        isLink: true,
                        url: "/homepage"
                    },
                    {
                        isLink: true,
                        url: "/stats"
                    },
                    {
                        isLink: true,
                        url: "/settings"
                    },
                    {
                        isLink: false,
                        url: "/homepage"
                    }
                ]
            }
        },
        methods: {
            menuAction(key = 0) {
                if (key === 3) {
                    this.$swal({
                        title: 'Logout',
                        text: "Sei sicuro di uscire?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#00b240',
                        cancelButtonColor: '#cacaca',
                        confirmButtonText: "Conferma",
                        cancelButtonText: "Annulla"
                    }).then(() => {
                        firebase.auth().signOut().then(() => {
                            this.$router.replace("login");
                        })
                    })
                }
            }
        }
    }
</script>

<style>
    body {
        font-family: 'Roboto', 'sans-serif';
    }

    /* Rules for using icons as white on a dark background. */
    .material-icons-two-tone.md-light { color: rgba(255, 255, 255, 1); }
</style>