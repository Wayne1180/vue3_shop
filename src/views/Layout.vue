<template>
  <!-- 顶部通栏 -->
  <AppNavbar />
  <!-- 头部组件 -->
  <AppHeader />
  <!-- 吸顶头部 -->
  <AppHeaderSticky />
  <!-- 内容容器 -->
  <div class="app-body">
    <RouterView />
  </div>
  <!-- 底部组件 -->
  <AppFooter />
</template>

<script>
import AppNavbar from "@/components/app-navbar.vue";
import AppHeader from "@/components/app-header.vue";
import AppFooter from "@/components/app-footer.vue";
import AppHeaderSticky from "@/components/app-header-sticky.vue";
import { useStore } from "vuex";
export default {
  name: "Layout",
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky,
  },
  setup() {
    // 获取分类数据
    const store = useStore();
    store.dispatch("category/getList");
    return {};
  },
};
</script>

<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>