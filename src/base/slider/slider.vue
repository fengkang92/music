<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" :class="{active:currentpageIndex===index}" v-for="(item,index) in dots" :key="item"></span>
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom";

export default {
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        }
    },
    data() {
        return {
            dots: [],
            currentpageIndex: 0
        };
    },
    mounted() {
        setTimeout(() => {
            this._setSliderWidth();
            this._initDots();
            this._initSlider();
            if (this.autoPlay) {
                this._autoPlay();
            }
        }, 20);

        window.addEventListener("resize", () => {
            if (!this.slider) {
                return;
            }
            this._setSliderWidth(true);
        });
    },
    methods: {
        _setSliderWidth(isResize) {
            let children = this.$refs.sliderGroup.children;
            let width = 0;
            let sliderWidth = this.$refs.slider.clientWidth;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                addClass(child, "slider-item");
                child.style.width = sliderWidth + "px";
                width += sliderWidth;
            }

            if (this.loop && !isResize) {
                width += 2 * sliderWidth;
            }
            this.$refs.sliderGroup.style.width = width + "px";
        },
        _initDots() {
            let children = this.$refs.sliderGroup.children;
            this.dots = new Array(children.length);
        },
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapLoop: true,
                snapThredhold: 0.3,
                snapSpeed: 400
            });

            this.slider.on("scrollEnd", () => {
                let pageIndex = this.slider.getCurrentPage().pageX;
                if (this.loop) {
                    pageIndex -= 1;
                }
                this.currentpageIndex = pageIndex;
                if (this.autoPlay) {
                    clearTimeout(this.timer);
                    this._autoPlay();
                }
            });
        },
        _autoPlay() {
            let pageIndex = this.currentpageIndex + 1;
            if (this.loop) {
                pageIndex += 1;
            }
            this.timer = setTimeout(() => {
                this.slider.goToPage(pageIndex, 0, 400);
            }, this.interval);
        }
    },
    destroyed() {
        clearTimeout(this.timer);
    }
};
</script>
<style lang="scss" scoped>
@import "common/scss/variable.scss";
.slider {
    min-height: 1px;
    position: relative;
    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
            img {
                display: block;
                width: 100%;
            }
        }
    }
    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        // font-size: 0;
        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
                // width: 10px;
                border-radius: 5px;
                background: $color-highlight-background;
            }
        }
    }
}
</style>
