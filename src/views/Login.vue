<template>
    <div id="app">
        <v-app>
            <div class="container">
                <v-alert v-if="isAlertOpened"
                         dense
                         text
                         dismissible
                         transition="scale-transition"
                         type="success"
                >
                   Utenza creata con successo. Ora puoi effettuare la <strong>login</strong>.
                </v-alert>
            </div>

            <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px" :hide-overlay="true">
                <div>
                    <v-tabs v-model="tab" show-arrows background-color="yellow darken-1" icons-and-text dark grow>
                        <v-tabs-slider color="yellow darken-3"></v-tabs-slider>
                        <v-tab>
                            <i class="material-icons-two-tone">account_circle</i>
                            <div class="caption py-1" style="color: black; font-weight: bold">Login</div>
                        </v-tab>
                        <v-tab>
                            <i class="material-icons-two-tone">person_add</i>
                            <div class="caption py-1" style="color: black; font-weight: bold">Registrati</div>
                        </v-tab>
                        <!-- Login tab -->
                        <v-tab-item>
                            <v-card class="px-4">
                                <v-card-text>
                                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                                        <v-row align="center" justify="center">
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" v-model="loginEmail"
                                                              :rules="rules.emailRules" label="E-mail"
                                                              required></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" v-model="loginPassword"
                                                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                              :rules="[rules.required]" :type="'password'"
                                                              name="input-10-1" label="Password"
                                                              hint="At least 8 characters" counter
                                                              @click:append="show1 = !show1"></v-text-field>
                                            </v-col>

                                            <v-col cols="4">
                                                <v-btn class="pa-2" x-large block :disabled="!valid" color="success"
                                                       @click="validate"> Login
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <!-- Registration tab -->
                        <v-tab-item>
                            <v-card class="px-4">
                                <v-card-text>
                                    <v-form ref="registerForm" v-model="valid" lazy-validation>
                                        <v-row align="center" justify="center">
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="firstName" :rules="[rules.required]"
                                                              label="Nome" maxlength="35" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="lastName" :rules="[rules.required]"
                                                              label="Cognome" maxlength="25" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" v-model="email"
                                                              :rules="rules.emailRules" label="E-mail"
                                                              required></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" v-model="password"
                                                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                              :rules="[rules.required, rules.min]"
                                                              :type="'password'" name="input-10-1"
                                                              label="Password" hint="Almeno 8 caratteri" counter
                                                              @click:append="show1 = !show1"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" block v-model="verify"
                                                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                              :rules="[rules.required, passwordMatch]"
                                                              :type="'password'" name="input-10-1"
                                                              label="Conferma la password" counter
                                                              @click:append="show1 = !show1"></v-text-field>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col cols="4">
                                                <v-btn class="pa-2" x-large block :disabled="!valid" color="success" :loading="buttonLoading"
                                                       @click="validate"> Registrati
                                                </v-btn>
                                            </v-col>

                                        </v-row>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </div>
            </v-dialog>
        </v-app>
    </div>
</template>

<script>
    import firebase from 'firebase';

    export default {
        name: "Login",
        data() {
            return {
                buttonLoading: false,
                dialog: true,
                tab: 0,
                valid: true,
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                verify: "",
                loginPassword: "",
                loginEmail: "",
                isAlertOpened: false,
                rules: {
                    emailRules: [
                        v => !!v || "Il campo è obbligatorio",
                        v => /.+@.+\..+/.test(v) || "L'e-mail non è valida"
                    ],
                    required: value => !!value || "Il campo è obbligatorio",
                    min: v => (v && v.length >= 8) || "Almeno 8 charatteri"
                },
                show1: false,
            }
        },
        computed: {
            passwordMatch() {
                return () => this.password === this.verify || "Le password non sono uguali";
            }
        },
        watch: {
            isAlertOpened: function (val) {
                console.log(val)
                if (val) {
                    setTimeout(() => {
                        this.isAlertOpened = false;
                    }, 5000);
                }
            }
        },
        methods: {
            validate() {
                if (this.$refs.registerForm.validate()) {
                    this.buttonLoading = true;
                    this.createNewUserAuthentication();
                }
            },
            reset() {
                this.$refs.form.reset();
            },
            resetValidation() {
                this.$refs.form.resetValidation();
            },
            createNewUserAuthentication: function () {
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((result) => {
                    this.buttonLoading = false;
                    this.isAlertOpened = true;
                })
            }
        }
    }
</script>
<style scoped>
</style>