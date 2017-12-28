import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../components/withRoot';
import { Provider, observer, inject } from 'mobx-react'
import { toJS } from 'mobx';

import Nav from '../components/Nav';
import AddItem from '../components/AddItem';
import TodoItems from '../components/TodoItems';
import GlobalSnack from '../components/GlobalSnack';
import InstallMetaMaskError from '../components/InstallMetaMaskError';

import { initStore } from '../stores'


const styles = {

};

@observer
class Index extends Component {

  static getInitialProps ({ req }) {
   const isServer = !!req
   const store = initStore(isServer)
   return { isServer }
 }

  state = {
    open: false,
    waiting: true
  };

  constructor (props) {
    super(props)
    this.store = initStore(props.isServer)
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { setWeb3 } = this.store;
    const web3 = await setWeb3();
    setTimeout(() => this.setState({ waiting: false, e: web3 ? web3 : '' }), 500);
  }

  handleChange = name => event => {
    const { setTodo } = this.store;
    setTodo(event.target.value)
    if (this.state.error) this.setState({ error: '' })
  };

  submit = (e) => {
    e.preventDefault();
    const { todo, setTodo, addOneTodo } = this.store;
    if (todo) {
      const error = addOneTodo({ name: todo, status: 0 });
      if (error) this.setState({ error })
    }
    setTodo('');
  }

  handleToggle = (name, i) => async (event) => {
    const { todo, todos, setTodos, setTodo } = this.store;
    const items = todos.slice()
    if (items[i].status === 0) items[i].status = 1;
    else items[i].status = 0;
    const e = await setTodos(items)
    if (e) {
      this.setState({ e });
      setTimeout(() => {
        this.setState({ e: null });
      }, 3000)
    }
  }

  deleteItem = (i) => _ => {
    const { todos, setTodos } = this.store;
    const items = todos.slice();
    items.splice(i, 1);
    setTodos(items);
  }

  render() {
    const { todo, todos } = this.store;
    const { e } = this.state;
    if (e && e === 'Please install MetaMask') {
      return (<InstallMetaMaskError />)
    }
    return (
      <Provider store={this.store}>
        <div className={this.props.classes.root}>
          <Nav title={'TODO'} />
          <AddItem
            item={todo}
            handleChange={this.handleChange}
            submit={this.submit}
          />
          <TodoItems
            items={toJS(todos)}
            handleToggle={this.handleToggle}
            deleteItem={this.deleteItem}
            waiting={this.state.waiting}
          />
          <GlobalSnack
            autoHideDuration={30000}
            open={this.state.e ? true : false}
            type={'error'}
            message={this.state.e}
          />
        </div>
      </Provider>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
