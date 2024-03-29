<template>
    <v-app id="app">
        <Menu/>
        <main id="page-wrap">
            <v-container style="margin-top: 60px">
                <v-snackbar v-model="isAlertOpened"
                            :right="true"
                            :top="true"
                            :timeout="6000"
                            color="success"
                            :multi-line="true"
                > Richiesta inviata con successo. Attendi l'accettazione da parte del tuo referente.
                    <v-btn color="white" text @click="isAlertOpened = false"> Chiudi</v-btn>
                </v-snackbar>
                <v-row>
                    <FullCalendar
                            defaultView="dayGridMonth"
                            :plugins="calendarPlugins"
                            :locale="locale"
                            :showNonCurrentDates="false"
                            @dateClick="handleDateClick"
                            @eventClick="handleEventClick"
                            :day-render="setNationalHolidays"
                            :events="events"
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
                                           disabled="attribute.disable"
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
                                               :disabled="attribute.disable"
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
                                        <span v-if="holidaysCount == 1"> giorno</span>
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
                                        <span v-if="sicknessCount == 1"> giorno</span>
                                        <span v-else> giorni</span>
                                        <span> di malattia
                                            <span v-if="sicknessCount == 1">dichiarato</span>
                                            <span v-else>dichiarati</span>
                                        </span>
                                    </span>
                                    <v-icon right>mdi-hospital-building</v-icon>
                                </v-chip>
                            </v-row>

                            <div :hidden="showPermissionForm">
                                <v-row justify="space-around" align="center">
                                    <v-col style="width: 290px; flex: 0 1 auto;">
                                        <h2>Dalle</h2>
                                        <v-time-picker v-model="timePicker.start" :max="timePicker.end" format="24hr"
                                                       :allowed-minutes="allowedMinutes"></v-time-picker>
                                    </v-col>
                                    <v-col style="width: 290px; flex: 0 1 auto;">
                                        <h2>Alle</h2>
                                        <v-time-picker v-model="timePicker.end" :min="timePicker.start" format="24hr"
                                                       :allowed-minutes="allowedMinutes"></v-time-picker>
                                    </v-col>
                                </v-row>
                            </div>

                            <small>
                                * Tutte le richieste prima di essere confermate, dovranno essere accettate dal tuo
                                referente.
                            </small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn outlined color="success" @click="saveEvent" :disabled="successButton"
                                   :loading="loadingButton">
                                Salva
                            </v-btn>
                            <v-btn outlined color="error" @click="dialog = false">
                                Annulla
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>

            <Footer/>
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
    import firebase from 'firebase';

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
                fromDateRequest: "",
                outlinedButton: true,
                buttons: [
                    {
                        ferie: {
                            color: "#cd409a",
                            ref: "ferie",
                            outlined: true,
                            disable: false,
                        }
                    },
                    {
                        permesso: {
                            color: "#febd13",
                            ref: "permesso",
                            outlined: true,
                            disable: false,
                        }
                    },
                    {
                        malattia: {
                            color: "#a455bc",
                            ref: "malattia",
                            outlined: true,
                            disable: false,
                        }
                    },
                    {
                        smartWorking: {
                            color: "#fa8558",
                            ref: "smart working",
                            outlined: true,
                            disable: false,
                        }
                    },
                    {
                        congedoMatrimoniale: {
                            color: "#f25979",
                            ref: "congedo matrimoniale",
                            outlined: true,
                            disable: false,
                        }
                    },
                    {
                        maternità: {
                            color: "#1876d2",
                            ref: "maternità",
                            outlined: true,
                            disable: false,
                        }
                    }
                ],
                eventType: "",
                showPermissionForm: true,
                holidaysCount: 0,
                permissionsCount: 0,
                sicknessCount: 0,
                smartWorkingCount: 0,
                maternityCount: 0,
                leaveCount: 0, //congedo
                events: [],
                nationalHolidays: ['0-1', '0-6', '3-25', '4-1', '5-2', '7-15', '10-1', '11-8', '11-25', '11-26'],
                successButton: true,
                timePicker: {
                    start: null,
                    end: null,
                },
                loadingButton: false,
                isAlertOpened: false,
            }
        },
        watch: {
            timePicker: {
                handler: function (val) {
                    if (val.end !== null) {
                        this.successButton = false; // enable send button
                    }
                },
                deep: true
            },
            isAlertOpened: function (val) {
                if (val) {
                    setTimeout(() => {
                        this.isAlertOpened = false;
                    }, 5000);
                }
            },
        },
        beforeMount() {
            this.getAllEvents();
        },
        methods: {
            handleDateClick(arg) {
                this.requestData = this.formatDateToItalianDate(arg.dateStr);
                this.fromDateRequest = arg.dateStr;
                this.dialog = true;

                // check events existing
                for (let i = 0; this.events.length > i; i++) {
                    if (this.events[i].start === arg.dateStr) {
                        this.toggleButtons(this.events[i].type, true);
                        return;
                    } else this.toggleButtons(this.events[i].type, false);
                }
            },
            handleEventClick(event) {
                console.log(event)
            },
            saveEvent() {
                this.loadingButton = true;
                const events = firebase.firestore().collection('events');

                events.add(this.getEventObjectFirestore()).then((docRef) => {
                    const eventObject = this.getEventObject(docRef.id)
                    this.events.push(eventObject);

                    this.loadingButton = false;
                    this.dialog = false;
                    this.isAlertOpened = true;
                }).catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            },
            setNationalHolidays(dayRenderInfo) {
                const date = dayRenderInfo.date.getMonth() + "-" + dayRenderInfo.date.getDate()

                if (this.nationalHolidays.includes(date)) {
                    dayRenderInfo.el.setAttribute("style", "background-color: rgba(255, 0, 0, 0.15)")
                }
            },
            getAllEvents() {
                const events = firebase.firestore().collection('events');
                events.where("uid", "==", firebase.auth().currentUser.uid).get().then((documents) => {
                    this.constructEventsArray(documents);
                })
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
                        this.eventType = this.camelize(elem);
                    } else {
                        const otherKey = Object.keys(this.buttons[i])[0];
                        this.buttons[i][otherKey].outlined = true;
                    }
                }

                if (this.eventType === 'permesso') {
                    this.successButton = true; // disable send button
                    this.showPermissionForm = false;
                } else {
                    this.successButton = false; // enable send button
                    this.showPermissionForm = true;
                }
            },
            toggleButtons(eventType, state) {
                const buttons = this.buttons;
                for (let i = 0; buttons.length > i; i++) {
                    if (buttons[i][this.camelize(eventType)] !== undefined) {
                        buttons[i][this.camelize(eventType)].disable = state;
                    } else {
                        const otherKey = Object.keys(this.buttons[i])[0];
                        buttons[i][otherKey].disable = state;
                    }
                }
            },
            isMobile() {
                let check = false;
                (function (a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            },
            allowedMinutes: v => v % 5 === 0,
            getEventObject(eventId) {
                const event = this.getEventFromEventType(false, this.eventType);

                return {
                    id: eventId,
                    title: event.title,
                    backgroundColor: event.backgroundColor,
                    borderColor: event.borderColor,
                    textColor: 'black',
                    start: this.fromDateRequest,
                    type: this.eventType,
                }
            },
            getEventObjectFirestore() {
                return {
                    fromDate: this.fromDateRequest,
                    toDate: "",
                    fromHour: this.timePicker.start,
                    toHour: this.timePicker.end,
                    type: this.eventType,
                    uid: firebase.auth().currentUser.uid,
                    approved: false,
                    createdAt: new Date().toLocaleString()
                }
            },
            constructEventsArray(documents) {
                documents.docs.forEach((doc) => {
                    const eventType = doc.data().type;
                    const approvedEvent = doc.data().approved;

                    this.incrementSnackbarCounter(eventType, approvedEvent)

                    const event = this.getEventFromEventType(true, eventType, approvedEvent);
                    const eventObject = {
                        id: doc.id,
                        title: event.title,
                        backgroundColor: event.backgroundColor,
                        borderColor: event.borderColor,
                        textColor: event.textColor,
                        start: doc.data().fromDate,
                        type: eventType,
                    };

                    this.events.push(eventObject)
                });
            },
            getEventFromEventType(fullColor = false, eventType, approved = false) {
                let backgroundColor = '';
                let borderColor = '';
                let title = '';
                const condition = fullColor && approved;

                const textColor = condition ? 'white' : 'black';


                switch (eventType) {
                    case 'ferie':
                        backgroundColor = condition ? 'rgba(205,64,154)' : 'rgba(205,64,154,0.20)';
                        borderColor = condition ? 'rgba(205,64,154)' : 'rgba(205,64,154,0.20)';
                        title = "Ferie";
                        break;
                    case 'permesso':
                        backgroundColor = condition ? 'rgba(254,189,19)' : 'rgba(254,189,19,0.20)';
                        borderColor = condition ? 'rgba(254,189,19)' : 'rgba(254,189,19,0.20)';
                        title = "Permesso";
                        break;
                    case 'malattia':
                        backgroundColor = condition ? 'rgb(164,85,188)' : 'rgb(164,85,188, 0.20)';
                        borderColor = condition ? 'rgb(164,85,188)' : 'rgb(164,85,188, 0.20)';
                        title = "Malattia";
                        break;
                    case 'smartWorking':
                        backgroundColor = condition ? 'rgb(250,133,88)' : 'rgb(250,133,88,0.20)';
                        borderColor = condition ? 'rgb(250,133,88)' : 'rgb(250,133,88,0.20)';
                        title = "Smart Working";
                        break;
                    case 'congedoMatrimoniale':
                        backgroundColor = condition ? 'rgb(242,89,121)' : 'rgb(242,89,121,0.20)';
                        borderColor = condition ? 'rgb(242,89,121)' : 'rgb(242,89,121,0.20)';
                        title = "Congedo Matrimoniale";
                        break;
                    case 'maternità':
                        backgroundColor = condition ? 'rgb(24,118,210)' : 'rgb(24,118,210,0.20)';
                        borderColor = condition ? 'rgb(24,118,210)' : 'rgb(24,118,210,0.20)';
                        title = "Maternità";
                        break;
                }

                return {
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    title: title,
                    textColor: textColor
                }
            },
            incrementSnackbarCounter(eventType, approved) {
                if (eventType === "ferie" && approved) {
                    this.holidaysCount++;
                } else if (eventType === "permesso" && approved) {
                    this.permissionsCount++;
                } else if (eventType === "malattia" && approved) {
                    this.sicknessCount++;
                } else if (eventType === "smartWorking" && approved) {
                    this.smartWorkingCount++;
                } else if (eventType === "congedoMatrimoniale" && approved) {
                    this.leaveCount++;
                } else if (eventType === "maternità" && approved) {
                    this.maternityCount++;
                }
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