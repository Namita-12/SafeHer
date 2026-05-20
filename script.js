// =============================
// 🚨 SAFEHER MAIN SCRIPT
// =============================


// =============================
// ELEMENTS
// =============================

let sosBtn =
document.getElementById("sosBtn");

let voiceBtn =
document.getElementById("voiceBtn");

let voiceStatus =
document.getElementById("voiceStatus");

let shakeBtn =
document.getElementById("shakeBtn");

let locationText =
document.getElementById("locationText");

let mapFrame =
document.getElementById("mapFrame");

let messageBox =
document.getElementById("messageBox");
let systemStatus =
document.getElementById("systemStatus");
let clockText =
document.getElementById("clockText");
let sosPopup =
document.getElementById("sosPopup");

let closePopup =
document.getElementById("closePopup");
let flashOverlay =
document.getElementById("flashOverlay");
let smsBtn =
document.getElementById("smsBtn");
// =============================
// 📷 CAMERA
// =============================

let cameraBtn =
document.getElementById("cameraBtn");

let cameraInput =
document.getElementById("cameraInput");

let photoOutput =
document.getElementById("photoOutput");


// =============================
// 📞 CONTACTS
// =============================

let contactName =
document.getElementById("contactName");

let contactPhone =
document.getElementById("contactPhone");

let addContactBtn =
document.getElementById("addContactBtn");

let contactList =
document.getElementById("contactList");


// =============================
// 🔊 ALARM SOUND
// =============================

let alarmSound =
new Audio("sounds/alarm.mp3");

alarmSound.loop = true;


// =============================
// 📞 LOAD CONTACTS
// =============================

let contacts =
JSON.parse(
localStorage.getItem("contacts")
) || [];

renderContacts();


// =============================
// 🚨 SOS FUNCTION
// =============================

let sosActive = false;

function activateSOS() {
// Flash effect

document.body.classList.add("flash");

setTimeout(function() {

    document.body.classList.remove("flash");

}, 1200);
if (sosActive) return;

sosActive = true;

messageBox.innerText =
"🚨 SOS ACTIVATED";
flashOverlay.classList.add(
"flashActive"
);
sosPopup.style.display =
"flex";
systemStatus.innerText =
"🚨 Emergency Mode Active";
setTimeout(function() {

flashOverlay.classList.remove(
"flashActive"
);

}, 10000);
// PLAY SOUND

alarmSound.currentTime = 0;

alarmSound.play()
.then(() => {

console.log("Alarm Playing");

})
.catch(err => {

console.log(
"Sound Error:",
err
);

});


// GET LOCATION

if (navigator.geolocation) {

navigator.geolocation.getCurrentPosition(

async function(position) {

let lat =
position.coords.latitude;

let lon =
position.coords.longitude;
systemStatus.innerText =
"📍 Location Shared Successfully";

// SHOW LOCATION

locationText.innerHTML =

"📍 Location:<br>" +

lat + ", " + lon;


// SHOW MAP

mapFrame.style.display =
"block";

mapFrame.src =

"https://maps.google.com/maps?q="
+ lat + ","
+ lon +
"&z=15&output=embed";


// SAVE TO FIREBASE

try {

if (window.db) {

await window.addDoc(

window.collection(
window.db,
"emergencies"
),

{
latitude: lat,
longitude: lon,
time: new Date().toString()
}

);

console.log(
"Saved to Firebase"
);

}

}

catch(error) {

console.log(
"Firebase Error:",
error
);

}

},

function(error) {

systemStatus.innerText =
"❌ Location Access Failed";

locationText.innerText =
"Location error";

}

);

}


// AUTO STOP AFTER 10 SECONDS

setTimeout(function() {

alarmSound.pause();

alarmSound.currentTime = 0;

sosActive = false;

}, 10000);

}


// =============================
// 🚨 SOS BUTTON
// =============================

sosBtn.addEventListener(
"click",
activateSOS
);


// =============================
// 🎤 VOICE SOS
// =============================

let recognition;

