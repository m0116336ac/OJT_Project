<template>
  <div class="list">
    <p>{{bookCount}}件の読書情報が記録されています。</p>
    <BookInfo v-for="(b,i) of books"
      :linkable="true" :book="b" :index="i+1" :key="b.id"></BookInfo>
    <div>
      <el-pagination background layout="prev, pager, next"
        :total="bookCount" :page-size="3" @current-change="onchange">
      </el-pagination>
      <!-- ページング処理を記述する -->
      <!--- データの切り替えは主導のため、@current-change="onchange"で処理を作成する必要がある -->
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import BookInfo from '@/components/BookInfo.vue'

export default {
  name : 'home',
  data(){
    return{
      books: []
    }
  },
  components:{
    BookInfo
  },
  computed: mapGetters(['bookCount', 'getRangeByPage']),
  //vuexのgetRangeByPageをマッピング（~~~.$~~~.~~~が面倒なので省略用）
  methods: {
    onchange(page) {//ページが変更された場合、その情報に基づいて再表示
      this.books = this.getRangeByPage(page)
      //vuexからreturnで返ってきた値を格納、更新を検知して再表示
    }
  },
  mounted(){//初期化の場合は1ページ目を取得
    this.books = this.getRangeByPage(1)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
