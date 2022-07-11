import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import Liste from "./components/Liste";
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, addresses: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const response = await instance.methods.get().call();

      let options = {
        fromBlock: 0,
        toBlock: 'latest'
      };

      //check ValueModified events
      let listModifiers = await instance.getPastEvents('ValueModified', options);         
   //   if(listModifiers.length>0){
   //     for(let i=0; i<listModifiers.length; i++){
   //       console.log(listModifiers[i]);
          //console.log(listModifiers[i].returnValues._modifierAddress);
   //     }       
   //   }

        // Subscribe à un event
   //   instance.events.ValueModified(options)
   //     .on('data', event => console.log(event))
   //     .on('changed', changed => console.log(changed))
        //.on('error', err => throw err)
   //     .on('connected', str => console.log(str));

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ storageValue: response, web3, accounts, contract: instance, addresses: listModifiers});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runSet = async () => {
    const {accounts, contract} = this.state;
    let valeur = document.getElementById("valeur").value;
    const transac = await contract.methods.set(valeur).send({from: accounts[0]});
    const response = await contract.methods.get().call();

    let options = {
      fromBlock: 0,
      toBlock: 'latest'
    };

    // Récupération du retour du transac
    console.log("data: " + transac.events.ValueModified.returnValues.data);

    // rafraichis la liste des events. Check ValueModified events
    let listModifiers = await contract.getPastEvents('ValueModified', options);  

    this.setState({storageValue:response, addresses: listModifiers});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <input type="text" id="valeur" /><button onClick={this.runSet}>Set val</button>
        <div>The stored value is: {this.state.storageValue}</div>
        <table>
          <tbody>
{this.state.addresses.map((addresse) => (
  <tr><td>{addresse.returnValues.modifierAddress}</td><td>{addresse.returnValues.data}</td></tr>
))}
</tbody>
        </table>
        <Liste addresses={this.state.addresses} />
      </div>
    );
  }
}

export default App;
