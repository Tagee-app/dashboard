<template>
    <div>
        <Push :closeOnNavigation="true">
            <button id="homepage" class="button-menu">
                <i class="fas fa-home"></i><span>Homepage</span>
            </button>
            <button id="report" class="button-menu">
                <i class="fas fa-chart-bar"></i>
                <span>Report</span>
            </button>
            <button id="settings" class="button-menu">
                <i class="fas fa-user-cog"></i>
                <span>Impostazioni</span>
            </button>
                <button id="logout" @click="logout" class="button-menu bottom-elem">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
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
    }

    .bm-menu {
        background-color: #fa8558;
    }

    .bm-cross {
        background: #ffffff;
    }

    .bm-burger-bars {
        background-color: #535353;
    }

    .button-menu i{
        color: white;
        padding-top: 4px;
    }

    .bottom-elem{
        bottom: 0px;
        position: absolute;
    }

</style>