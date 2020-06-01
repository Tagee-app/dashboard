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

            <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px" :hide-overlay="true"
                      no-click-animation>
                <div>
                    <v-tabs v-model="tab" show-arrows background-color="#fa8558" icons-and-text dark grow>
                        <v-tabs-slider color="#febd13"></v-tabs-slider>
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
                                                              :error="emailError"
                                                              :error-messages="loginErrorMessage"
                                                              @input="resetValidation"
                                                              required></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" v-model="loginPassword"
                                                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                              :rules="[rules.required]"
                                                              name="input-10-1" label="Password"
                                                              hint="Almeno 8 charatteri" counter
                                                              :error="passwordError"
                                                              :error-messages="passwordErrorMessage"
                                                              @input="resetValidation"
                                                              :type="show1 ? 'text' : 'password'"
                                                              @click:append="show1 = !show1"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row align="center" justify="center">
                                            <v-col cols="3">
                                                <v-btn outlined class="pa-2" large block :disabled="!valid" color="success"
                                                       @click="validate(true)" :loading="buttonLoading"> Login
                                                </v-btn>
                                            </v-col>

                                            <v-divider class="ma-4" vertical></v-divider>

                                            <v-col cols="4">
                                                <v-btn class="pa-2" large color="#2984fc" outlined @click="socialLogin"
                                                       :loading="socialButtonLoading">
                                                    <v-img :max-width="25" src="../assets/login-google-icon.png"
                                                           style="margin-right: 5px"/>
                                                    <span style="color: #2984fc">Accedi con Google</span>
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
                                                              :type="show1 ? 'text' : 'password'" name="input-10-1"
                                                              label="Password" hint="Almeno 8 caratteri" counter
                                                              @click:append="show1 = !show1"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field autocomplete="new-password" block v-model="verify"
                                                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                              :rules="[rules.required, passwordMatch]"
                                                              :type="show1 ? 'text' : 'password'" name="input-10-1"
                                                              label="Conferma la password" counter
                                                              @click:append="show1 = !show1"></v-text-field>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col cols="4">
                                                <v-btn class="pa-2" x-large block :disabled="!valid" color="success"
                                                       :loading="buttonLoading"
                                                       outlined
                                                       @click="validate()"> Registrati
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
                socialButtonLoading: false,
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
                isErrorAlertOpened: false,
                loginErrorMessage: "",
                passwordErrorMessage: "",
                emailError: false,
                passwordError: false,
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
                if (val) {
                    setTimeout(() => {
                        this.isAlertOpened = false;
                    }, 5000);
                }
            },
            isErrorAlertOpened: function (val) {
                if (val) {
                    setTimeout(() => {
                        this.isErrorAlertOpened = false;
                    }, 5000);
                }
            }
        },
        methods: {
            validate(login = false) {
                if (!login && this.$refs.registerForm.validate()) {
                    this.buttonLoading = true;
                    this.createNewUserAuthentication();
                } else if (login && this.$refs.loginForm.validate()) {
                    this.login();
                }
            },
            createNewUserAuthentication() {
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((result) => {
                    firebase.firestore().collection('users').add({
                        uid: result.user.uid,
                        email: this.email,
                        firstName: this.firstName,
                        lastName: this.lastName
                    }).then(() => {
                        this.buttonLoading = false;
                        this.isAlertOpened = true;
                    }).catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }).catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            resetValidation() {
                if (this.emailError) {
                    this.loginErrorMessage = "";
                    this.emailError = false;
                }
                if (this.passwordError) {
                    this.passwordErrorMessage = "";
                    this.passwordError = false;
                }
            },
            login() {
                this.buttonLoading = true;
                firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword).then((result) => {
                    this.buttonLoading = false;
                    this.$router.push('homepage');
                }).catch((error) => {
                    this.buttonLoading = false;
                    const errorCode = error.code;

                    if (errorCode === 'auth/wrong-password') {
                        this.passwordErrorMessage = "Password errata"
                        this.passwordError = true;
                    }

                    if (errorCode === 'auth/user-not-found') {
                        this.loginErrorMessage = "Email errata"
                        this.emailError = true;
                    }
                });
            },
            socialLogin() {
                const provider = new firebase.auth.GoogleAuthProvider();
                this.socialButtonLoading = true;

                firebase.auth().signInWithPopup(provider).then((result) => {
                    if (result.additionalUserInfo.isNewUser) {
                        firebase.firestore().collection('users').add({
                            uid: result.user.uid,
                            email: result.user.email,
                            firstName: result.additionalUserInfo.profile.given_name,
                            lastName: result.additionalUserInfo.profile.family_name,
                            picture: result.additionalUserInfo.profile.picture,
                        }).then(() => {
                            this.buttonLoading = false;
                        }).catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                    }

                    this.buttonLoading = false;
                    this.$router.replace("homepage");
                }).catch((error) => {
                    this.buttonLoading = false;
                    const errorCode = error.code;

                    if (errorCode === 'auth/popup-closed-by-user') {
                        this.socialButtonLoading = false;
                    }
                });
            }
        }
    }
</script>
<style scoped>
</style>