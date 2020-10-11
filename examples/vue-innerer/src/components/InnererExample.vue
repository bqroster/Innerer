<template>
    <div id="innererWrapper" class="innerer-wrapper">
        <span>[Entering within viewport from bottom or top]</span>
        <div
            data-innerer="entering"
            :class="{
              'with-inner': true,
              'opacity-0': !isVisible('entering'),
              'opacity-1': isVisible('entering')
            }"
                style="background-image: url(https://images.unsplash.com/photo-1602253057119-44d745d9b860?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2126&q=80);"
        ></div>

        <span>[Viewport Centered]</span>
        <div
            data-innerer="viewportCentered"
            :class="{
              'with-inner': true,
              'opacity-0': !isVisible('viewportCentered'),
              'opacity-1': isVisible('viewportCentered')
            }"
            class="with-inner" style="background-image: url(https://images.unsplash.com/photo-1602175518078-f6fc89dabdc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1491&q=80);"
        ></div>

        <span>[Above Viewport Center]</span>
        <div
            data-innerer="aboveViewportCenter"
            :class="{
              'with-inner': true,
              'opacity-0': !isVisible('aboveViewportCenter'),
              'opacity-1': isVisible('aboveViewportCenter')
            }"
            style="background-image: url(https://images.unsplash.com/photo-1602248349750-bc4d97d4c599?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80);"
        ></div>

        <span>[Entering within viewport from top]</span>
        <div
            data-innerer="enteringFromTop"
            :class="{
              'with-inner': true,
              'opacity-0': !isVisible('enteringFromTop'),
              'opacity-1': isVisible('enteringFromTop')
            }"
            style="background-image: url(https://images.unsplash.com/photo-1602256373943-f8bb357d6ebb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80);"
        ></div>

        <span>[Centered in Scroll Up]</span>
        <div
            data-innerer="centeredScrollUp"
            :class="{
              'with-inner': true,
              'opacity-0': !isVisible('centeredScrollUp'),
              'opacity-1': isVisible('centeredScrollUp')
            }"
            style="background-image: url(https://images.unsplash.com/photo-1602327535250-cb0b6ff77a97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1374&q=80);"
        ></div>
    </div>
</template>

<script>

    import {
        createInners,
        BELOW_CENTER,
        ABOVE_CENTER,
        DIRECTION_DW,
        DIRECTION_UP
    } from "innerer";

    export default {
        data() {
            return {
                innerers: {
                    entering: false,
                    enteringFromTop: false,
                    viewportCentered: false,
                    aboveViewportCenter: false,
                    centeredScrollUp: false
                }
            }
        },
        created() {
            createInners(this.innererTags, "#innererWrapper");
        },
        computed: {
            isVisible() {
                /**
                 * @param {string} tagName
                 * @return bool
                 */
                return (tagName) => {
                    return (this.innerers[tagName] === true);
                }
            }
        },
        methods: {
            /**
             * @param {string} tag
             * @param {boolean} value
             */
            setInnerTag(tag, value = true) {
                this.innerers[tag] = value;
            },


            innererTags({ tag, direction, position, centered }) {
                if (tag === 'entering') {
                    if (
                        this.innerers[tag] === false &&
                        (
                            (direction === DIRECTION_DW && position.percentageInPosition < 1) ||
                            (direction === DIRECTION_UP && position.percentageOutside === 0)
                        )
                    ) {
                        this.setInnerTag(tag);
                    }
                    else if (position.percentageOutside > 0) {
                        this.setInnerTag(tag, false);
                    }
                }
                else if (tag === 'enteringFromTop') {
                    if (
                        this.innerers[tag] === false &&
                        (direction === DIRECTION_UP && position.percentageOutside === 0 && position.percentageInPosition <= 0.2)
                    ) {
                        this.setInnerTag(tag);
                    }
                }
                else if (tag === 'viewportCentered') {
                    if (
                        this.innerers[tag] === false &&
                        direction === DIRECTION_DW &&
                        (
                            (centered.status === BELOW_CENTER && centered.percentage >= 0.99) ||
                            (centered.status === ABOVE_CENTER && centered.percentage <= 1)
                        )
                    ) {
                        this.setInnerTag(tag);
                    }
                }
                else if (tag === 'aboveViewportCenter') {
                    if (
                        this.innerers[tag] === false &&
                        direction === DIRECTION_DW &&
                        (
                            (centered.status === ABOVE_CENTER && centered.percentage <= 0.45)
                        )
                    ) {
                        this.setInnerTag(tag);
                    }
                }
                else if (tag === 'centeredScrollUp') {
                    if (
                        this.innerers[tag] === false &&
                        direction === DIRECTION_UP &&
                        (centered.status === BELOW_CENTER && centered.percentage <= 1)
                    ) {
                        this.setInnerTag(tag);
                    }
                }
            }
        }
    }
</script>


<style>
    .innerer-wrapper span {
        margin-top: 32px;
        font-weight: 700;
        font-size: 14px;
    }

    .innerer-wrapper .with-inner {
        width: auto;
        height: 320px;
        background-size: cover;
        background-position: 50% 50%;
        margin: 0 16px 32px;
        border-radius: 4px;
        transition: opacity 800ms ease-in-out;
    }

    .innerer-wrapper .opacity-0 {
        opacity: 0;
    }

    .innerer-wrapper .opacity-1 {
        opacity: 1;
    }
</style>