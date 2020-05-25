<template>
    <v-app id="app">
        <Menu/>
        <main id="page-wrap">
            <v-container style="margin-top: 60px">
                <v-row>
                    <FullCalendar
                            defaultView="dayGridMonth"
                            :plugins="calendarPlugins"
                            :locale="locale"
                            :showNonCurrentDates="false"
                            @dateClick="handleDateClick"
                    />
                </v-row>

                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Richiesta per il giorno {{requestData}}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn dark text @click="dialog = false">Salva</v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-container fluid>
                            <!-- Barra per selezione tipo di richiesta -->
                            <v-row>
                                <div v-for="(button, key) in buttons" :key="key">
                                    <v-btn small class="ma-2" v-for="attribute in button"
                                           :key="attribute.ref"
                                           :outlined="attribute.outlined"
                                           :color="attribute.color"
                                           @click="changeButtonState($event, attribute.ref)"
                                    >
                                        <span :style="[!attribute.outlined ? {'color' : 'white'} : {}]">
                                            {{attribute.ref}}
                                        </span>
                                    </v-btn>
                                </div>
                            </v-row>
                        </v-container>
                        <v-divider></v-divider>
                        <v-list three-line subheader>
                            <v-subheader>Dettagli</v-subheader>

                        </v-list>
                    </v-card>
                </v-dialog>
            </v-container>
        </main>
    </v-app>
</template>

<script>
    import Menu from '../components/Menu';
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import itLocale from '@fullcalendar/core/locales/it';
    import interactionPlugin from '@fullcalendar/interaction';

    export default {
        name: "Homepage",
        components: {
            Menu,
            FullCalendar
        },
        data() {
            return {
                calendarPlugins: [dayGridPlugin, interactionPlugin],
                locale: itLocale,
                dialog: false,
                notifications: false,
                sound: true,
                widgets: false,
                requestData: "",
                outlinedButton: true,
                buttons: [
                    {
                        ferie: {
                            color: "pink lighten-3",
                            ref: "ferie",
                            outlined: true,
                        }
                    },
                    {
                        permesso: {
                            color: "deep-purple lighten-3",
                            ref: "permesso",
                            outlined: true,
                        }
                    },
                    {
                        malattia: {
                            color: "deep-purple lighten-3",
                            ref: "malattia",
                            outlined: true,
                        }
                    },
                    {
                        smartWorking: {
                            color: "deep-purple lighten-3",
                            ref: "smart working",
                            outlined: true,
                        }
                    },
                    {
                        congedoMatrimoniale: {
                            color: "deep-purple lighten-3",
                            ref: "congedo matrimoniale",
                            outlined: true,
                        }
                    },
                    {
                        maternità: {
                            color: "deep-purple lighten-3",
                            ref: "maternità",
                            outlined: true,
                        }
                    }
                ],
            }
        },
        methods: {
            handleDateClick(arg) {
                this.requestData = this.formatDateToItalianDate(arg.dateStr);
                this.dialog = true;
            },
            formatDateToItalianDate(dataStr) {
                const searchRegExp = /\//g;
                const options = {'weekday': 'long', 'month': '2-digit', 'day': '2-digit', 'year': 'numeric'};

                let data = new Date(dataStr).toLocaleString('it-IT', options);
                data = data.charAt(0).toUpperCase() + data.slice(1);

                return data.replace(searchRegExp, "-")
            },
            camelize(str) {
                return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                });
            },
            changeButtonState(event, elem) {
                const buttons = this.buttons;

                for (let i = 0; buttons.length > i; i++) {
                    const button = buttons[i][this.camelize(elem)];

                    if (button !== undefined) {
                        button.outlined = !button.outlined;
                    } else {
                        const otherKey = Object.keys(this.buttons[i])[0];
                        this.buttons[i][otherKey].outlined = true;
                    }
                }
            },
        }
    }
</script>
<style>
    @import '~@fullcalendar/core/main.css';
    @import '~@fullcalendar/daygrid/main.css';

    td.fc-sun {
        background-color: rgba(255, 0, 0, 0.15);
    }
</style>