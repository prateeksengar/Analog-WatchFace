import { me } from "appbit";
import clock from "clock";
import document from "document";
import { today } from "user-activity";
import * as messaging from "messaging";
import * as util from "../common/utils";
import * as fs from "fs";

// Update the clock every second
clock.granularity = "seconds";

//constants
const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

//get interface elements
let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
let dateText = document.getElementById("myDate");
let monthText = document.getElementById("myMonth");
let calCount = document.getElementById("myCal");
let stepsCount = document.getElementById("mySteps");
let myBG = document.getElementById("myBG");

//load settings and apply
let settings = loadSettings();
updateBackground(settings);

//get setting event
messaging.peerSocket.onmessage = (evt) => 
{
  updateBackground(evt.data.value);
}
// Update the clock every tick event
clock.ontick = () => updateClock();


//update clock background based on preference
function updateBackground(selectedColor)
{
  switch(selectedColor) {
    case "slategray":
      myBG.href = "GreyAnalog.jpg";
      break;
    case "black":
      myBG.href = "blackAnalog.jpg";
      break;
    case "steelblue":
      myBG.href = "BlueAnalog.jpg";
      break;
    case "grey":
      myBG.href = "DenimAnalog.jpg";
      break;
    default:
      myBG.href = "blackAnalog.jpg";
  }
  settings = selectedColor;
}


// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}


//update daily activity
function updateDailyActivity()
{
  calCount.text = today.local.calories;
  stepsCount.text = today.local.steps;
}

// Display clock UI on everytick
function updateClock() {
  
  let todayDate = new Date();
  let hours = todayDate.getHours() % 12;
  let mins = todayDate.getMinutes();
  let secs = todayDate.getSeconds();
    
  dateText.text = todayDate.getDate();
  monthText.text = util.monthName[todayDate.getMonth()];
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  
  //when hour is 0 match it with 12
  if(hours == 0)
  {
    hours = 12;
  }
  
  // daily activity every 10 seconds
updateDailyActivity();

}

// Register for the unload event
me.onunload = saveSettings;

//load settings from file
function loadSettings()
{
  try{
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  }
  catch(ex)
    {
      return "black";
    }
  
}

//save selected settings into file
function saveSettings()
{
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

