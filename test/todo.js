const assert = require('assert')
const { assertEvent } = require('../utils')
const Todo = artifacts.require('Todo')

contract('Todo', accounts => {
  const test1 = {
    name: 'test 1 - item on',
    status: 'on'
  }

  const test2 = {
    name: 'test 2 - item off',
    status: 'off'
  }

  const test3 = {
    name: 'test 3 - item off',
    status: 'off'
  }

  const test11 = {
    name: 'Second account',
    status: 'on'
  }

  it('should create one todo and get one todo when there is one todo', () => {
     return Todo.deployed()
      .then(instance => {
        instance.change(JSON.stringify(test1), {from: accounts[0]})
        return instance.getTodos.call(accounts[0])
      })
      .then(todos => {
        return assert.equal(todos, JSON.stringify(test1))
      })
  })

  it('should create two todos and get two todos when there are two todos', function () {
    return Todo.deployed().then(instance => {
      instance.change(JSON.stringify([test1, test2]), {from: accounts[0]})
      return instance.getTodos.call(accounts[0])
    })
    .then(todos => {
      return assert.equal(todos, JSON.stringify([test1, test2]))
    })
  })

  it('should allow setting less todo items', function () {
    return Todo.deployed().then(instance => {
      instance.change(JSON.stringify([test1, test2]), {from: accounts[0]})
      instance.change(JSON.stringify([test1]), {from: accounts[0]})
      return instance.getTodos.call(accounts[0])
    })
    .then(todos => {
      return assert.equal(todos, JSON.stringify([test1]))
    })
  })

  it('should allow setting many todo items', function () {
    return Todo.deployed().then(instance => {
      instance.change(JSON.stringify([test1, test3]), {from: accounts[0]})
      return instance.getTodos.call(accounts[0])
    })
    .then(todos => {
      return assert.equal(todos, JSON.stringify([test1, test3]))
    })
  })

  it('should allow setting one todo from a different account', function () {
    return Todo.deployed().then(instance => {
      instance.change(JSON.stringify([ test11 ]), {from: accounts[1]})
      return instance.getTodos.call(accounts[1])
    })
    .then(todos => {
      return assert.equal(todos, JSON.stringify([ test11 ]))
    })
  })

  //       return instance.adminGetTodos(accounts[1])


  it('should receive an event after adding a todo item', function () {
    let _instance = null;
    return Todo.deployed()
    .then(instance => {
      _instance = instance;
      return instance.change(JSON.stringify([test3]), {from: accounts[0]})
    })
    .then(() => assertEvent(_instance, { event: 'TodoChange', args: { _from: accounts[0], todos: JSON.stringify([test3]) }}))
    .then(logs => {
      assert.equal(logs.event, 'TodoChange')
      assert.equal(logs.args._from, accounts[0])
      assert.equal(logs.args.todos, JSON.stringify([test3]))
    })
  })


})
