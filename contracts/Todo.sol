pragma solidity ^0.4.18;

contract Todo {
    mapping (address => string) private todos;
    address public owner;

    event TodoChange(
      address indexed _from,
      string todos
    );

    event GetTodoEvent(
      uint timestamp
    );

    function Todo() public {
      owner = msg.sender;
    }

    /* Functions */
    function change(string todo) public {
      todos[msg.sender] = todo;
      TodoChange(msg.sender, todos[msg.sender]);
    }

    function getTodos(address addr) public  constant returns (string) {
      GetTodoEvent(block.timestamp);
      return todos[addr];
    }
}

/* pragma solidity ^0.4.17;

contract Todo {
  struct TodoItem {
    string name; // name of the todo item
    uint status; // status of the todo 0 = not_done, 1 = done
  }

 mapping (address => TodoItem[]) todos;       // an array of TodoItem(s) assigned to each address(user)
 address public owner;



  function Todo() public {
    owner = msg.sender;
  }

  function add(string todo, uint status) public returns (string) {
    todos.push(TodoItem(todo, status));
    return todos[msg.sender];
  }

  function getTodos() public constant returns (string) {
    return todos[msg.sender];
  }
  function kill() {
    if (msg.sender == creator)  // only allow this action if the account sending the signal is the creator
      suicide(creator);       // kills this contract and sends remaining funds back to creator
  }
} */
