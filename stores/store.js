// import { observable, action, toJS } from 'mobx'
// import some from 'lodash/some'
// import reject from 'lodash/reject'
//
// import { action, observable } from 'mobx'
// // import requestCreator from 'core/request'
// // import Common from './stores/Common'
// import Todo from './Todo'
//
// // import requestCreator from './components/util/request.js';
// let store = null
// let state = null
//
// const _getStore = (request = {}, state) => {
//   return {
//     todo: new Todo(request, state),
//     // account: new Account(request, state),
//     // forms: new Forms(request, state),
//     // strategys: new Strategy(request, state),
//     // trade: new Trade(request, state),
//   }
// }
//
// export function initStore (isServer, lastUpdate = Date.now()) {
//   const request = requestCreator("");
//   if (isServer) {
//     return _getStore(request, State)
//   } else {
//     if (state === null) {
//       state = State
//     }
//     if (store === null) {
//       store = _getStore(request, state)
//     }
//     return store
//   }
// }
//
//
//
// class Store {
//   constructor(isServer, shows) {
//
//   }
//
//   // @action
//   // setBookmarkShows(shows) {
//   //   this.bookmarkedShows = shows
//   // }
// }
//
// export function initStore(isServer) {
//   return new Store(isServer)
// }
