import { ethers } from 'ethers';
import './App.css';
import React from 'react';
import axios from 'axios';

const url = "https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph";

function App() {
  const [imageUrl, setImageUrl] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [address, setAddress] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  React.useEffect(() => {
    // this logic will run, every time the page reloads
    queryWalletNFTs();
  });
  const { ethereum } = window;
  let provider;

  if(ethereum) {
    console.log("This user has MetaMask!")
    ethereum.request({ method: 'eth_requestAccounts'});
    provider = new ethers.providers.Web3Provider(ethereum);
    displayUserDetails();
    
  } else {
    console.log("Hey, install MetaMask!");
  }

  ethereum.on('chainChanged', (chainId) => {
    displayUserDetails();
  });

  ethereum.on('accountsChanged', (accounts) => {
    displayUserDetails();
  });

  async function displayUserDetails() {
    const signer = await provider.getSigner();
    const addr1 = await signer.getAddress();
    const userBalance = await provider.getBalance(addr1);
    setAddress(addr1);
    setBalance(ethers.utils.formatEther(userBalance));
  }

  async function queryWalletNFTs() {
    const query = `{
      owners(first: 10, where:{id: "0x5f8E477B694859Cd6B792cD1cec9Dea319be53a5"}) {
        tokens {
          tokenID
          tokenURI
        }
      }
    }`;
    const response = await axios.post(url, {
      query,
      // variables: TODO
    });
    console.log(response);
    let arrayResponse = response.data.data.owners[0].tokens;
    let uris = [];

    arrayResponse.forEach((element, index) => {
      uris.push(element.tokenURI);
    });

    console.log(uris);

    let tempImages = [];

    for(let i = 0; i < uris.length; i++) {
      try {
        let response = await axios.get(uris[i]);
        tempImages.push(response.data.image);
      } catch (err) {
        console.log(err);
      }
      
    }
    console.log(imageUrl);
    setImages(tempImages);
    
  }
  
  return (
    <div className="App">
      <div className="title">
        The Class1 React dApp!
      </div>
      <div className="user-info">
        <p>
          <b>Your address:</b> {address}
        </p>
        <p>
          <b>Your balance:</b> {balance}
        </p>

        {images.map((image, index) => {
            return (
                <div src={image}/>
            )
        })}
      </div>
    </div>
  );
}

export default App;
