<template>
    <div class="progress-bar" ref="progressBar" @click="_progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="_progressTouchStart"
            @touchmove.prevent="_progressTouchMove"
            @touchend="_progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
const progressBallWidth = 16;

import { prefixStyle } from "common/js/dom";
const transform = prefixStyle("transform");

export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    watch: {
        percent(newPercent) {
            if (newPercent >= 0&&!this.touch.initiated) {
                const barWidth =
                    this.$refs.progressBar.clientWidth - progressBallWidth;
                const offsetWidth = newPercent * barWidth;
                this._offset(offsetWidth);
            }
        }
    },
    created() {
        this.touch = {};    //这个对象用于存储拖动进度条时的信息
    },  
    methods: {
        _progressTouchStart(e) {
            this.touch.initiated = true;    //拖动标志位，是否已经开始拖动
            this.touch.startX = e.touches[0].pageX;     //开始时的X坐标
            this.touch.left = this.$refs.progress.clientWidth;      //开始时进度条宽度
        },
        _progressTouchMove(e) {
            if (!this.touch.initiated) {
                return;
            }
            const deltaX = e.touches[0].pageX - this.touch.startX;      //滑动的距离
            const offsetWidth = Math.min(       //总的距离小于进度条总宽度
                this.$refs.progressBar.clientWidth,
                Math.max(0, this.touch.left + deltaX)       //滑动距离加起始位置，大于0
            );
            this._offset(offsetWidth);      //设置进度条位置和小球位置
        },
        _progressTouchEnd(e) {
            this.touch.initiated = false;
            this._tirggerPercent()
        },
        _progressClick(e){
            this._offset(e.offsetX)
            this._tirggerPercent()
        },
        //将时间派发到父组件
        _tirggerPercent(){
            //获得拖动比例
            const barWidth = this.$refs.progressBar.clientWidth - progressBallWidth;
            const percent =this.$refs.progress.clientWidth/barWidth
            //将时间派发到父组件
            this.$emit('percentChange',percent)
        },
        _offset(offsetWidth) {
            this.$refs.progress.style.width = `${offsetWidth}px`;
            this.$refs.progressBtn.style[
                transform
            ] = `translate3d(${offsetWidth}px,0,0)`;
        }
    }
};
</script>


<style lang="scss" scoped>
@import "common/scss/variable.scss";
.progress-bar {
    height: 30px;
    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);
        .progress {
            position: absolute;
            height: 100%;
            background: $color-theme;
        }
        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid $color-theme;
                border-radius: 50%;
                background: $color-theme;
            }
        }
    }
}
</style>
