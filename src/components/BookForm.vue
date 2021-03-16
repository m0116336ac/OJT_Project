<template>
  <div id="form">
    <BookInfo :book="book"></BookInfo>
    <hr />
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="読了日">
        <el-date-picker type="date" v-model="form.read"></el-date-picker>
      </el-form-item>

      <el-form-item label="タグ">
        <el-input class="form-input" v-model="form.tag" type="text" readonly></el-input>
        <button type="button" v-on:click="show" class="form-button"><img src="../assets/sicon.png" width="20px" height="20px"></button>
        
        <modal name="tag-dialog" :width="900" :height="550" :draggable="true" :resizable="true">
          <div class="modal-header">
            <h2 id="header-title">タグ指定ダイアログ</h2>
          </div>

          <div class="modal-body">
            <div class="search-area">
              <el-form ref="search" :model="search">
                <el-form-item label="タグ名称" class="search-label">
                  <el-input type="text" class="search-input" v-model="search.name"></el-input>
                </el-form-item>
                <el-form-item label="タグコード" class="search-label">
                  <el-input type="text" class="search-input" v-model="search.code"></el-input>
                </el-form-item>
                <div class="buttom-area">
                  <el-form-item>
                    <el-button type="primary" @click="onsearch(search.name, search.code)" class="button blue-button">検索</el-button>
                    <el-button type="primary" @click="onclear" class="button blue-button">クリア</el-button>
                  </el-form-item>
                </div>
              </el-form>

            </div>
            <div class="search-result table-contents"">
              <table border="1" width="95%" cellspacing="0" bordercolor="#333333">
                <tbody>
                  <tr>
                    <th>タグコード</th>
                    <th>タグ名称</th>
                  </tr>
                  <tr v-for="tag in tags" :key="tag.id" v-bind:style="[tag.tagname == search.tag ? highlight : '']" @click="select(tag.tagname)">
                    <td>{{ tag.tagcode }}</td>
                    <td>{{ tag.tagname }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="button-area">
              <button type="button" v-on:click="ok" class="button blue-button">ok</button>
              <button type="button" v-on:click="hide" class="button white-button">キャンセル</button>
            </div>
          </div>
        </modal>

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
      tags : [],
      form:{
        read: new Date(),
        memo: '',
        tag: ''
      },
      search:{
        name: '',
        code: '',
        tag: ''
      },
      highlight:{
        backgroundColor: '#e0ffff'
      },
      rules: { //検証ルール
        memo:[
          {required: true, 
           message: 'メモが未入力です',
           trigger:'change'}
        ]
      }
    }
  },
  computed: mapGetters(['current', 'getBookById', 'getTagById', 'getTagsBySearch', 'getTagsByCode', 'allTags']),
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
      this.form.tag = b.tag
    }
  },
  methods:{
    ...mapActions([UPDATE_CURRENT,UPDATE_BOOK]),
    show: function(){
      this.$modal.show('tag-dialog');
      this.search.name = this.form.tag;
      this.onsearch(this.search.name, '');
      //this.search.code = this.form.tag;
      //console.log(this.search.tag);
      //console.log(this.tags[0]);
    },
    hide: function(){
      this.$modal.hide('tag-dialog');
      this.onclear(); //ダイアログが閉じた場合は検索項目を全て消す
    },

    onsubmit(){
      this.$refs['form'].validate((valid) => {
        if(valid){
          this[UPDATE_BOOK](
            Object.assign({}, this.book, this.form, this.tag)
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
          this.form.tag = ''
          this.search.name = ''
          this.search.code = ''
          this.$router.push('/')
        }
      })
    },
    select: function(tagname){
      this.search.tag = tagname //暫定的なTagnameを決める処理
      //alert(this.search.tag)
    },
    onsearch: function(searchName, searchCode){
      if(searchName) {
        var array = new Array();
        this.tags = this.allTags;
        for (let step = 0; step< this.tags.length; step++){
          var tag = this.tags[step];
          console.log(tag.tagname);
          const result = tag.tagname.match(searchName);

          if(result){
            array.push(this.tags[step]);
            console.log(result);
          }
        }
        //部分一致（大文字小文字区別）
        this.tags = [];
        console.log(this.tags);
        this.tags = array;
        //this.tags = this.getTagsBySearch(searchName);
      } else if(searchCode) {
        this.tags = this.allTags;
        //完全一致
        this.tags = this.getTagsByCode(searchCode);
      } else {
        //this.tags = this.allTags;
      }
      this.search.tag = '';
    },

    ok: function(){
      if(this.search.tag !== ''){
        this.form.tag = this.search.tag; //
      }
      this.$modal.hide('tag-dialog');
      this.onclear(); //確定後は検索項目を全て消す
    },
    onclear: function(){
      this.search.name = ''
      this.search.code = ''
      this.search.tag = ''
      this.tags = []
    }
  }
}
</script>

<style scoped>
#form {
  margin-top: 10px;
}
.modal-header {
  padding-top:0px;
  margin-top:0px;
  padding-left: 10px;
  text-align: left;
  border-buttom: 1px solid #ffffff;
  background-color: #dadada;
}
#header-title {
  margin-top: 0px;
}
.modal-body {
  padding:0px;
  width:95%;
  //border: 1px solid #000000;
  margin-left: 2.5%;
  margin-right: 2.5%;
  text-align: center;
}
div.search-area{
  float:left;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 1%;
  margin-right:1%;
  padding: 10px;
  border: 1px solid #000000;
  width:45%;
  height: 350px;
  text-align: right;
}
div.search-result{
  float:left;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 1%;
  margin-right:1%;
  padding: 10px;
  border: 1px solid #000000;
  width:45%;
  height: 350px;
  text-align: center;
}
div.button-area{
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 2%;
  margin-right:2%;
  padding-top: 15px;
  //border: 1px solid #000000;
  clear:both;
  width:95%;
  text-align: right;
}
button.button{
    -webkit-writing-mode: horizontal-tb !important;
    -webkit-appearance: button;
    display: inline-block;
    border-color: #4169e1;
    border-style: solid;
    border-width: 1px;
    border-radius: 25px;
    padding: 1px 7px 2px;
    text-rendering: auto;
    color: initial;
    display: inline-block;
    text-align: center;
    margin: 0px;
    margin-right: 8px;
    font: 400 16px system-ui;
    width: 120px;
    height: 35px;
}
button.blue-button{
  background: #4169e1;
  color: #ffffff;
}
button.white-button{
  background: #ffffff;
  color: #4169e1;
}
button.red-button{
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
}
button.form-button{
	background-color: white;
	border: none;
  margin-top:5px;
  padding-top:0;
  width: 5px;
  heigth:5px;
}
.form-input{
  width:40%;
}
.search-label{
  //border: 1px solid #000000;
  padding-left: 10px;
}
.search-input{
  //border: 1px solid #000000;
  margin-top: 5px;
  margin-bottom: 10px;
  width:70%;
}
.table-contents {
  overflow-y: scroll;
  width: 100%;
}
</style>
