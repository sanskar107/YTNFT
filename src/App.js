import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import YT from './abis/YT.json'
import logo from './Logo.png'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = YT.networks[networkId]
    if(networkData) {
      const abi = YT.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const video = await contract.methods.videos(i - 1).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (video) => {
    this.state.contract.methods.mint(video).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        videos: [...this.state.videos, video]
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      videos: []
    }
    this.activities = []
  }

    youtube_parser(url){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : false;
  }

  componentDidUpdate() {
    console.log(this.activities)
  }

  render() {
    this.activities = []
    for (let i = 0; i < this.state.videos.length; i++) {
      let image = "https://img.youtube.com/vi/" + this.youtube_parser(this.state.videos[i]) + "/1.jpg"
      this.activities.push({img_url: image, text: this.state.videos[i]})
    }
    return (
      <div>
        <div className="topnav">
          <a className="heading"> Your YouTube NFT </a>
          <b className="account">{this.state.account}</b>
        </div>
  
        <a href="#"><img id="logo" src={logo}/></a>

        <div className="box">
          <form className="form" action="/" class="decor" onSubmit={(event)=> {
            event.preventDefault()
            const video = this.video.value
            this.mint(video)
          }}>
            <div class="form-inner">
              <h1>Mint your NFT</h1>
              <input type="text" placeholder="Youtube Link" ref={(input) => { this.video = input}}/>
              <textarea placeholder="Description..." rows="3"></textarea>
              <button type="submit" href="/">Mint</button>
            </div>
          </form>
          <div className="notificationsFrame">
                <div className="panel">
                    { <ContentGrid activities={this.activities} /> }
                </div>
            </div>
          </div>
      </div>

    );
  }
}


export default App;


class ContentGrid extends React.Component {
  render() {
      return (
          <div className="content">
              <div className="grid">
                {this.props.activities.map(activity =>
                    <ActivityItemGrid img_url={activity.img_url} 
                      text={activity.text}
                    />
                )}
              </div>
          </div>
      );
  }
}

class ActivityItemGrid extends React.Component{
  render() {
      return (
          <div className="item">
              <div className="avatar">
                  <img src={this.props.img_url} width="200" height="150" />
              </div>
              <span className="text">
                  {this.props.text}
              </span> 
          </div>
      );
  }
}