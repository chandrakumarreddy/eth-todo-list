const App = {
  async load() {
    await this.loadWeb3();
    await this.loadAccount();
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
  render() {
    //   render account
    $("#account").html(App.account);
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
