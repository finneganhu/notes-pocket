var recordInterfaceButton = document.querySelector('#record-interface-button');
var recordArea = document.querySelector('#record-interface');
var startRecorderButton = document.querySelector('#start-recorder-button');
var startStopButton = document.querySelector('#start-stop-button');
var downloadLink = document.querySelector('#download-link');
const mediaSource = new MediaSource();
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

function openRecordModal() {
    setTimeout(function() {
        recordArea.style.display = 'block';
    }, 1);
}

recordInterfaceButton.addEventListener('click', openRecordModal);

startStopButton.addEventListener('click', () => {
    if(startStopButton.textContent !== 'Stop Recording') {
        startRecording();
    } else {
        stopRecording();
        startStopButton.textContent = 'Start Recording';
        downloadLink.disabled = false;
    }
});

downloadLink.addEventListener('click', () => {
    download();
});

function handleDataAvailable(event) {
    if(event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startRecording() {
    recordedBlobs = [];
    let options = {mimeType: 'audio/webm'};
    mediaRecorder = new MediaRecorder(window.stream, options);
    startStopButton.textContent = 'Stop Recording';
    downloadLink.disabled = true;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
}

function stopRecording() {
    if(mediaRecorder) {
        mediaRecorder.stop();
    }
}

function handleSuccess(stream) {
    startRecorderButton.disabled = true;
    startStopButton.disabled = false;
    window.stream = stream;
}

async function init(constraints) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
}

function download() {
    const blob = new Blob(recordedBlobs, {
        type: 'audio/webm'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

startRecorderButton.addEventListener('click', async() => {
    const constraints = {
        audio: true, video: false
    };
    await init(constraints);
});
