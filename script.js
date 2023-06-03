function init() {
    let soloMode = document.getElementById('solo');
    soloMode.addEventListener('click',solo);
    let multiMode = document.getElementById('multi');
    multiMode.addEventListener('click',multi);
    
}

function multi() {
    let block = document.getElementById("block-multi");
    block.setAttribute('style', 'display : block');
    let buttons = document.querySelectorAll('main button');
    buttons.forEach(function(button) {
        button.setAttribute('style', 'display : none');
      });

    document.getElementById("submit-word").addEventListener('click', formMulti);
}

function solo() {
    let block = document.getElementById("block-solo");
    block.setAttribute('style', 'display : block');
    let buttons = document.querySelectorAll('main button');
    buttons.forEach(function(button) {
        button.setAttribute('style', 'display : none');
      });

    document.getElementById("submit-number").addEventListener('click', formSolo);
}




function formMulti(event) {

    const errorWord = document.getElementById("error-word");

    if (!(word.value.trim())){
        errorWord.textContent = 'Choose a word';
        event.preventDefault();
    }
    else {

        const input=document.getElementsByTagName("input")
        let word = input.namedItem("word");
        console.log(word.value);
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en/'.concat('',word.value), true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('ok')
                let data = JSON.parse(xhr.response);
                makeHangman(data[0]);
                
                let block = document.getElementById("block-multi");
                block.setAttribute('style', 'display : none');
                
            }
            else if (xhr.status === 404) {
                errorWord.textContent = 'Word not found';
                word.value = '';
                event.preventDefault();
            }
            else {
                errorWord.textContent = 'Something went wrong';
                word.value = '';
                event.preventDefault();
            }
        }
        xhr.send();
    }
    
}


function formSolo(event) {
    let block = document.getElementById("block-solo");
    block.setAttribute('style', 'display : block');

    const input=document.getElementsByTagName("input")
    let number = input.namedItem("number");
    console.log(number.value);
    fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
    .then(response => response.text())
    .then(data => {
        const words = data.split('\n');
        const wordsNumber = words.filter(word => word.length === parseInt(number.value));
        const wordRandom = wordsNumber[Math.floor(Math.random() * wordsNumber.length)];
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en/'.concat('',wordRandom), true);
        xhr.onreadystatechange = function () {
            console.log('ok')
            if (xhr.status !== 200) {
                const wordRandom = wordsNumber[Math.floor(Math.random() * wordsNumber.length)];
                console.log(wordRandom);
                event.preventDefault();
            }
        }
        console.log('kong')
        makeHangman(wordRandom);    
        xhr.send();  
    })
    .catch(error => {
        console.log(error);
    });  

}

function makeHangman(data) {
    let hangmanBlock = document.createElement('div');
    let hangman = document.createElement('h1');
    hangman.textContent = data.word;
    hangmanBlock.appendChild(hangman);
    hangmanBlock.setAttribute('style', 'display : block');
    document.querySelector("main").appendChild(hangmanBlock);
}