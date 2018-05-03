import React from 'react';

class VideoFeed extends React.Component {

  connectToEasyRTC = () => {
    var selfEasyrtcid = "";


    function connect() {
        console.log('connect');
        easyrtc.setVideoDims(640, 480);
        easyrtc.setRoomOccupantListener(convertListToButtons);
        easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
    }


    function clearConnectList() {
        var otherClientDiv = document.getElementById('otherClients');
        while (otherClientDiv.hasChildNodes()) {
            otherClientDiv.removeChild(otherClientDiv.lastChild);
        }
    }


    function convertListToButtons (roomName, data, isPrimary) {
        clearConnectList();
        var otherClientDiv = document.getElementById('otherClients');
        for(var easyrtcid in data) {
            var button = document.createElement('button');
            button.onclick = function(easyrtcid) {
                return function() {
                    performCall(easyrtcid);
                };
            }(easyrtcid);

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
        document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
    }


    function loginFailure(errorCode, message) {
        easyrtc.showError(errorCode, message);
    }

    connect();
  };

  componentDidMount() {
    this.connectToEasyRTC();
  }

  render() {
    return (
      <div id="container">
            <div id="header">
                <a href="index.html"><img id="logo_easyrtc" src="images/easyrtc_logo.png" alt="EasyRTC" /></a>
            </div>
            <div id="menu"><a className="menu_link" href="index.html"><div className="menu_item">Local Demos</div></a><a className="menu_link" href="https://github.com/priologic/easyrtc/tree/master/docs"><div className="menu_item">Documentation</div></a><a className="menu_link" href="https://easyrtc.com/forum/"><div className="menu_item">Support: EasyRTC Forums</div></a><a className="menu_link" href="http://www.easyrtc.com/"><div className="menu_item">EasyRTC.com</div></a></div>
            <div id="main">
                <h1>EasyRTC Demo: Simple Video+Audio</h1>

                <p>The application provides a simple audio-video chat using the easyrtc.easyApp method.</p>

                <p>Connection is handled using an onload statement in the body. Requests are automatically accepted.</p>

                <p>To hang-up on a call, hover your mouse over the upper right of the video, and click on the 'X' which appears at the top right of other person's video object.</p>

                <hr />
                <h2>The Demo</h2>
                <div id="demoContainer">
                    <div id="connectControls">
                        <div id="iam">Not yet connected...</div>
                        <br />
                        <strong>Connected users:</strong>
                        <div id="otherClients"></div>
                    </div>
                    <div id="videos">
                        <video autoPlay="autoplay" className="easyrtcMirror" id="selfVideo" muted="muted" volume="0" height="240" width="320"></video>
                        <div style={{position:'relative', float:'left'}}>
                        <video autoPlay="autoplay" id="callerVideo" height="240" width="320"></video>
                        </div>
                        
                    </div>
                </div>
               
                <br style={{clear:"both"}} />
                <hr />

                <h2>The Code</h2>
                <h3>HTML</h3>
                <pre   id="prettyHtml" className="prettyprint linenums:1">

                </pre>

                <h3>CSS</h3>
                <p>In order to show the 'X' in the upper right corner, the callerVideo video tag must be in a div with relative positioning.:</p>
                <pre id="prettyCSS" className="prettyprint linenums:1">
                </pre>

                <h3>JavaScript</h3>
                <p>The contents of demo_audio_video_simple.js:</p>
                <pre  id="prettyJS" className="prettyprint linenums:1">
                </pre>
            </div>

        </div>
    );
  }
}

export default VideoFeed;
