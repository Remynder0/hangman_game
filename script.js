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
    console.log(parseInt(number.value)+1);
    fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
    .then(response => response.text())
    .then(data => {
        const words = data.split('\n');
        const wordsNumber = words.filter(word => word.length === parseInt(number.value)+1);
        let wordsList = [];

        for (let i = 0; i < 10; i++) {
            let wordRandom = wordsNumber[Math.floor(Math.random() * wordsNumber.length)];
            wordsList.push(wordRandom);
          }
        
        findWordsWithLength(wordsList);
        block.setAttribute('style', 'display : none');

    })
    /*.catch(error => {
        console.log(error);
    });*/
    

}

function makeHangman(data) {
    let hangmanBlock = document.createElement('div');
    

    // stockage du mot dans le stockage navigateur
    sessionStorage.setItem('word',data.word)

    // creation du mot  avec les blancs
    let sectionWord = document.createElement('section');
    sectionWord.setAttribute('id', 'word_section')

    let firstLetter = document.createElement('span');
    firstLetter.textContent = data.word[0].toUpperCase();
    firstLetter.setAttribute('id', '0');
    sectionWord.appendChild(firstLetter);


    for (let i = 1; i < data.word.length; i++) {
        let blank=document.createElement('span');
        blank.setAttribute('id', i);
        sectionWord.appendChild(blank);
    
    }

    hangmanBlock.appendChild(sectionWord);


    // bouton de l'alphabet
    let sectionButton = document.createElement('section');
    sectionButton.setAttribute('id', 'button_section');
    hangmanBlock.setAttribute('style', 'display : block');
    const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    for (let i = 0; i < alpha.length; i++) {
        let button = document.createElement('button');
        button.textContent = alpha[i];
        button.setAttribute('name', alpha[i].toLowerCase());
        button.addEventListener('click',letter);
        sectionButton.appendChild(button);
        hangmanBlock.appendChild(sectionButton);

    }


    document.querySelector("main").appendChild(hangmanBlock);
}


  function findWordsWithLength(words, index = 0) {

    
    const word = words[index];
    const xhr = new XMLHttpRequest();
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            makeHangman(response[0]);
          // Appeler la fonction récursivement pour la prochaine longueur
        } else {
            findWordsWithLength(words, index +1);
            console.error('Unknow word :', word);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }
  


function letter(event){
    console.log(event.currentTarget.getAttribute('name'));
    let actualLetter = event.currentTarget.getAttribute('name');
    let word = sessionStorage.getItem('word');

    if(word.includes(actualLetter)){
        console.log('ok1');
        for (let i = 0; i < word.length; i++) {
            if (word[i] === actualLetter){
                console.log(word[i]);
                let letter = document.getElementById(i)
                if (letter.id !== '0') {
                    console.log('ok2');
                    if (letter.textContent !== ''){
                        console.log('ko2');       
                    }
                    else{
                        console.log('ok3');
                        letter.textContent = actualLetter.toUpperCase();
                    }
                }
            }
        }
    }

    else {
        console.log('ko1');
    }

}
