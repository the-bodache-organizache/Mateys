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
    console.log(easyrtc);
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
  
  populateList (roomName, peers) {
    this.setState({peers});
    const ids = Object.keys(peers);
    ids.forEach(id => {this.performCall(id)})
  }

  connectSuccess (myId) {
    // console.log("My easyrtcid is " + myId);
    console.log("in success", this);
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
    console.log('peers array', peersArr);
    console.log("state", this.state)
    return (
      <div>
        <div id="connected-list" >
          {peersArr.map((peer, index) => (<div key={index}>{peer}</div>))}
        </div>
        <h3>My Id is {this.state.myId}</h3>
        <video id="self" width="300" height="200" />
        <video id="caller" width="300" height="200" />
      </div>
    )
  }
}

export default Tyler;
