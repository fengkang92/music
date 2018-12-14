// 搜索框组件

<template>
  <div class="search-box">
    <i class="iconfont icon-search"></i>
    <input ref="input" class="box" v-model="query" type="text" :placeholder="placeholder">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>  
  </div>  
</template>


<script>
import {debounce} from 'common/js/utl'
export default {
  props:{
    placeholder:{
      type:String,
      default:'搜索歌曲、歌手'
    }
  },
  data(){
    return {
      query:''
    }
  },
  methods:{
    clear(){
      this.query=''
    },
    //接收推荐列表传过来的值
    setQuery(query){
      console.log(query)
      this.query=query
    },
    //当列表滚动时，文本框失去焦点，收起键盘
    blur(){
      this.$refs.input.blur()
    }
  },
  created(){
    this.$watch('query',debounce((newQuery)=>{
      this.$emit('query',newQuery)
    },200))
  }
}
</script>


<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
// @import "common/scss/variable.scss";
// @import "common/scss/mixin.scss";
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-background;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 30px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline-color: gold;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>
