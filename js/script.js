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
    console.error(`Full error is : ${error}`);
    return;
  }

  try {
    log("Fixing file ...", "blue");
    let [fixedText, error] = fixJson(jsoned);
    if (error) {
        throw error;
    }
    outputText.value = fixedText;
    log("Successfully altered the provided data. Please copy-paste the text below inside your <u>BaseData.json</u> and restart the server.", "green");
  } catch (error) {
    log(error, "red");
    console.error(`Full error is : ${error}`);
    return;
  }
}

function fixJson(jsonData) {
  let arrayPartConstruct = {}, arrayCompletedBase = {}, arrayFull = {}, dataFinal, errorTxt;

  // Read "PartiallyConstructedPieces" array
  try {
    arrayPartConstruct = jsonData["PartiallyConstructedPieces"];
    arrayCompletedBase = jsonData["CompletedBasePieceHistory"];
  } catch(error) {
      errorTxt = "There was an issue with the provided data. Please make sure you are using data from a valid <u>BaseData.json</u> file.";
      console.error(`Full error is : ${error}`);
      return [dataFinal, errorTxt];
  }

  // Re-write "ConstructionCompleted" value to true
  try {
    for(let i = 0 ; i < arrayPartConstruct.length; i++) {
      arrayPartConstruct[i].ConstructionCompleted = true;
    }
  } catch (error) {
    errorTxt = "There was an issue with the provided data. Please make sure you are using data from a valid <u>BaseData.json</u> file.";
    console.error(`Full error is : ${error}`);
    return [dataFinal, errorTxt];
  }

  // Amend “CompletedBasePieceHistory” array with data from “PartiallyConstructedPieces” array
  try {
    for(let i = 0 ; i < arrayPartConstruct.length; i++) {
      arrayCompletedBase.push(arrayPartConstruct[i]);
    }
  } catch(error) {
    errorTxt = "There was an unexpected error. Please review the console log for more details.";
    console.error(`Full error is : ${error}`);
    return [dataFinal, errorTxt];
  }

  // Construct new array
  try {
    arrayFull["PartiallyConstructedPieces"] = [];
    arrayFull["CompletedBasePieceHistory"] = arrayCompletedBase;
  } catch (error) {
    errorTxt = "There was an unexpected error. Please review the console log for more details.";
    console.error(`Full error is : ${error}`);
    return [dataFinal, errorTxt];
  }

  try {
    dataFinal = JSON.stringify(arrayFull);
  } catch(error) {
    errorTxt = "There was an unexpected error. Please review the console log for more details.";
    console.error(`Full error is : ${error}`);
    return [dataFinal, errorTxt];
  }

  return [dataFinal, errorTxt];
}

function log(text, color) {
  errorText.innerHTML = text;
  errorText.style.color = color;
}
