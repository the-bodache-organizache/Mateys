import React from 'react';

class MotionDetection extends React.Component {

  connectToEasyRTC = () => {
    var selfEasyrtcid = '';

    function connect() {
      console.log('connect');
      easyrtc.setVideoDims(640, 480);
      easyrtc.setRoomOccupantListener(convertListToButtons);
      easyrtc.easyApp(
        'easyrtc.audioVideoSimple',
        'selfVideo',
        ['callerVideo'],
        loginSuccess,
        loginFailure
      );
    }

    function clearConnectList() {
      var otherClientDiv = document.getElementById('otherClients');
      while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
      }
    }

    function convertListToButtons(roomName, data, isPrimary) {
      clearConnectList();
      var otherClientDiv = document.getElementById('otherClients');
      for (var easyrtcid in data) {
        var button = document.createElement('button');
        button.onclick = (function(easyrtcid) {
          return function() {
            performCall(easyrtcid);
          };
        })(easyrtcid);

        var label = document.createTextNode(easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
      }
    }

    function performCall(otherEasyrtcid) {
      easyrtc.hangupAll();

      var successCB = function() {};
      var failureCB = function() {};
      easyrtc.call(otherEasyrtcid, successCB, failureCB);
    }

    function loginSuccess(easyrtcid) {
      selfEasyrtcid = easyrtcid;
      document.getElementById('iam').innerHTML =
        'I am ' + easyrtc.cleanId(easyrtcid);
    }

    function loginFailure(errorCode, message) {
      easyrtc.showError(errorCode, message);
    }

    connect();
  };

  componentDidMount () {
    this.connectToEasyRTC();
  }

  render() {
    return (
      <div id="container">
        <div id="header">
          <a href="index.html">
            <img
              id="logo_easyrtc"
              src="images/easyrtc_logo.png"
              alt="EasyRTC"
            />
          </a>
        </div>
        <div id="main">
          <h2>The Demo</h2>
          <div id="demoContainer">
            <div id="connectControls">
              <div id="iam">Not yet connected...</div>
              <br />
              <strong>Connected users:</strong>
              <div id="otherClients" />
            </div>
            <div id="videos">
              <div id="self-video-div">
                <video
                  autoPlay="autoplay"
                  className="easyrtcMirror"
                  id="selfVideo"
                  muted="muted"
                  volume="0"
                  height="480"
                  width="640"
                />
                <canvas id="canvas-source" width="640" height="480" />
              </div>
              <canvas id="canvas-blended" width="640" height="480" />
              <div style={{ position: 'relative', float: 'left' }}>
                <video
                  autoPlay="autoplay"
                  id="callerVideo"
                  height="480"
                  width="640"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MotionDetection;
