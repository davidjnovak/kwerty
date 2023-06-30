import React,{useRef, useEffect} from "react";

const textData = require("../data/data.json")

const Input = () => {
    const userInput = useRef(null);
    const NUMBER_OF_TEXTS = 7411;
    var text = chooseRandomText();
    var textString = "";
    var targetWord = text[0];
    var textComplete = false;
    var started = false;
    var startTime;
    var typedWords = 0;
    var wpm = 0;

    function updateText(text){
        document.getElementById('quote').innerHTML = text;
    }

    function updateScore(score){
        document.getElementById('score').innerHTML = score;
    }

    function textOfTheDayButtonClick(){
        text = fetchQuoteOfTheDay();
        updateText(updateDisplayString());
        targetWord = text[0];
        started = false;
        typedWords = 0;
        wpm = 0;
    }

    function newTextButtonClick(){
        text = chooseRandomText();
        updateText(updateDisplayString());
        targetWord = text[0];
        started = false;
        typedWords = 0;
        wpm = 0;
    }

    function getDailyIndex() {
        const currentDate = new Date().toLocaleDateString();
        const totalTexts = Object.keys(textData).length;
      
        let seed = 0;
        console.log(currentDate);
        for (let i = 0; i < currentDate.length; i++) {
          seed += currentDate.charCodeAt(i);
          console.log(currentDate.charCodeAt(i));
        }
        const randomIndex = Math.floor((seed % totalTexts) + 1);
        return randomIndex;
      }
      
    function fetchQuoteOfTheDay(){
        textComplete = false;
        started = false;
        var imported = textData[getDailyIndex()][0];
        var wordList = imported.split(" ");
        const lastWordIndex = wordList.length - 1;
        const updatedWordList = wordList.map((word, index) => {
          if (index !== lastWordIndex) {
            return word + " ";
          }
          return word;
        });
        return updatedWordList
    }


    function chooseRandomText(){
        textComplete = false
        started = false;
        const difficultyThreshold = .2;
        var textDifficulty;
        var index;   
        index = Math.floor(Math.random() * NUMBER_OF_TEXTS);     
        // while(textDifficulty < difficultyThreshold){ 
        //     index = Math.floor(Math.random() * NUMBER_OF_TEXTS);
        //     textDifficulty = textData[index][1]
        // }
        var imported = textData[index][0];
        var wordList = imported.split(" ");
        const lastWordIndex = wordList.length - 1;
        const updatedWordList = wordList.map((word, index) => {
          if (index !== lastWordIndex) {
            return word + " ";
          }
          return word;
        });
        return updatedWordList
    }

    function updateDisplayString(){
        textString = ""
        for (const word in text){
            textString += text[word]
        }
        return textString;
    }

    function calculateWPM(endTime){
        return (60000*typedWords/(parseFloat(endTime)-startTime));
    }

    function handleInput(){
        const typed = userInput.current.value
        const style = userInput.current.style

        if(textComplete){
            return;
        }
        if (started === false){
            started = true;
            startTime = performance.now();
            typedWords = 0
        }
        else if (typed === text[text.length-1]){
            typedWords += 1
            wpm = calculateWPM(performance.now());
            updateScore(wpm.toFixed(2) + " wpm");
            textComplete = true;
            text.splice(0,1)
            userInput.current.value = "";
            updateDisplayString();
            updateText("");
        }
        //word has been typed correctly -- remove it from array, change target word
        else if(targetWord === typed){
            typedWords += 1;
            wpm = calculateWPM(performance.now());
            updateScore("speed: " + wpm.toFixed(2));
            text.splice(0,1)
            userInput.current.value = "";
            targetWord = text[0];
            updateDisplayString();
            updateText(textString);
        }
        else if (targetWord.substring(0,typed.length) === typed){ 
            userInput.current.sytle = ""
            style.backgroundColor = "antiquewhite";
        }
        else{
            style.backgroundColor = "#f47174";
        }
    }

    useEffect(() => {
        function handleKeyPress(e) {
          userInput.current.focus();
        }
        document.addEventListener("keypress", handleKeyPress);
    
        return function cleanup() {
          document.removeEventListener("keypress", handleKeyPress);
        };
      }, []);

    return (
        <>
        <div className="firstRow"> 
            <div id="score" className="statContainer">{"speed: " + wpm}</div>
            <div className='inputContainer'>
                <input ref={userInput} id = "input" className = "inputBox" type="text" onChange={handleInput} />
                <div className='textBox' id = "quote">{updateDisplayString()}</div>
            </div>
            <div id="score" className="statContainer"> 
                <button className='button' onClick={newTextButtonClick}>New Text</button>
                <button className='button' onClick={textOfTheDayButtonClick}>Text of the Day</button>
            </div>
        </div>


        <div tabIndex="0">
        </div>
        </>
    )
}
export default Input;




