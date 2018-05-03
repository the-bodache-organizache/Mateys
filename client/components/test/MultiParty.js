import React from 'react';
// var activeBox = -1;  // nothing selected
// var aspectRatio = 4/3;  // standard definition video aspect ratio
// var numVideoOBJS = maxCALLERS+1;
// var layout;

class MultiParty extends React.Component {
  constructor () {
    super();
    this.maxCALLERS = 3;
  }


  callEverybodyElse(roomName, otherPeople) {
    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    const list = [];
    let connectCount = 0;
    for (let easyrtcid in otherPeople) {
      list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
      function callSuccess() {
        connectCount++;
        if (connectCount < this.maxCALLERS && position > 0) {
          establishConnection(position - 1);
        }
      }
      function callFailure(errorCode, errorText) {
        easyrtc.showError(errorCode, errorText);
        if (connectCount < this.maxCALLERS && position > 0) {
          establishConnection(position - 1);
        }
      }
      easyrtc.call(list[position], callSuccess, callFailure);
    }
    if (list.length > 0) {
      establishConnection(list.length - 1);
    }
  }

  componentDidMount() {
    this.initRTC();
  }

  initRTC () {
    easyrtc.setRoomOccupantListener(this.callEverybodyElse);
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], null);
    // easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
  }
  render() {
    return (
      <div id="fullpage" className="boxCommon">
        <div id="videos" style={{position: "relative", top: "50px", left: "30px"}}>
          <video
            id="box0"
            className="transit boxCommon thumbCommon easyrtcMirror"
            muted="muted"
            volume="0"
            height="480"
            width="640"
          />
          <video
            id="box1"
            className="transit boxCommon thumbCommon"
            style={{ visibility: 'hidden' }}
            height="480"
            width="640"
          />
          <video
            id="box2"
            className="transit boxCommon thumbCommon"
            style={{ visibility: 'hidden' }}
            height="480"
            width="640"
          />
          <video
            id="box3"
            className="transit boxCommon thumbCommon"
            style={{ visibility: 'hidden' }}
            height="480"
            width="640"
          />
        </div>
        {/* <div id="textentryBox" onSubmit={this.sendText} style={{display: 'none'}} >
            <input type="text" id="textentryField"  className="transit boxcommon" /><br/>
            <button id="textentrySubmit" style="float:right;margin-right:1em" onclick="sendText()">Send</button>
            <button id="textentryCancel" style="float:left;margin-left:1em" onclick="cancelText()">Cancel</button>
        </div> */}

        {/* <img id="killButton" className="transit boxCommon" onclick="killActiveBox()" src="images/button_close.png" style="display:none;z-index:3" alt="close button" /> */}
        <img
          id="muteButton"
          className="transit boxCommon"
          onClick={this.muteActiveBox}
          src="images/button_mute.png"
          style={{ display: 'none', zIndex: 3 }}
          alt="mute button"
        />
        {/* <img id="textEntryButton" className="transit boxCommon" onclick ="showTextEntry()" src="images/textEntry.png" style={{display: 'none', 'z-index': 3}} alt="text button" /> */}
      </div>
    );
  }
}
export default MultiParty;
