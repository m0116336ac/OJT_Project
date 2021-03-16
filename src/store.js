import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { UPDATE_CURRENT, UPDATE_BOOK } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    books: [],
    current: null,
    tags: [
      {
        tagcode : 'T001',
        tagname : 'Java'
      },
      {
        tagcode : 'T002',
        tagname : 'C++'
      },
      {
        tagcode : 'T003',
        tagname : 'C#'
      },
      {
        tagcode : 'T004',
        tagname : 'Python'
      },
      {
        tagcode : 'T005',
        tagname : 'Ruby'
      },
      {
        tagcode : 'T006',
        tagname : 'Perl'
      },
      {
        tagcode : 'T007',
        tagname : 'HTML'
      },
      {
        tagcode : 'T008',
        tagname : 'JavaScript'
      },
      {
        tagcode : 'T009',
        tagname : 'CSS'
      },
      {
        tagcode : 'T010',
        tagname : 'Vue.js'
      },
      {
        tagcode : 'S001',
        tagname : 'バックエンド'
      },
      {
        tagcode : 'S002',
        tagname : 'フロントエンド'
      },
      {
        tagcode : 'S003',
        tagname : 'CG'
      },
      {
        tagcode : 'S004',
        tagname : 'ゲーム'
      },
      {
        tagcode : 'S005',
        tagname : 'アプリケーション'
      },
      {
        tagcode : 'R001',
        tagname : '学習'
      },
      {
        tagcode : 'R002',
        tagname : '趣味'
      },
      {
        tagcode : 'R003',
        tagname : '資格'
      },
      {
        tagcode : 'R004',
        tagname : '仕事'
      },
      {
        tagcode : 'R005',
        tagname : 'その他'
      }
    ]
  },
  getters: {
    bookCount(state) {
      return state.books.length
    },
    allBooks(state) {
      return state.books
    },
    getRangeByPage(state) {
      return page => {
        const SIZE = 3
        return state.books.slice((page - 1) * SIZE, (page - 1) * SIZE + SIZE)
      }
    },
    getBookById(state) {
      return id => {
        return state.books.find(book => book.id === id)
      }
    },
    current(state) {
      return state.current;
    },
    getTagsCount(state){
      return state.tags.length
    },
    allTags(state){
      return state.tags
    },
    getTagById(state){
      return id => {
        return state.tags.find(tag => tag.id === id)
      }
    },
    getTagsBySearch(state){
      return tagname => {
        return state.tags.filter(tag => tag.tagname === tagname)
      }
    },
    getTagsByCode(state){
      return tagcode => {
        return state.tags.filter(tag => tag.tagcode === tagcode)
      }
    }
  },
  mutations: {
    [UPDATE_CURRENT](state, payload) {
      state.current = payload
    },
    [UPDATE_BOOK](state, payload) {
      let b = this.getters.getBookById(payload.id)
      if (b) {
        Object.assign(b, payload)
      } else {
        state.books.push(payload)
      }
    }
  },
  actions: {
    [UPDATE_CURRENT]({ commit }, payload) {
      commit(UPDATE_CURRENT, payload)
    },
    [UPDATE_BOOK]({ commit }, payload) {
      commit(UPDATE_BOOK, payload)
    }
  },
  plugins: [createPersistedState({
    key: 'reading-recorder',
    storage: localStorage
  })]
})
