import React from 'react';

class Tyler extends React.Component {


  connectSuccess (myId) {
    console.log("My easyrtcid is " + myId);
  }

  connectFailure (errmesg) {
    console.log(errmesg);
  }

  initRTC () {
    easyrtc.setRoomOccupantListener();
    easyrtc.initMediaSource(
      function(){       // success callback
          var selfVideo = document.getElementById("self");
          easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
          easyrtc.connect("Company_Chat_Line", this.connectSuccess, this.connectFailure);
      },
      this.connectFailure
  );
  }

  render () {
    return (
      <div>
        <div id="connected-list" />
        <video id="self" width="300" height="200" />
        <video id="caller" width="300" height="200" />
      </div>
    )
  }
}

export default Tyler;


var connectSuccess = function(myId) {
  console.log("My easyrtcid is " + myId);
}
var connectFailure = function(errmesg) {
  console.log(errmesg);
}
easyrtc.initMediaSource(
    function(){       // success callback
        var selfVideo = document.getElementById("self");
        easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
        easyrtc.connect("Company_Chat_Line", connectSuccess, connectFailure);
    },
    connectFailure
);