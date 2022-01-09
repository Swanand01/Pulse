const socket = io("/");

var client = new WebTorrent()
let torrentBeingSent;

client.on('error', function (err) {
	console.log(err);
})

const fileInput = document.querySelector("#file");
file.addEventListener('change', (e) => {

	updateFileStatus("");
	updateTransferSpeed("");

	const file = e.target.files[0];
	const { name: fileName, size } = file;
	const fileSize = formatBytes(size);
	const fileNameAndSize = `${fileName} - ${fileSize}`;
	let p = document.createElement("p");
	p.textContent = fileNameAndSize;
	let filenameDiv = document.querySelector("#filename");
	filenameDiv.innerHTML = ''
	filenameDiv.append(p)
});

const selectFileBtn = document.querySelector("#file_send_btn");
const sendBtn = document.querySelector("#send");
sendBtn.addEventListener("click", () => {
	disableSelectFile();
	sendBtn.disabled = true;
	updateFileStatus("Preparing to send...");

	let file = document.querySelector("#file").files[0];
	let id;
	client.seed(file, function (torrent) {
		torrentBeingSent = torrent;
		console.log('Seeding ' + file.name)
		id = torrent.magnetURI;
		socket.emit("file-link", id)
		torrent.on('upload', function (bytes) {
			updateFileStatus("Sending " + file.name + ": " + Math.round((torrent.uploaded / torrent.length) * 100) + "%");
			updateTransferSpeed("Upload speed: " + formatBytes(torrent.uploadSpeed) + "/s")
		})
		torrent.on('error', function (err) {
			console.log(err);
		})
	})
})


socket.on('connect', function () {
	socket.emit("join-room", ROOM_ID, "babu")
});

socket.on("user-disconnected", userId => {
	console.log(userId + " left.");
	reset();
})

socket.on("done-downloading", torrent => {
	enableSelectFile();
	console.log("Deleting torrent...");
	client.remove(torrent);
	sendBtn.disabled = false;
	updateFileStatus("File sent...")
})

socket.on("file-link", fileLink => {
	sendBtn.disabled = true;
	console.log("Received: ", fileLink);
	updateFileStatus("");
	updateTransferSpeed("");
	disableSelectFile();
	updateFileStatus("Received magnet link...");
	client.add(fileLink, function (torrent) {
		torrentBeingSent = torrent;
		torrent.on('download', function (bytes) {
			console.log('progress: ' + torrent.progress * 100);
			updateFileStatus("Receiving file: " + Math.round(torrent.progress * 100) + "%");
			updateTransferSpeed("Download speed: " + formatBytes(torrent.downloadSpeed) + "/s");
			if (torrent.done) {
				console.log("Done downloading");
				updateFileStatus("File received! Generating your download...")

				sendBtn.disabled = false;
				enableSelectFile();

				socket.emit("done-downloading", fileLink)

				var file = torrent.files[0]
				file.getBlob(function callback(err, blob) {
					download(blob, file.name)
					client.remove(torrent);
					sendBtn.disabled = false;
				})

			}
		})
		torrent.on('error', function (err) {
			console.log(err);
		})
	})
})

socket.on('user-connected', userId => {
	updateConnectionStatus("Connection established...");
	sendBtn.disabled = false;
	socket.emit("connection-established", userId);
	console.log("New user connected: " + userId);
})

socket.on('connection-established', userId => {
	updateConnectionStatus("Connection established...");
	sendBtn.disabled = false;
})


let connStatusP = document.querySelector("#connection_status");
function updateConnectionStatus(status) {
	connStatusP.textContent = status;
}

let fileStatusP = document.querySelector("#file_status");
function updateFileStatus(status) {
	fileStatusP.textContent = status;
}

let transferSpeedP = document.querySelector("#transfer_speed");
function updateTransferSpeed(speed) {
	transferSpeedP.textContent = speed;
}

function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function reset() {
	console.log("Resetting...");
	if (torrentBeingSent) torrentBeingSent.destroy();
	torrentBeingSent = "";
	updateConnectionStatus("Waiting for connection...");
	updateFileStatus("");
	updateTransferSpeed("");
	enableSelectFile();
	sendBtn.disabled = true;
}

function disableSelectFile() {
	selectFileBtn.style.display = "none"
}

function enableSelectFile() {
	selectFileBtn.style.display = ""
}