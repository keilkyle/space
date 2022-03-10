const clock = document.querySelector("#clock")
const ping = document.querySelector("#ping")
const scores = document.querySelector("#scores")
const helperText = document.querySelector("#helperText")

let number = 0
let goal = 0.239

ping.addEventListener("click", startTimer)

function startTimer() {
    ping.removeEventListener("click", startTimer)
    ping.addEventListener("click", stopTimer) 

    ping.innerText = "Received!"
    tick = setInterval(addMs,1)
}

function addMs() {
    number += 0.001;
    display = number.toString().substring(0,5)
    clock.innerText = `${display} ms`;
    console.log("one tick")
}

function stopTimer() {
    clearInterval(tick);
    ping.remove()
    let leftover = Math.floor(Math.abs(goal - number)*1000)
    helperText.innerText = `Only ${leftover} milliseconds off!`
}