<template>
    <div class="player" v-show="playlist.length>0">
        <transition name="full">
            <!-- @enter="enter" 
            @after-enter="afterEnter" 
            @leave="leave" 
            @after-leave="afterLeave" -->
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" width='100%' height="100%" alt="">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back" width="40" height="40"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdClass">
                                <img class="image" :src="currentSong.image" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{_formatTime(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar @percentChange="_onProgressBarChange" :percent="percent"></progress-bar>
                        </div>
                        <span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="_changMode" :class="disableCls">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i @click="_prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i @click="_togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i @click="_next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="min-player" @click="open" v-show="!fullScreen">
                <div class="icon">
                    <img width="40" height="40" :src="currentSong.image" alt="">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">

                    <progress-circle :radius="32" :percent="percent">
                        <i class="icon-mini" :class="miniIcon" @click.stop="_togglePlaying"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>

        <audio :src="currentSong.url" @timeupdate="_updataTime" @ended="_end" @canplay="_ready" @error="_error" ref="audio"></audio>
        <!-- <audio :src="Testurl" @timeupdate="_updataTime" @canplay="_ready" @error="_error" ref="audio"></audio> -->

    </div>
</template>


<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";
import { playMode } from "common/js/config";

import ProgressBar from "base/progress/progress";
import ProgressCircle from "base/progress/progress-circle";

import { shuffle } from "common/js/utl";
// import { getSongUrlPrev } from "api/singer";

const transform = prefixStyle("transform");

export default {
    data() {
        return {
            songReady: false,
            currentTime: 0,
            Testurl:
                "http://123.113.198.1:8081/IXC006ab04ee3978eda80e399e4628774f8_210.12.125.246/C400001XM2rX0SfnNE.m4a?vkey=2A7B4DDADBF9CBE105C3EF4C6A6D36E2F2BC9769C37E3FC3DC22475295C9B6C61F04AFE8A4172FBFB59FFF442D90BA31C9D3A2DE6AED12C3&guid=6347090065&uin=0&fromtag=66"
        };
    },
    computed: {
        cdClass() {
            return this.playing ? "play" : "play pause";
        },
        playIcon() {
            return this.playing ? "icon-pause" : "icon-play";
        },
        miniIcon() {
            return this.playing
                ? "icon-mini icon-pause-mini"
                : "icon-mini icon-play-mini";
        },
        disableCls() {
            return this.songReady ? "" : "disable";
        },
        percent() {
            return this.currentTime / this.currentSong.duration;
        },
        //播放模式图标
        iconMode() {
            return this.mode === playMode.sequence
                ? "icon-sequence"
                : this.mode === playMode.loop ? "icon-loop" : "icon-random";
        },

        ...mapGetters([
            "fullScreen",
            "playlist",
            "currentSong",
            "playing",
            "currentIndex",
            "mode",
            "sequenceList"
        ])
    },
    methods: {
        back() {
            this.setFullScreen(false);
        },
        open() {
            this.setFullScreen(true);
        },
        //动画
        enter(el, done) {
            const { x, y, scale } = this._getPosAndScale();

            let animation = {
                0: {
                    transfrom: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transfrom: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transfrom: `translate3d(0,0,0) scale(1)`
                }
            };
            window.localStorage.setItem()

            animations.registerAnimation({
                name: "move",
                animation,
                presets: {
                    duration: 400,
                    easing: "linear"
                }
            });

            animations.runAnimation(this.$refs.cdWrapper, "move", done);
        },
        afterEnter() {
            animations.unregisterAnimation("move");
            this.$refs.cdWrapper.style.animation = "";
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = `all 0.4s`;
            const { x, y, scale } = this._getPosAndScale();
            this.$refs.cdWrapper.style[
                transform
            ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
            this.$refs.cdWrapper.addEventListener("transitionend", done);
        },
        afterLeave() {
            this.$refs.cdWrapper.style[transform] = "";
            this.$refs.cdWrapper.style.transition = "";
        },
        _getPosAndScale() {
            const targetWidth = 40;
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 80;

            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width;
            const x = -(window.innerWidth / 2 - paddingLeft);
            const y =
                window.innerHeight - paddingTop - width / 2 - paddingBottom;

            return {
                x,
                y,
                scale
            };
        },
        //播放暂停
        _togglePlaying() {
            // if (!this.songReady) {
            //     return;
            // }
            this.setPlayingState(!this.playing);
            this.songReady = false;
        },
        //播放完成，下一曲
        _end() {
            console.log(this.mode);
            if (this.mode === playMode.loop) {
                this._loop();
            } else {
                this._next();
            }
        },
        //下一曲
        _next() {
            if (!this.songReady) {
                return;
            }
            let index = this.currentIndex + 1;
            if (index == this.playlist.length) {
                index = 0;
            }
            this.setCurrentIndex(index);
            if (!this.playing) {
                this._togglePlaying();
            }
            this.songReady = false;
        },
        //单曲循环
        _loop() {
            this.$refs.audio.currentTime = 0;
            this.$refs.audio.play();
        },
        _prev() {
            if (!this.songReady) {
                return;
            }
            let index = this.currentIndex - 1;
            if (index == -1) {
                index = this.playlist.length;
            }
            this.setCurrentIndex(index);
            if (!this.playing) {
                this._togglePlaying();
            }
            this.songReady = false;
        },
        _ready() {
            this.songReady = true;
        },
        _error(err) {
            this.songReady = true;
        },
        //更新时间
        _updataTime(event) {
            this.currentTime = event.target.currentTime;
        },
        //格式化时间
        _formatTime(interval) {
            interval = interval | 0;
            const minute = (interval / 60) | 0;
            let second = interval % 60;
            if (second < 10) {
                second = "0" + second;
            }
            return `${minute}：${second}`;
        },
        //子组件传过来的进度条拖动事件
        _onProgressBarChange(percent) {
            this.$refs.audio.currentTime = this.currentSong.duration * percent;
            if (!this.playing) {
                this._togglePlaying();
            }
        },
        //切换播放模式  设置播放列表
        _changMode() {
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequence);
            } else {
                list = this.sequence;
            }
            this._resetCurrentIndex(list);
            this.setPlayList(list);
        },
        //切换模式后重置currentIndex
        // 改变播放模式时当前播放歌曲索引发生变化，需要重设索引防止播放列表不可控制
        _resetCurrentIndex(list) {
            // findIndex是es6的数组方法，返回数组中满足条件的第一个元素的索引
            let stayIndex = list.findIndex(item => {
                return item.id === this.currentSong.id;
            });
            this.setCurrentIndex(stayIndex);
        },

        ...mapMutations({
            setFullScreen: "SET_FULL_SCREEN",
            setPlayingState: "SET_PLAYING_STATE",
            setCurrentIndex: "SET_CURRENT_INDEX",
            setPlayMode: "SET_PLAY_MODE",
            setPlayList: "SET_PLAY_List"
        })
    },
    created() {},
    watch: {
        currentSong(newSong, oldSong) {
            if (newSong.id === oldSong.id) {
                return;
            }
            this.$nextTick(() => {
                this.$refs.audio.play();
            });
        },
        playing(newPlaying) {
            const audio = this.$refs.audio;
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause();
            });
        }
    },
    components: {
        ProgressBar,
        ProgressCircle
    }
};
</script>