if (
'webkitSpeechRecognition'
in window
) {

recognition =
new webkitSpeechRecognition();

recognition.continuous = true;

recognition.lang = "en-US";


recognition.onresult =
function(event) {

let speechResult =

event.results[
event.results.length - 1
][0].transcript.toLowerCase();


console.log(
"Voice:",
speechResult
);


if (

speechResult.includes("help")

||

speechResult.includes("sos")

||

speechResult.includes("save me")

) {

voiceStatus.innerText =
"🚨 SOS Detected";

activateSOS();

}

};


voiceBtn.addEventListener(

"click",

function() {

recognition.start();

voiceStatus.innerText =
"🎤 Listening...";

}

);

}


// =============================
// 📷 CAMERA
// =============================

cameraBtn.addEventListener(

"click",

function() {

cameraInput.setAttribute(
"capture",
"environment"
);

cameraInput.click();

}

);


cameraInput.addEventListener(

"change",

function(event) {

let file =
event.target.files[0];

if (file) {

photoOutput.src =
URL.createObjectURL(file);

photoOutput.style.display =
"block";

}

}

);


// =============================
// 📞 ADD CONTACT
// =============================

addContactBtn.addEventListener(

"click",

function() {

let name =
contactName.value.trim();

let phone =
contactPhone.value.trim();

if (name && phone) {

let newContact = {

name: name,
phone: phone

};


contacts.push(newContact);


// SAVE TO LOCAL STORAGE

localStorage.setItem(

"contacts",

JSON.stringify(contacts)

);


// RENDER CONTACTS

renderContacts();


// CLEAR INPUTS

contactName.value = "";

contactPhone.value = "";

}

}

);


// =============================
// 📞 RENDER CONTACTS
// =============================

function renderContacts() {

contactList.innerHTML = "";

contacts.forEach(function(contact) {

let p =
document.createElement("p");

p.classList.add(
"contact-item"
);

p.innerText =

contact.name
+ " : "
+ contact.phone;

contactList.appendChild(p);

});

}


// =============================
// 📳 SHAKE DETECTION
// =============================

let shakeEnabled = false;

let lastShakeTime = 0;

let shakeThreshold = 35;


// SHAKE BUTTON

shakeBtn.addEventListener(

"click",

function() {

shakeEnabled =
!shakeEnabled;


shakeBtn.innerText =

shakeEnabled

? "📳 Shake detection: ON"

: "📳 Shake detection: OFF";


// REQUEST PERMISSION

if (shakeEnabled) {

requestMotionPermission();

}

}

);


// REQUEST MOTION PERMISSION

function requestMotionPermission() {

if (

typeof DeviceMotionEvent
!== "undefined"

&&

typeof DeviceMotionEvent
.requestPermission
=== "function"

) {

DeviceMotionEvent
.requestPermission()

.then(function(response) {

if (
response === "granted"
) {

console.log(
"Motion Permission Granted"
);

}

})

.catch(console.error);

}

}


// SHAKE DETECTION

window.addEventListener(

"devicemotion",

function(event) {

if (!shakeEnabled) return;

let acceleration =

event.accelerationIncludingGravity;

if (!acceleration) return;


let total =

Math.abs(acceleration.x)
+
Math.abs(acceleration.y)
+
Math.abs(acceleration.z);


// PREVENT MULTIPLE TRIGGERS

let currentTime =
new Date().getTime();

if (

total > shakeThreshold

&&

currentTime - lastShakeTime
> 3000

) {

lastShakeTime =
currentTime;

console.log(
"📳 SHAKE DETECTED"
);

activateSOS();

}

}

);
// =============================
// 🕒 LIVE CLOCK
// =============================

function updateClock() {

    let now =
    new Date();

    let time =
    now.toLocaleTimeString();

    let date =
    now.toLocaleDateString();

    clockText.innerText =
    time + " | " + date;
}

setInterval(
    updateClock,
    1000
);

updateClock();
// =============================
// ❌ CLOSE POPUP
// =============================

closePopup.addEventListener(
    "click",
    function() {

        sosPopup.style.display =
        "none";
    }
);
smsBtn.addEventListener(
"click",
function() {

navigator.geolocation.getCurrentPosition(

function(position) {

let lat =
position.coords.latitude;

let lon =
position.coords.longitude;

let mapsLink =
"https://maps.google.com/?q="
+ lat + "," + lon;

let message =
"🚨 EMERGENCY! I need help. "
+ "My live location: "
+ mapsLink;

window.location.href =
"sms:?body="
+ encodeURIComponent(message);

}

);

}
);