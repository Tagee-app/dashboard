<template>
    <v-app>
        <v-container>
            <v-row no-gutters>
                <v-col cols="2">
                    <Menu />
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import Menu from '../components/Menu';

    export default {
        name: "Homepage",
        components:{
          Menu
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style scoped>

</style>