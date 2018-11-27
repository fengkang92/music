<template>
    <div class="loading">
        <img class="img" width="24" height="24" src="./loading.png" alt="">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "正在载入..."
        }
    }
};
</script>


<style lang="scss" scoped>
@import "common/scss/variable.scss";
.loading {
    width: 100%;
    text-align: center;
    .img {
       -webkit-animation: xuanzhuan 2s infinite linear;
       animation: xuanzhuan 2s infinite linear;
    }
    .desc {
        line-height: 20px;
        font-size: $font-size-small;
        color: $color-text;
    }
}
@keyframes xuanzhuan {
    0% { transform: rotate(0deg)}
    100% { transform: rotate(360deg)}
}
@-webkit-keyframes xuanzhuan {
    0% { -webkit-transform: rotate(0deg)}
    100% { -webkit-transform: rotate(360deg)}
}
</style>
