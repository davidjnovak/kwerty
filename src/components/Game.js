import React, { Component } from "react";
import textData from "../data/data.json";

class Game extends Component {
  constructor(props) {
    super(props);

    this.userInput = React.createRef();
    this.NUMBER_OF_TEXTS = 7411;
    this.text = this.chooseRandomText();
    this.textString = "";
    this.targetWord = this.text[0];
    this.textComplete = false;
    this.started = false;
    this.typedWords = 0;
    this.startTime = null;
    this.wpm = 0;
  }

  updateText(text) {
    document.getElementById("quote").innerHTML = text;
  }

  updateScore(score) {
    document.getElementById("score").innerHTML = score;
  }

  textOfTheDayButtonClick = () => {
    this.text = this.fetchQuoteOfTheDay();
    this.updateText(this.updateDisplayString());
    this.targetWord = this.text[0];
    this.started = false;
    this.typedWords = 0;
    this.wpm = 0;
  };

  newTextButtonClick = () => {
    this.text = this.chooseRandomText();
    this.updateText(this.updateDisplayString());
    this.targetWord = this.text[0];
    this.started = false;
    this.typedWords = 0;
    this.wpm = 0;
  };

  getDailyIndex() {
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

  fetchQuoteOfTheDay() {
    this.textComplete = false;
    this.started = false;
    var imported = textData[this.getDailyIndex()][0];
    var wordList = imported.split(" ");
    const lastWordIndex = wordList.length - 1;
    const updatedWordList = wordList.map((word, index) => {
      if (index !== lastWordIndex) {
        return word + " ";
      }
      return word;
    });
    return updatedWordList;
  }

  chooseRandomText() {
    this.textComplete = false;
    this.started = false;
    const difficultyThreshold = 0.2;
    var textDifficulty;
    var index;
    index = Math.floor(Math.random() * this.NUMBER_OF_TEXTS);
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
    return updatedWordList;
  }

  updateDisplayString() {
    this.textString = "";
    for (const word in this.text) {
      this.textString += this.text[word];
    }
    return this.textString;
  }

  calculateWPM(endTime) {
    return (60000 * this.typedWords) / (parseFloat(endTime) - this.startTime);
  }

  handleInput = () => {
    const typed = this.userInput.current.value;
    const style = this.userInput.current.style;

    if (this.textComplete) {
      return;
    }
    if (this.started === false) {
      this.started = true;
      this.startTime = performance.now();
      this.typedWords = 0;
    } else if (typed === this.text[this.text.length - 1]) {
      this.typedWords += 1;
      this.wpm = this.calculateWPM(performance.now());
      this.updateScore(this.wpm.toFixed(1) + " wpm");
      this.textComplete = true;
      this.text.splice(0, 1);
      this.userInput.current.value = "";
      this.updateDisplayString();
      this.updateText("");
    }
    //word has been typed correctly -- remove it from array, change target word
    else if (this.targetWord === typed) {
      this.typedWords += 1;
      this.wpm = this.calculateWPM(performance.now());
      this.updateScore("speed: " + this.wpm.toFixed(1));
      this.text.splice(0, 1);
      this.userInput.current.value = "";
      this.targetWord = this.text[0];
      this.updateDisplayString();
      this.updateText(this.textString);
    } else if (this.targetWord.substring(0, typed.length) === typed) {
      this.userInput.current.sytle = "";
      style.backgroundColor = "antiquewhite";
    } else {
      style.backgroundColor = "#f47174";
    }
  };

  componentDidMount() {
    const handleKeyPress = (e) => {
      this.userInput.current.focus();
    };
    document.addEventListener("keypress", handleKeyPress);

    this.cleanup = () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }

  componentWillUnmount() {
    this.cleanup();
  }

  render() {
    return (
      <>
        <div className="firstRow">
          <div className="inputContainer">
            <input
              ref={this.userInput}
              id="input"
              className="inputBox"
              type="text"
              onChange={this.handleInput}
            />
            <div className="textBox" id="quote">
              {this.updateDisplayString()}
            </div>
            <div id="score" className="statContainer">
              {"speed: " + this.wpm}
            </div>
          </div>
          <div id="score" className="statContainer">
            <button className="button" onClick={this.newTextButtonClick}>
              New Text
            </button>
            <button
              className="button"
              onClick={this.textOfTheDayButtonClick}
            >
              Text of the Day
            </button>
          </div>
        </div>

        <div tabIndex="0"></div>
      </>
    );
  }
}

export default Game;
