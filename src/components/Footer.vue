<template>
    <div>
        <v-footer dark padless>
            <v-card class="flex">
                <v-card-title style="background-color: #fa8558">
                    <small>© {{ new Date().getFullYear() }}, made with &hearts; by <span style="cursor:pointer;" @click="openSocialLink('https://github.com/pacoogle')">Pacoogle</span></small>

                    <v-spacer></v-spacer>

                    <v-btn v-for="icon in icons" :key="icon.class" class="mx-2" dark icon @click="openSocialLink(icon.url)">
                        <v-icon size="24px">{{ icon.class }}</v-icon>
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-footer>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        data() {
            return {
                icons: [
                    {class: 'mdi-facebook', url: 'https://facebook.com'},
                    {class: 'mdi-twitter', url: 'https://facebook.com'},
                    {class: 'mdi-linkedin', url: 'https://facebook.com'},
                    {class: 'mdi-instagram', url: 'https://facebook.com'},
                ],
            }
        },
        methods: {
            openSocialLink(url) {
                window.open(url, "_blank");
            }
        }
    }
</script>

<style>
</style>