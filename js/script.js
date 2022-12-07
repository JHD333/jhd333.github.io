const inputText = document.getElementById('id_input');
const outputText = document.getElementById('id_output');
const submit = document.getElementById('id_submit');
const errorText = document.getElementById('id_error');

submit.onclick = function () {execute()};

function execute() {
  let jsonPar;
  outputText.value = '';
  try {
    jsonPar = JSON.parse(inputText.value);
  } catch (error) {
    log('Please enter valid JSON data.', 'red');
    console.error(`Full error is : ${error}`);
    return;
  }

  try {
    log('Fixing file ...', 'blue');
    let [fixedTxt, error] = fixJson(jsonPar);
    if (error) {
        throw error;
    }
    outputText.value = fixedTxt;
    log('Successfully altered the provided data. Please copy-paste the text below inside your <u>BaseData.json</u> and restart the server.', 'green');
  } catch (error) {
    log(error, 'red');
    return;
  }
}

function fixJson(jsonData) {
  let arrayPartConstruct = {}, arrayCompletedBase = {}, arrayFull = {}, dataFinal, errorTxt;

  // Read 'PartiallyConstructedPieces' array
  try {
    arrayPartConstruct = jsonData['PartiallyConstructedPieces'];
    arrayCompletedBase = jsonData['CompletedBasePieceHistory'];
    if (arrayPartConstruct == undefined) { // Check if 'PartiallyConstructedPieces' array exists
      throw 'PartiallyConstructedPieces" was not defined in the JSON data.'
    }
  } catch (errorFull) {
    errorTxt = 'There was an issue with the provided data. Please make sure you are using data from a valid <u>BaseData.json</u> file.';
    console.error(`Full error is : ${errorFull}`);
    return [dataFinal, errorTxt];
  }

  // Check if 'PartiallyConstructedPieces' array is empty
  if (arrayPartConstruct.length == 0) {
    errorTxt = 'There are no partially constructed objects in your <u>BaseData.json</u> file.';
    return [dataFinal, errorTxt];
  }

  // Alter indiviual object arrays
  try {
    for(let i = 0 ; i < arrayPartConstruct.length; i++) {
      if (arrayPartConstruct[i].ConstructionCompleted == undefined) { //Check if 'ConstructionCompleted' exists
        throw 'A "ConstructionCompleted" value was not defined in the array.';
      }
      if (arrayPartConstruct[i].BaseId == null) { // Check if 'BaseId' is set to null
        arrayPartConstruct[i].BaseId = arrayPartConstruct[i].ParentId.value; //Update 'BaseId' to equal 'ParentId' value
      }
      arrayPartConstruct[i].ConstructionAmount = 1; //Re-write 'ConstructionAmount' value to true
      arrayPartConstruct[i].ConstructionCompleted = true; //Re-write 'ConstructionCompleted' value to true
    }
  } catch (errorFull) {
    errorTxt = 'There was an issue with the provided data. Please make sure you are using data from a valid <u>BaseData.json</u> file.';
    console.error(`Full error is : ${errorFull}`);
    return [dataFinal, errorTxt];
  }

  // Amend “CompletedBasePieceHistory” array with data from “PartiallyConstructedPieces” array
  try {
    for(let i = 0 ; i < arrayPartConstruct.length; i++) {
      arrayCompletedBase.push(arrayPartConstruct[i]);
    }
    // Construct new array
    arrayFull['PartiallyConstructedPieces'] = [];
    arrayFull['CompletedBasePieceHistory'] = arrayCompletedBase;
    dataFinal = JSON.stringify(arrayFull);
  } catch(errorFull) {
    errorTxt = 'There was an unexpected error. Please review the console log for more details.';
    console.error(`Full error is : ${errorFull}`);
    return [dataFinal, errorTxt];
  }
  
  return [dataFinal, errorTxt];
}

function log(text, color) {
  errorText.innerHTML = text;
  errorText.style.color = color;
}
