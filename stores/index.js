import contract from 'truffle-contract'
import TodoArtifact from '../build/contracts/Todo'
import { action, observable, toJS } from 'mobx'


let web3Instance;
let prevAddress = null;

const watchCtrct = () => {
  /* Watching Contract not working... metamask issue? */
  // console.log('events registered');
  // let ctrct = web3Instance.eth.contract(TodoArtifact.abi);
  // ctrct = ctrct.at('0xD9376Df658Be9905211a028B95646e4787361861');
  // const eTodoChange = ctrct.TodoChange()
  // console.log('ETODOCHANGE', eTodoChange)
  // eTodoChange.watch((e, logs) => {
  //   console.log('1 e  logs ', e, logs);
  // })
  // eTodoChange.get((e, logs) => {
  //   console.log('2 e  logs ', e, logs);
  // })
}

let setWeb3Instance = function (isServer) {
  return new Promise((resolve, reject) => {
    if (web3Instance) {
      resolve(web3Instance);
    } else {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener('load', () => {
        try {
          let web3 = window.web3
          // Checking if Web3 has been injected by the browser (Mist/MetaMask)
          if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider.
            web3 = new Web3(web3.currentProvider)
            web3Instance = web3
          } else {
            // Fallback to localhost if no web3 injection.
            const provider = new Web3.providers.HttpProvider('http://localhost:8545')
            web3 = new Web3(provider)
            web3Instance = web3
          }
          resolve(web3Instance);
          watchCtrct();
        } catch (e) {
          console.error('eee ', e);
        }
      })
    }
  })
}

let store = null

class Store {
  @observable todo = ''
  @observable todos = []
  @observable w3 = undefined
  @observable account = '';
  @observable instance = null;
  @observable TodoChangeEventLog = observable({});
  interval = null;

  constructor (isServer) {
    if (!isServer) setWeb3Instance();
  }

  @action
  setWeb3 = async () => {
    try {
      this.w3 = await setWeb3Instance();
      // wait for an account and instance.
      // set up instance and account
      await this.getTodoContractInstance();
      // // watch for events
      // this.setTodoChangeEventWatch();
      // get initial todo items from the blockchain
      this.getInitialTodosFromBlockchain();
    } catch (e) {
      if (e.message.indexOf('Invalid JSON RPC response') !== -1) {
        return "Please install MetaMask";
      }
      return e.message;
    }
  }

  @action setTodo = (t) => {
    this.todo = t;
  }

  @action.bound setTodos = async (arr) => {
    try {
      await this.getTodoContractInstance();
      const { instance, account } = this
      this.todos = arr;
      console.log('setTodos account ', account);
      const todos = await instance.change(JSON.stringify(toJS(this.todos)), { from: account })
      console.log('TODOS Tx', todos)
      // await this.getInitialTodosFromBlockchain();
    } catch (e) {
      console.error('setTodos E ', e.message);
      return e.message;
    }
  }

  @action
  getInitialTodosFromBlockchain = async() => {
    await this.getTodoContractInstance();
    const { instance, account } = this
    const todos = await instance.getTodos.call(account)
    if (todos) {
      return this.todos = JSON.parse(todos.toString());
    }
    console.warn('no todos on blockchain yet')
    return this.todos = [];
  }

  @action
  addOneTodo = async (item) => {
    try {
      await this.getTodoContractInstance();
      const { instance, account } = this;
      this.todos.push(item);
      const todos = await instance.change(JSON.stringify(toJS(this.todos)), { from: account })
      // await this.getInitialTodosFromBlockchain();
    } catch (e) {
      console.error('addOneTodo E ', e);
      return e;
    }
  }

  /* Blockchain Interfaces */
  // @action setTodoChangeEventWatch = async () => {
  //   // await this.getTodoContractInstance();
  //   // const { instance, account } = this;
  //   // console.log('instance ', instance);
  //
  // }

  @action
  getTodoContractInstance = () => {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.getTodoContractInstance();
      }, 2000)
    }
    return new Promise((resolve, reject) => {
      const Todo = contract(TodoArtifact)
      Todo.setProvider(this.w3.currentProvider)
      web3Instance.eth.getAccounts((error, accounts) => {
        if (error) {
          console.error("get accounts ", error)
          return reject(error)
        }
        if (!accounts || !Array.isArray(accounts)) {
          return reject('No accounts found')
        }
        const account = accounts[0]
        Todo.deployed().then((instance) => {
          if (this.account !== account) {
            this.account = account;
            this.getInitialTodosFromBlockchain();
          }
          if (!this.instance)  {
            this.instance = instance;
          }
          this.instance.TodoChange().watch(function(error, result) {
            console.log('EVENT RESULT', result)
            console.log('EVENT ERROR', error)
          });
          this.instance.GetTodoEvent().watch((err, logs) => {
            console.log('err logs ', err, logs);
          })
          resolve({ instance, account })
        })
      })
    })
  }

}

export function initStore (isServer) {
  if (isServer) {
    return new Store(isServer)
  } else {
    if (store === null) {
      store = new Store(isServer)
    }
    return store
  }
}
