<template>
  <div id="form">
    <BookInfo :book="book"></BookInfo>
    <hr />
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="読了日">
        <el-date-picker type="date" v-model="form.read"></el-date-picker>
      </el-form-item>
      <el-form-item label="タグ">

        <button v-on:click="openModal">タグ</button>

        <div id="overlay" v-show="showContent">
          <div id="content">
            <p>タグを設定します</p>
            <p><button>ok</button></p>
            <button v-on:click="closeModal">キャンセル</button>
          </div>
        </div>

      </el-form-item>
      <el-form-item label="感想">
        <el-input type="textarea" size="large" v-model="form.memo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onsubmit">登録</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import BookInfo from '@/components/BookInfo.vue'
import {UPDATE_BOOK,UPDATE_CURRENT} from '@/mutation-types'

export default {
  name : 'book-form',
  components:{
    BookInfo
  },
  data(){
    return {
      book : {},
      form:{
        read: new Date(),
        memo: ''
      },
      rules: { //検証ルール
        memo:[
          {required: true, message: 'メモ紙入力です', trigger:'change'}
        ]
      },
      showContent: false
    }
  },
  computed: mapGetters(['current', 'getBookById']),
  created(){
    if(!this.current){
      this.$router.push('/')
    }
    this.book = Object.assign({}, this.current)
  },
  mounted(){
    let b = this.getBookById(this.book.id)
    if(b){
      this.form.read = b.read
      this.form.memo = b.memo
    }
    //document.write(this.showContent);
  },
  methods:{
    ...mapActions([UPDATE_CURRENT,UPDATE_BOOK]),
    onsubmit(){
      this.$refs['form'].validate((valid) => {
        if(valid){
          this[UPDATE_BOOK](
            Object.assign({}, this.book, this.form)
          )
          this[UPDATE_CURRENT](
            null
          )
          this.$notify({
            title: 'Reading Recorder',
            message: this.$createElement('p', {style: 'color:#009'},'読書情報の登録／更新に成功しました。'),
            duration: 2000
          })
          this.form.read = new Date()
          this.form.memo = ''
          this.$router.push('/')
        }
      })
    },
    openModal: function(){
      this.showContent = true
      //document.write(this.showContent);
    },
    closeModal: function(){
      this.showContent = false
      //document.write(this.showContent);
    }
  }
}
</script>

<style scoped>
#form {
  margin-top: 15px;
}
#overlay{
  z-index:1;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}
#content{
  z-index:2;
  width:75%;
  height:60%;
  padding: 1em;
  background:#ffffff;
}
</style>
