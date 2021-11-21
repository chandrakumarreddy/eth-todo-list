const App = {
  contracts: {},
  async load() {
    await this.loadWeb3();
    await this.loadAccount();
    await this.loadContract();
    await this.render();
  },
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },
  async loadAccount() {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length == 0) {
        alert(
          "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
        );
        return;
      }
      App.account = accounts[0];
    } catch (error) {
      console.log(error);
    }
  },
  async loadContract() {
    const todoList = await $.getJSON("TodoList.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(web3.currentProvider);

    App.todoList = await App.contracts.TodoList.deployed();
  },
  async render() {
    if (App.loading) {
      return;
    }
    App.setLoading(true);
    //   render account
    $("#account").html(App.account);
    App.setLoading(false);
    await this.renderTasks();
  },
  async renderTasks() {
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");
    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task.id.toNumber();
      const taskContent = task.name;
      const taskCompleted = task.completed;
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted);
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }
      $newTaskTemplate.show();
    }
  },
  async setLoading(value) {
    App.loading = value;
    const loader = $("#loader");
    const content = $("#content");
    if (value) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
