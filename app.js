const API_KEY = "YOUR_API_KEY";

const submitButton = document.querySelector('#submit');

const outputElement = document.querySelector('#output');

const inputElement = document.querySelector('#input');

const historyElement = document.querySelector("#history");

const newChatButton = document.querySelector("#newChat");

newChatButton.addEventListener('click', clearScreen);

function clearScreen() {
    const inputElement = document.querySelector('#input'); 
    const outputElement = document.querySelector('#output');
    outputElement.value = "";
    inputElement.value = "";

} 

function formatCodeSnippets(text) {
    
    const backtickRegex = /```([\s\S]+?)```/g;
    text = text.replace(backtickRegex, '<pre><code>$1</code></pre>');
    
    const tripleQuoteRegex = /"""([\s\S]+?)"""/g;
    text = text.replace(tripleQuoteRegex, '<pre><code>$1</code></pre>');
    
    return text;
  }

function changeInput(value) {
    const inputElement = document.querySelector('#input'); 
    inputElement.value = value;
}

async function getmessage() {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": 'application/json'
      },
      body:JSON.stringify({
        model: "gpt-3.5-turbo",
        messages:[{
          role: "user", 
          content: formatCodeSnippets(inputElement.value) // format input text as code snippets
        }],
      })
    }
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", options);
      const data = await response.json();
      outputElement.innerHTML = formatCodeSnippets(data.choices[0].message.content); // format output text as code snippets
      if(data.choices[0].message.content){
        const pElement = document.createElement('p');
        pElement.textContent = inputElement.value;
        inputElement.value = "";
        pElement.addEventListener('click', ()=> changeInput(pElement.textContent))
        historyElement.append(pElement);
      }
    } catch (error){
      console.error(error);
    }
    // apply syntax highlighting to any code snippets
    hljs.highlightAll();
    // add the snippet-box class to any pre elements containing code snippets
    outputElement.querySelectorAll("pre").forEach((el) => {
      el.classList.add("snippet-box");
    });
  }
  
  
  

submitButton.addEventListener('click',getmessage);