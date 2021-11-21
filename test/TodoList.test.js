const { assert } = require("chai");

const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", () => {
  before(async () => {
    this.todoList = await TodoList.deployed();
  });
  it("deployed successfully", async () => {
    const address = await this.todoList.address;
    assert.notEqual(address, "0x0");
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
  it("list tasks", async () => {
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);
    assert.equal(
      task.id.toNumber(),
      taskCount.toNumber(),
      "Task ID should be same"
    );
    assert.equal(task.name, "tesing task 1", "Task name should be same");
    assert.equal(task.completed, false, "Task status should be same");
    assert.equal(taskCount.toNumber(), 1, "Total number of tasks should be 1");
  });
});
