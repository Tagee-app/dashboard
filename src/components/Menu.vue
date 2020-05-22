<template>
    <div>
        <Push :closeOnNavigation="true">
            <a id="homepage" href="#">
                <i class="fas fa-home"></i><span>Homepage</span>
            </a>
            <a id="report" href="#">
                <i class="fas fa-chart-bar"></i>
                <span>Report</span>
            </a>
            <a id="settings" href="#">
                <i class="fas fa-user-cog"></i>
                <span>Impostazioni</span>
            </a>
            <a id="logout" href="#">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        </Push>
    </div>
</template>

<script>
    import {Push} from 'vue-burger-menu'

    export default {
        name: "Menu",
        components: {
            Push
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>
    body {
        font-family: 'Roboto', 'sans-serif';
    }

    i {
        padding-top: 4px;
    }

</style>