<template>
    <div class="progress-circle">
        <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent" />
            <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent" :stroke-dashoffset="dashOffset" :stroke-dasharray="dashArray" />
        </svg>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        radius: {
            type: Number,
            default: 100
        },
        percent: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            dashArray: Math.PI * 100
        };
    },
    computed: {
        dashOffset() {
            return (1 - this.percent) * this.dashArray;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";

.progress-circle {
    position: relative;
    circle {
        stroke-width: 8px;
        transform-origin: center;
        &.progress-bar {
            transform: scale(0.9) rotate(-90deg);
            stroke: $color-theme;
        }
    }
}
</style>
