<template>
  <div ref="wrapper">
    <!-- <div class="pulldown-loading" v-show="pulldown">
      <loading></loading>
    </div>-->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  props: {
    // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
    // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
    // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
    // 如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        dafault: []
      },
      listenScroll: {
        //默认不监听滚动事件
        type: Boolean,
        default: false
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      },
      //是否开启上拉加载更多
      pullMoreLoad: {
        type: null,
        default: false
      },
      beforeScrollStart: {
        type: null,
        default: false
      }
    },
    data() {
      return {
        beforePullDown: true,
        isPullingDown: false,
        isRebounding: false
      };
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, 20);
      }
    },
    mounted() {
      setTimeout(() => {
        this.initScroll();
      }, 20);
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          return;
        } //从子路由刷新返回此页面时BScroll初始化时DOM还未渲染完成，BScroll会报错
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh
        });
        // 如果需要监听滚动事件
        if (this.listenScroll) {
          let _this = this;
          this.scroll.on("scroll", pos => {
            _this.$emit("scroll", pos);
          });
        }
        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullMoreLoad) {
          this.scroll.on("scrollEnd", () => {
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              this.$emit("pullMoreLoad");
            }
          });
        }

        // 是否派发顶部下拉事件，用于下拉刷新
        if (this.pullDownRefresh) {
          //this._initPullDownRefresh()
        }
        // 滚动收起键盘
        if (this.beforeScrollStart) {
          this.scroll.on("beforeScrollStart", () => {
            this.$emit("beforeScroll");
          });
        }
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll &&
          this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    }

};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.pulldown-loading {
  position: absolute;
  width: 100%;
  top: -10px;
}
</style>