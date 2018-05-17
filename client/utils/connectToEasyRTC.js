export default (videoWidth, videoHeight, roomId) => {
  var selfEasyrtcid = '';

  function connect() {
    easyrtc.setVideoDims(videoWidth, videoHeight);
    easyrtc.setRoomOccupantListener(convertListToButtons);
    easyrtc.easyApp(
      'easyrtc.audioVideoSimple',
      'selfVideo',
      ['callerVideo'],
      loginSuccess,
      loginFailure
    );
    easyrtc.joinRoom(roomId, null, loginSuccess, loginFailure);
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

      //var label = document.createTextNode(easyrtc.idToName(easyrtcid));
      var label = document.createTextNode('Connect to your Matey!');
      button.appendChild(label);
      button.setAttribute('class', 'button');
      button.setAttribute('id', 'connect-button');
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
