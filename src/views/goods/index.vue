<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <!-- sku组件 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择组件 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <!-- 按钮组件 -->
          <XtxButton
            type="primary"
            @click="insertCart()"
            style="margin-top: 20px"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from "./components/goods-relevant";
import GoodsImage from "./components/goods-image.vue";
import GoodsSales from "./components/goods-sales.vue";
import GoodsName from "./components/goods-name";
import GoodsSku from "./components/goods-sku.vue";
import GoodsTabs from "./components/goods-tabs.vue";
import GoodsHot from "./components/goods-hot.vue";
import GoodsWarn from "./components/goods-warn.vue";
import { nextTick, provide, ref, watch } from "vue";
import { findGoods } from "@/api/product";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Message from "@/components/library/Message";
export default {
  name: "XtxGoodsPage",
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn,
  },
  setup() {
    // 1.获取商品详情，进行渲染
    const goods = useGoods();
    //
    const changeSku = (sku) => {
      // 修改商品的现价、原价、库存信息
      if (sku.skuId) {
        goods.value.price = sku.price;
        goods.value.oldPrice = sku.oldPrice;
        goods.value.inventory = sku.inventory;
      }
      // 记录选择后的sku，可能有数据，可能没有数据{}
      currSku.value = sku;
    };

    // 提供goods数据给后代组件使用
    provide("goods", goods);

    // 选择的数量
    const num = ref(1);

    // 加入购物车
    const store = useStore();
    const currSku = ref(null);
    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value;
        const { id, name, price, mainPictures } = goods.value;
        store
          .dispatch("cart/insertCart", {
            skuId,
            attrsText,
            stock,
            id,
            name,
            price,
            nowPrice: price,
            picture: mainPictures[0],
            selected: true,
            isEffective: true,
            count: num.value,
          })
          .then(() => {
            Message({ type: "success", text: "加入购物车成功" });
          });
      } else {
        Message({ text: "请选择完整规格" });
      }
    };

    return {
      goods,
      changeSku,
      num,
      insertCart,
    };
  },
};
// 获取商品详情
const useGoods = () => {
  const goods = ref(null);
  const route = useRoute();
  watch(
    () => route.params.id,
    (newVal) => {
      // 如果有值，并且在商品详情页才去发送请求
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then((data) => {
          // 让商品数据为null然后使用v-if的组件可以重新销毁和创建
          goods.value = null;
          nextTick(() => {
            goods.value = data.result;
          });
        });
      }
    },
    { immediate: true }
  );
  return goods;
};
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
