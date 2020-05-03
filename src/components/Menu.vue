<template>
    <div>
        <quick-menu
                :menu-count=4
                :icon-class=icons
                :menu-url-list=list
                :backgroundColor="'orange'"
                :color="'white'"
                @process="menuAction"
        >

        </quick-menu>
    </div>
</template>

<script>
    import quickMenu from 'vue-quick-menu';
    import firebase from "firebase";

    export default {
        name: "Menu",
        components: {
            quickMenu
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

    i {
        font-size: 25px !important;
        margin-top: 14px !important;
    }

    .fa-user-cog {
        margin-left: 5px !important;
    }

    .fa-chart-bar {
        margin-top: 16px !important;
    }

    .fa-sign-out-alt {
        margin-left: 6px !important;
    }

    div .menu{
        background-color: green !important;
    }
</style>