<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";
.player {
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;
        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            z-index: -1;
            opacity: 0.3;
            filter: blur(15px);
        }
        .top {
            position: relative;
            margin-bottom: 25px;
            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
                transform: rotate(-90deg);
                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: $font-size-large;
                    color: $color-text;
                }
            }
            .detail {
                position: absolute;
                top: 0;
                right: 6px;
                z-index: 150;
                .icon-share {
                    display: block;
                    padding: 10px;
                    font-size: $font-size-large;
                    color: $color-text;
                }
            }
            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                font-size: $font-size-large;
                color: $color-text;
                overflow: hidden;
                white-space: nowrap;
            }
            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-text;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(0, 0, 0, 0.1);
                        border-radius: 50%;
                        &.play {
                            animation: rotate 20s linear infinite;
                        }
                        &.pause {
                            animation-play-state: paused;
                        }
                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: $font-size-medium;
                        color: $color-text;
                    }
                }
            }
            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text {
                        line-height: 32px;
                        color: $color-text;
                        font-size: $font-size-medium;
                        &.current {
                            color: $color-theme;
                        }
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;
            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0px auto;
                padding: 10px 0;
                .time {
                    color: $color-theme;
                    font-size: $font-size-small;
                    flex: 0 0 40px;
                    line-height: 30px;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                .progress-bar-wrapper {
                    flex: 1;
                    margin: 0 5px;
                }
            }
            .dot-wrapper {
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: $color-text;
                    &.active {
                        width: 20px;
                        border-radius: 5px;
                        background: $color-background;
                    }
                }
            }
            .operators {
                display: flex;
                align-items: center;
                .icon {
                    flex: 1;
                    color: $color-theme;
                    &.disable {
                        color: $color-theme;
                    }
                    i {
                        font-size: 30px;
                    }
                }
                .i-left {
                    text-align: right;
                }
                .i-center {
                    padding: 0 20px;
                    text-align: center;
                    i {
                        font-size: 40px;
                    }
                }
                .i-right {
                    text-align: left;
                }
                .icon-bofangqi_shouyegequliebiao_ {
                    color: $color-theme;
                    font-size: 40px !important;
                }
            }
        }
        &.full-enter-active,
        &.full-leave-active {
            transition: all 0.4s;
            .top,
            .bottom {
                transition: all 0.4s cubic-bezier(0.6, 0.35, 0.4, 1.26);
            }
            .middle {
                .middle-l {
                    transition: all 0.4s cubic-bezier(0.6, 0.35, 0.4, 1.26);
                }
            }
        }
        &.full-enter,
        &.full-leave-to {
            opacity: 0;
            .top {
                transform: translate3d(0, -100px, 0);
            }
            .bottom {
                transform: translate3d(0, 100px, 0);
            }
            .middle {
                .middle-l {
                    transform: translate3d(100%, 0, 0);
                }
            }
        }
    }
    .min-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: $color-theme-g;
        &.mini-enter-active,
        &.mini-leave-active {
            transition: all 0.4s;
        }
        &.mini-enter,
        &.mini-leave-to {
            opacity: 0;
        }
        .icon {
            flex: 0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;
            .img {
                border-radius: 50%;
                position: absolute;
                top: 4px;
                left: 4px;
                &.play {
                    animation: rotate 10s linear infinite;
                }

                &.pause {
                    animation-play-state: paused;
                }
            }
        }
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name {
                margin-bottom: 2px;
                font-size: $font-size-medium;
                color: $color-text;
                overflow: hidden;
                white-space: nowrap;
            }
            .desc {
                font-size: $font-size-small;
                color: $color-text;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .control {
            flex: 0 0 30px;
            padding: 0 10px;
            .icon-play,
            .icon-pause,
            .icon-xihuan,
            .icon-loveList {
                display: inline-block;
                font-size: 32px;
                width: 32px;
                height: 32px;
                color: $color-theme;
                z-index: -10;
            }
            .icon-xihuan {
                color: $color-theme;
                margin-bottom: 6px;
            }
            .icon-loveList {
                color: red;
                margin-bottom: 6px;
            }
            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0px;
                top: 0px;
            }
        }
    }
}
@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
