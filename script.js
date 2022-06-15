const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const commands = ["read", "repeat", "next", "previous"];

const recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  const speechRecognitionList = new SpeechGrammarList();
  const grammar =
    "#JSGF V1.0; grammar commands; public <command> = " +
    commands.join(" | ") +
    " ;";
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = true;
recognition.lang = "en-GB";
recognition.interimResults = false;
recognition.maxAlternatives = 3;

const enableBtn = document.querySelector("#enable-btn");
const disableBtn = document.querySelector("#disable-btn");
const commandOutput = document.querySelector("#command-output");

enableBtn.onclick = () => {
  recognition.start();
  console.log("Speech recognition is enabled. Ready to receive command.");
};

recognition.onresult = (event) => {
  const results = event.results;
  console.log(results);
  const match = Object.values(results[results.length - 1])
    .map((result) => result.transcript)
    .find((word) => commands.includes(word.replace(" ", "")));
  commandOutput.innerHTML = match || "Command not recognised";
  console.log("Confidence: " + event.results[0][0].confidence);
};

disableBtn.onclick = () => {
  recognition.stop();
  console.log("Speech recognition is now disabled.");
};

recognition.onnomatch = () => {
  commandOutput.innerHTML = "Command not recognised";
};

recognition.onerror = (event) => {
  commandOutput.innerHTML = "There was an error: " + event.error;
};
