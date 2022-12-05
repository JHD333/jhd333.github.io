const inputText = document.getElementById("id_input");
const outputText = document.getElementById("id_output");
const submit = document.getElementById("id_submit");
const errorText = document.getElementById("id_error");

submit.onclick = function () {execute()};

function execute() {
  let jsoned;
  outputText.value = "";
  try {
    jsoned = JSON.parse(inputText.value);
  } catch (error) {
    log("Please enter valid JSON data.", "red");
  }

  try {
    log("Fixing file ...", "blue");
    let [fixedText, status] = fixJson(jsoned);
    if (status) {
      log("There was an error. See console for details.", "red");
      return;
    }
    outputText.value = fixedText;
    log("Successfully altered file, now copy-paste this text inside your <u>BaseData.json</u> and restart the server.", "green");
  } catch (error) {
    log("Please enter valid JSON data.", "red");
  }
}

function fixJson(jsonData) {
  let arrayPartConstruct = {}, arrayCompletedBase = {}, arrayFull = {}, dataFinal, status = 0;

  // Read "PartiallyConstructedPieces" array
  try {
    arrayPartConstruct = jsonData["PartiallyConstructedPieces"];
    arrayCompletedBase = jsonData["CompletedBasePieceHistory"];
  } catch(error) {
      status = 1;
      console.error(`Full error is : ${error}`);
      return [dataFinal, status];
  }

  // Re-write "ConstructionCompleted" value to true
  try {
    for(let i = 0 ; i < arrayPartConstruct.length; i++) {
      arrayPartConstruct[i].ConstructionCompleted = true;
    }
  } catch (error) {
    status = 1;
    console.error(`Full error is : ${error}`);
    return [dataFinal, status];
  }

  // Amend “CompletedBasePieceHistory” array with data from “PartiallyConstructedPieces” array
  try {
    for(let i = 0 ; i < arrayPartConstruct.length; i++) {
      arrayCompletedBase.push(arrayPartConstruct[i]);
    }
  } catch(error) {
    status = 1;
    console.error(`Full error is : ${error}`);
    return [dataFinal, status];
  }

  // Construct new array
  try {
    arrayFull["PartiallyConstructedPieces"] = [];
    arrayFull["CompletedBasePieceHistory"] = arrayCompletedBase;
  } catch (error) {
    status = 1;
    console.error(`Full error is : ${error}`);
    return [dataFinal, status];
  }

  try {
    dataFinal = JSON.stringify(arrayFull);
  } catch(error) {
    status = 1;
    console.error(`Full error is : ${error}`);
    return [dataFinal, status];
  }

  return [dataFinal, status];
}

function log(text, color) {
  errorText.innerHTML = text;
  errorText.style.color = color;
}
