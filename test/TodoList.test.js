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
  it("creata new task", async () => {
    const result = await this.todoList.createTask("test task1");
    const taskCount = await this.todoList.taskCount();
    assert.equal(taskCount.toNumber(), 2, "Task count should be 2");
    const event = result.logs[0].args;
    assert.equal(
      event.id.toNumber(),
      taskCount,
      "new task ID should be same as taskCount length"
    );
    assert.equal(
      event.name,
      "test task1",
      "event name should be same as `test task1`"
    );
    assert.equal(event.completed, false, "task status should be false");
  });
});
