<template>
    <v-app>
        <h1> Homepage </h1>
        <button @click="logout">Logout</button>
    </v-app>
</template>

<script>
    import firebase from 'firebase';

    export default {
        name: "Homepage",
        data() {
            return {}
        },
        methods: {
            logout() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace("login");
                })
            }
        }
    }
</script>
<style scoped>
</style>