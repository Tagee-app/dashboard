<template>
    <v-app>
        <v-container style="margin-top: 20px">
            <v-row no-gutters>
                <v-col cols="2">
                    <Menu/>
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <v-row no-gutters>
                <FullCalendar defaultView="dayGridMonth" :plugins="calendarPlugins" :locale="locale"/>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import Menu from '../components/Menu';
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import itLocale from '@fullcalendar/core/locales/it';

    export default {
        name: "Homepage",
        components: {
            Menu,
            FullCalendar
        },
        data() {
            return {
                calendarPlugins: [dayGridPlugin],
                locale: itLocale
            }
        },
        methods: {}
    }
</script>
<style scoped>
    @import '~@fullcalendar/core/main.css';
    @import '~@fullcalendar/daygrid/main.css';
</style>