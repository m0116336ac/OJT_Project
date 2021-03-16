<template>
  <div class="clearfix" :class="{linkable}" @click="onclick">
    <!-- v-bindは: v-onは@で省略-->
    <!-- linkableがtrueの場合のみstyleを適用する -->
    <div class="image"><img :src="book.image" /></div>
    <div class="details">
      <ul>
        <li v-if="index"> {{index}}. </li>
        <li>{{book.title}} ({{book.price}}円)</li>
        <li>{{book.author}} 著</li>
        <li>{{book.publisher}} /刊</li>
        <li>{{book.publiched}} /発売</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import {UPDATE_CURRENT} from '@/mutation-types'
  //mutation-types 定数を一か所に纏めておく

export default {
  name : 'book-info',
  props:{
    index: {type: Number},
    linkable: {type: Boolean, default: false},
    book: {type: Object}
  },
  methods: {
    ...mapActions([UPDATE_CURRENT]),//storeのUPDATE_CURRENTとこのvue内の同名称のものを紐づけ
    onclick(){ //クリックされると
      if(this.linkable){
        this[UPDATE_CURRENT](this.book)//現在の書式情報をステート(状態)に保存
        this.$router.push('/form')//フォームへ移動
      }
    }
  }
}
</script>

<style scoped>
.linkable:hover {
    cursor: pointer;
    background-color: #ff9;
}

.image {
  float:left;
}

.image img {
  height: 180px;
}

.details {
  float: left;
}

.details li {
  list-style-type: none;
  text-align: left;
}

.clearfix {
  width: 100%;
  margin-bottom: 10px;
}

.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
</style>
