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

                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition"
                          v-if="isMobile()">
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

                <v-dialog v-model="dialog" persistent max-width="1000px" v-else>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Richiesta per il giorno {{requestData}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
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
                            <v-row style="margin-top: 20px">

                                <v-chip class="ma-2" color="orange" text-color="white">
                                    <span>{{ holidaysCount }}
                                        <span v-if="holidaysCount == 1"> giorni</span>
                                        <span v-else> giorni</span>
                                        <span> di ferie già
                                            <span v-if="holidaysCount == 1">utilizzato</span>
                                            <span v-else>utilizzati</span>
                                        </span>
                                    </span>
                                    <v-icon right>mdi-calendar-plus</v-icon>
                                </v-chip>

                                <v-chip class="ma-2" color="green" text-color="white">
                                    <span>{{ permissionsCount }}
                                        <span> ore</span>
                                        <span> di permesso già utilizzate</span>
                                    </span>
                                    <v-icon right>mdi-timer</v-icon>
                                </v-chip>

                                <v-chip class="ma-2" color="red" text-color="white">
                                    <span>{{ sicknessCount }}
                                        <span v-if="holidaysCount == 1"> giorni</span>
                                        <span v-else> giorni</span>
                                        <span> di malattia
                                            <span v-if="holidaysCount == 1">dichiarato</span>
                                            <span v-else>dichiarati</span>
                                        </span>
                                    </span>
                                    <v-icon right>mdi-hospital-building</v-icon>
                                </v-chip>
                            </v-row>


                            <small>
                                Tutte le richieste prima di essere confermate, dovranno essere accettate dal tuo
                                referente.
                            </small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog = false">Annulla</v-btn>
                            <v-btn color="blue darken-1" text @click="dialog = false">Salva</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>

            <Footer />
        </main>
    </v-app>
</template>

<script>
    import Menu from '../components/Menu';
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import itLocale from '@fullcalendar/core/locales/it';
    import interactionPlugin from '@fullcalendar/interaction';
    import Footer from "@/components/Footer";

    export default {
        name: "Homepage",
        components: {
            Menu,
            FullCalendar,
            Footer
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
                formType: "",
                holidaysCount: 2,
                permissionsCount: 6,
                sicknessCount: 2
            }
        },
        computed: {
            fromDateDisp() {
                return this.fromDateVal;
                // format date, apply validations, etc. Example below.
                // return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
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
                        if (this.camelize(elem) === 'permesso') {
                            this.formType = 'permesso';
                        }
                    } else {
                        const otherKey = Object.keys(this.buttons[i])[0];
                        this.buttons[i][otherKey].outlined = true;
                    }
                }
            },
            isMobile() {
                let check = false;
                (function (a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            }
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