import React from 'react';

class Tyler extends React.Component {
  constructor () {
    super();
    this.state = {
      myId: '',
      peers: {}
    };
    this.connectSuccess = this.connectSuccess.bind(this)
    this.connectFailure = this.connectFailure.bind(this)
    this.populateList = this.populateList.bind(this);
  }
  componentDidMount () {
    this.initRTC(this.connectSuccess, this.connectFailure);
  }

  performCall(easyrtcid) {
    easyrtc.call(
       easyrtcid,
       function(easyrtcid) { console.log("completed call to " + easyrtcid);},
       function(errorCode, errorText) { console.log("err:" + errorText);},
       function(accepted, bywho) {
          console.log((accepted?"accepted":"rejected")+ " by " + bywho);
       }
   );
}
  
  async populateList (roomName, peers) {
    await this.setState({peers});
    // const ids = Object.keys(peers);
    // ids.forEach(id => {this.performCall(id)})
  }

  connectSuccess (myId) {
    this.setState({myId});
  }

  connectFailure (errmesg) {
    console.log(errmesg);
  }

  initRTC (connectSuccess, connectFailure) {
    easyrtc.setStreamAcceptor((callerEasyrtcid, stream) => {
      const video = document.getElementById('caller');
      easyrtc.setVideoObjectSrc(video, stream);
  });

   easyrtc.setOnStreamClosed(() => {
      easyrtc.setVideoObjectSrc(document.getElementById('caller'), '');
  });
    easyrtc.setRoomOccupantListener(this.populateList);
    easyrtc.initMediaSource(
      function(){       // success callback
          var selfVideo = document.getElementById("self");
          easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
          easyrtc.connect("Company_Chat_Line", connectSuccess, connectFailure);
      },
      connectFailure
  );
  }

  render () {
    const peersArr = Object.keys(this.state.peers);
    console.log("state", this.state);
    return (
      <div>
        <div id="connected-list" >
          {peersArr.map((peer, index) => {
            return (
              <button key={index} onClick={() => {this.performCall(peer)}}>{peer}</button>
            )
          })}
        </div>
        <h3>My Id is {this.state.myId}</h3>
        <video id="self" width="300" height="200" />
        <video id="caller" width="300" height="200" />
      </div>
    )
  }
}

export default Tyler;
