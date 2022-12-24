<template>
  <ul class="navs">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li
      v-for="item in list"
      :key="item.id"
      @mousemove="show(item)"
      @mouseleave="hide(item)"
    >
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">{{
        item.name
      }}</RouterLink>
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`" @click="hide(item)">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "AppHeaderNav",
  setup() {
    const store = useStore();
    // 拿到vuex中的分类列表
    const list = computed(() => {
      return store.state.category.list;
    });

    // 跳转的时候不会关闭二级类目，通过数据来控制
    // 1.每个分类加上open数据
    // 2.提供显示和隐藏函数，修改open数据
    // 3.在组件中使用vuex中的函数，使用事件来绑定，提供一个显示隐藏的类名
    const show = (item) => {
      store.commit("category/show", item.id);
    };
    const hide = (item) => {
      store.commit("category/hide", item.id);
    };

    return {
      list,
      show,
      hide,
    };
  },
};
</script>

<style lang="less" scoped>
.navs {
  width: 820px;
  position: relative;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}

.layer {
  z-index: 999;
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
