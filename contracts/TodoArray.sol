pragma solidity ^0.4.18;

contract TodoArray {

  /* Variables */
  struct TodoItem {
    string name; // name of the todo item
    uint status; // status of the todo 0 = not_done, 1 = done
  }
  mapping (address => TodoItem[]) todos;       // an array of TodoItem(s) assigned to each address(user)
  address public owner;

  /* Modifiers */
  modifier restricted() {
    if (msg.sender == owner) _;
  }

  /* Methods */
  function TodoArray() public {
    owner = msg.sender;
  }

  /* function add(string todo, uint status) public {
    todos.push(TodoItem(todo, status));
    return todos[msg.sender];
  }

  function getTodos() public {
    return todos[msg.sender];
  } */

  function kill() public {
    if (msg.sender == owner)  // only allow this action if the account sending the signal is the creator
      selfdestruct(owner);       // kills this contract and sends remaining funds back to creator
  }
}
