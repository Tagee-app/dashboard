<template>
    <div>
        <Push :closeOnNavigation="true">
            <button id="homepage" class="button-menu">
                <i class="fas fa-home" style="color: #cd409a"></i><span class="text-menu">Homepage</span>
            </button>
            <button id="report" class="button-menu">
                <i class="fas fa-chart-bar" style="color: #febd13"></i>
                <span class="text-menu">Report</span>
            </button>
            <button id="settings" class="button-menu">
                <i class="fas fa-user-cog" style="color: #fa8558"></i>
                <span class="text-menu">Impostazioni</span>
            </button>
            <button id="logout" @click="logout" class="button-menu bottom-elem">
                <i class="fas fa-sign-out-alt" style="color: #f25979"></i>
                <span class="text-menu">Logout</span>
            </button>

        </Push>
    </div>
</template>

<script>
    import {Push} from 'vue-burger-menu'
    import firebase from 'firebase';

    export default {
        name: "Menu",
        components: {
            Push
        },
        data() {
            return {}
        },
        methods: {
            logout() {
                firebase.auth().signOut().then(() => {
                    this.$router.push('login');
                }).catch(function (error) {
                    window.console.log(error)
                });
            }
        }
    }
</script>

<style>
    body {
        font-family: 'Roboto', 'sans-serif';
        background-color: aliceblue;
    }

    .bm-menu {
        background-color: #ffffff !important;
        box-shadow: rgb(236, 236, 236) 10px 0px 5px -2px
    }

    .bm-cross {
        background: #fa8558 !important;
    }

    .bm-burger-bars {
        background-color: #fa8558 !important;
    }

    .button-menu i {
        padding-top: 4px;
    }

    .bottom-elem {
        bottom: 0px;
        position: absolute;
    }

    .text-menu {
        color: #292929 !important;
    }

</style>