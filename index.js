// next up: do the push to the json server to store the HOF results

// Modules
const nameDiv = document.querySelector("#name")
const missionSelectorDiv = document.querySelector("#missionSelector")
const gameDiv = document.querySelector("#game")
const playAgainDiv = document.querySelector("#playAgain")
const hallOfFameSubmission = document.querySelector("#hallOfFameSubmission")

// Grab hall of famers

fetch("http://localhost:3000/records")
.then(resp => resp.json())
.then(data => {
    const hall = document.querySelector("#hall")
    for (i in data) {
        let li = document.createElement("li")
        li.innerText = `${data[i].name}: ${data[i].time}ms, ${data[i].mission} mission`
        hall.appendChild(li)
    }
}
)

// API to get the names of the ISS people

fetch("http://api.open-notify.org/astros.json")
.then(resp => resp.json())
.then(data => {
    let issNames = []
    for (astronaut in data.people) {
        if (data.people[astronaut].craft === "ISS") {
            issNames.push(data.people[astronaut].name)
        }
    }

    let issString = issNames.join(", ")

    return missionSelectorObj = {
        "iss": `To talk to an astronaut, you'll need a signal to get to the International Space Station and back. Once it gets there, the following people will hear it: ${issString}`,
        "geo": "To talk to a satellite, you'll need a signal to get to geostationary orbit and back.",
        "moon": "To talk to the Moon Lander, you'll need a signal to get to the moon and back.",
        "mars": "To talk to a Martian, you'll need a signal to get to Mars and back."
    }
})

// Name
const nameForm = document.querySelector("#nameForm")
const nameInput = document.querySelector("#nameInput")
const missionHeader = document.querySelector("#missionHeader")

nameForm.addEventListener("submit", submitName)

function submitName(e) {
    e.preventDefault()
    missionHeader.innerText = `Welcome, ${nameInput.value}! Who do you want to talk to?`

    // Hides this module and unhides next module
    nameDiv.removeAttribute("class","active")
    nameDiv.setAttribute("class", "inactive")
    missionSelectorDiv.removeAttribute("class","inactive")
    missionSelectorDiv.setAttribute("class", "active")
}

// Mission Selector
const missionForm = document.querySelector("#missionForm")
const missionInput = document.querySelector("#missionInput")
const goalHeader = document.querySelector("#goalHeader")
const tip2 = document.querySelector("#tip2")

const tipSelectorObj = {
    "iss": "Tip #2: the International Space Station orbits 248 miles (400 kilometers) above Earth.",
    "geo": "Tip #2: geostationary orbit is 22,236 miles (35,786 kilometers) away from Earth.",
    "moon": "Tip #2: the Moon is 238,855 miles (384,400 kilometers) away from Earth.",
    "mars": "Tip #2: Mars is 33.9 million miles (54.6 million kilometers) away from Earth."
}

missionForm.addEventListener("submit", submitMission)

let goal = 0.000

function submitMission(e) {
    e.preventDefault()
    goalHeader.innerText = missionSelectorObj[missionInput.value]
    tip2.innerText = tipSelectorObj[missionInput.value]

    // Hides this module and unhides next module
    missionSelectorDiv.removeAttribute("class","active")
    missionSelectorDiv.setAttribute("class", "inactive")
    gameDiv.removeAttribute("class","inactive")
    gameDiv.setAttribute("class", "active")

    return goal = missionGoalObj[missionInput.value]

}
// Game
const clock = document.querySelector("#clock")
const ping = document.querySelector("#ping")
const scores = document.querySelector("#scores")
const resultText = document.querySelector("#resultText")

const missionGoalObj = {
    "iss": 0.003,
    "geo": 0.239,
    "moon": 2.565,
    "mars": 1935.985,
}

let number = 0

ping.addEventListener("click", startTimer)

function startTimer() {
    ping.removeEventListener("click", startTimer)
    ping.addEventListener("click", stopTimer) 

    ping.innerText = "Receive!"
    tick = setInterval(addMs,1)
}

function addMs() {
    number += 0.001;
    display = number.toString().substring(0,5)
    clock.innerText = `${display} s`;
    console.log("one tick")
}

function stopTimer() {
    clearInterval(tick);
    ping.setAttribute("class", "inactive")
    let leftover = Math.floor(Math.abs(goal - number)*1000)

    // Show and initiate new mission section

    playAgainDiv.removeAttribute("class","inactive")
    playAgainDiv.setAttribute("class", "active")

    // Result protip and HOF Submission

    if (leftover <= 25) {
        if (goal >= number) {
            resultText.innerText = `You win! You clicked "receive" only ${leftover} milliseconds ahead of the correct time.`
            hallOfFameSubmission.removeAttribute("class", "inactive")
            hallOfFameSubmission.setAttribute("class", "active")
        } else {
            resultText.innerText = `You win! You clicked "receive" only ${leftover} milliseconds behind the correct time.`
            hallOfFameSubmission.removeAttribute("class", "inactive")
            hallOfFameSubmission.setAttribute("class", "active")
        }
    } else { 
        if (goal > number) {
            resultText.innerText = `Oops, too fast. You clicked "receive" ${leftover} milliseconds early.`
        } else {
            resultText.innerText = `Oops, too slow. You clicked "receive" ${leftover} milliseconds late.`
        }
    }
}

// HOF
const hall = document.querySelector("#hall")
const addHall = document.querySelector("#addHall")

addHall.addEventListener("click", addToHall)

function addToHall() {
    let li = document.createElement("li")
    li.innerText = `${nameInput.value}: ${Math.floor(Math.abs(goal - number)*1000)}ms, ${missionInput.value} mission`

    hall.appendChild(li)
    addHall.removeEventListener("click", addToHall)
    addHall.innerText = "Submitted!"

    fetch("http://localhost:3000/records", {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": `${nameInput.value}`,
            "mission": `${missionInput.value}`,
            "time": `${Math.floor(Math.abs(goal - number)*1000)}`
        })
    })
    .then(resp => resp.json())
}

// Play Again

const sameMission = document.querySelector("#sameMission")
const newMission = document.querySelector("#newMission")

sameMission.addEventListener("click", retrySameMission)
newMission.addEventListener("click", tryNewMission)

function retrySameMission (e) {
    e.preventDefault()

    clock.innerText = `0.000 s`;
    resultText.innerText = "" 
    ping.removeAttribute("class", "inactive")
    ping.innerText = "Send!"

    playAgainDiv.removeAttribute("class","active")
    playAgainDiv.setAttribute("class", "inactive")

    hallOfFameSubmission.removeAttribute("class", "active")
    hallOfFameSubmission.setAttribute("class", "inactive")
    addHall.addEventListener("click", addToHall)
    addHall.innerText = "Yes"

    ping.removeEventListener("click", stopTimer)
    ping.addEventListener("click", startTimer)
    return number = 0
}

function tryNewMission (e) {
    clock.innerText = `0.000 s`;
    resultText.innerText = "" 
    ping.removeAttribute("class", "inactive")
    ping.innerText = "Send!"

    playAgainDiv.removeAttribute("class","active")
    playAgainDiv.setAttribute("class", "inactive")

    ping.removeEventListener("click", stopTimer)
    ping.addEventListener("click", startTimer)
    
    missionSelectorDiv.removeAttribute("class","inactive")
    missionSelectorDiv.setAttribute("class", "active")

    gameDiv.removeAttribute("class","active")
    gameDiv.setAttribute("class", "inactive")

    missionHeader.innerText = `Welcome back, ${nameInput.value}! Who else do you want to talk to?`

    return number = 0
}