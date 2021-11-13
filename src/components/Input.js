import React,{useRef, useEffect} from "react";

const textData = require("./data.json")


const Input = () => {
    const userInput = useRef(null);
    // var text = ["test ", "testing."]
    var text = chooseRandomText();
    var textString = "";
    var targetWord = text[0];
    var textComplete = false;
    var started = false;
    var startTime;
    var typedWords = 0;
    var wpm = 0;

    function newTextButtonClick(){
        text = chooseRandomText();
        document.getElementById('mytext').innerHTML = updateDisplayString();
        targetWord = text[0];
        started = false;
        typedWords = 0;
        wpm = 0;
    }

    function chooseRandomText(){
        textComplete = false
        started = false;
        const threshold = .2;
        var easiness= 0;
        var index = 0;
        // if(userInput.current.value){userInput.current.value = "";}
        // userInput.current.value = ""
        while(easiness<threshold){
            index = Math.floor(Math.random()*7411);
            easiness = textData[index][1]
        }
        var imported = textData[index][0];
        imported = imported.split(" ");
        for (const word in imported){
            if (parseInt(word)!==parseInt(imported.length)-1){
                imported[word] += " ";            }
        }
        return imported
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

        //text has been typed completely
        else if (typed === text[text.length-1]){
            typedWords += 1
            wpm = calculateWPM(performance.now());
            document.getElementById("controller").innerHTML = "speed: " + wpm.toFixed(2);
            textComplete = true;
            text.splice(0,1)
            userInput.current.value = "";
            updateDisplayString();
            document.getElementById('mytext').innerHTML = "";
        }
        //word has been typed correctly -- remove it from array, change target word
        else if(targetWord === typed){
            typedWords += 1;
            wpm = calculateWPM(performance.now());
            document.getElementById("controller").innerHTML = "speed: " + wpm.toFixed(2);
            text.splice(0,1)
            userInput.current.value = "";
            targetWord = text[0];
            updateDisplayString();
            document.getElementById('mytext').innerHTML = textString;
        }
        //word is correct so far
        else if (targetWord.substring(0,typed.length) === typed){ 
            userInput.current.sytle = ""
            style.backgroundColor = "antiquewhite";
        }
        //word is incorrect
        else{
            style.backgroundColor = "#f47174";//change text box color when word is wrong
        }
    }

    useEffect(() => {   //focuses input box whenever key is pressed
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
            <div id="controller" className="statContainer">{"speed: " + wpm}</div>
            <div className='inputContainer'>
                <input ref={userInput} id = "input" className = "inputBox" type="text" onChange={handleInput} />
                <div className='textBox' id = "mytext">{updateDisplayString()}</div>
            </div>
            <div id="controller" className="statContainer"> 
                <button onClick={newTextButtonClick}>New Text</button>
            </div>
        </div>


        <div tabIndex="0">
        </div>
        </>
    )
}
export default Input;




