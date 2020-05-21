<template>
    <div>
        <Slide>
            <a id="home" href="#">
                <span>
                    <span class="material-icons-two-tone md-light"> home </span> Home</span>
            </a>
        </Slide>
    </div>
</template>

<script>
    import {Slide} from 'vue-burger-menu'

    export default {
        name: "Menu",
        components: {
            Slide
        },
        data() {
            return {
            }
        },
        methods: {
        }
    }
</script>

<style>
    body {
        font-family: 'Roboto', 'sans-serif';
    }

    /* Rules for using icons as white on a dark background. */
    .material-icons-two-tone.md-light { color: rgba(255, 255, 255, 1); }
</style>