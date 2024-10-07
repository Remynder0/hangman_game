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

    hangman(hangmanBlock);

    alphabet(hangmanBlock);

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

  function hangman(hangmanBlock) {
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'hangman');
    const width = (canvas.width = 800);
    const height = (canvas.height = 450);

    const ctx = canvas.getContext("2d");

    function degToRad(degrees) {
        return (degrees * Math.PI) / 180;
      }
      
    //fond
    ctx.fillStyle = " 	rgb(245,245,220)";
    ctx.fillRect(0, 0, width, height);

    //sol
    ctx.fillStyle = "rgb(107,142,35)";
    ctx.fillRect(0, height-60, width, height);

    //personnage//

    //tete
    function head(ctx){
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.arc(620, 200, 25, degToRad(0), degToRad(360), true);
        ctx.fill();
        ctx.stroke();
        
        //oeuil gauche
        ctx.beginPath();
        ctx.moveTo(610, 190);
        ctx.lineTo(615, 195);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(615, 190);
        ctx.lineTo(610, 195);
        ctx.stroke();

        //oeuil droit
        ctx.beginPath();
        ctx.moveTo(630, 190);
        ctx.lineTo(625, 195);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(625, 190);
        ctx.lineTo(630, 195);
        ctx.stroke();

        //bouche
        ctx.beginPath();
        ctx.moveTo(615, 205);
        ctx.lineTo(625, 205);
        ctx.stroke();
    }

    //corps
    function body(ctx) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.lineTo(668, 220);
        const triHeight = 80 * Math.tan(degToRad(60));
        ctx.lineTo(618, 220 + triHeight);
        ctx.lineTo(568, 220);
        ctx.lineTo(668, 220);
        ctx.fill();
        ctx.stroke();
    }

    //jambes
    function legs(ctx) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.lineTo(595, 300);
        ctx.lineTo(605, 300);
        ctx.lineTo(605, 400);
        ctx.lineTo(595, 400);
        ctx.lineTo(595, 300);

        ctx.lineTo(630, 300);
        ctx.lineTo(640, 300);
        ctx.lineTo(640, 400);
        ctx.lineTo(630, 400);
        ctx.lineTo(630, 300);
        ctx.fill();
        ctx.stroke();
    }

    //bras
    function arms(ctx) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.rotate(85 * Math.PI / 180);
            ctx.beginPath();
            ctx.fillRect(280,-645,80,15);
            ctx.strokeRect(280,-645,80,15);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.rotate(95 * Math.PI / 180);
            ctx.beginPath();
            ctx.fillRect(172,-603,80,15);
            ctx.strokeRect(172,-603,80,15);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

    }

    head(ctx);
    body(ctx);
    legs(ctx);
    arms(ctx);
    
    //corde
    ctx.fillStyle = "rgb(204,189,173)";
    ctx.strokeStyle = "rgb(53, 34, 16)";
    ctx.beginPath();
    ctx.fillRect(616,90,8,90);
    ctx.strokeRect(616,90,8,90);

    //poutre haut
    ctx.fillStyle = "rgb(91, 60, 17)";
    ctx.strokeStyle = "rgb(53, 34, 16)";
    ctx.beginPath();
    ctx.fillRect(410,80,250,25);
    ctx.strokeRect(410,80,250,25);

    //poutre vertical
    ctx.fillStyle = "rgb(91, 60, 17)";
    ctx.strokeStyle = "rgb(53, 34, 16)";
    ctx.beginPath();
    ctx.fillRect(420,80,25,350);
    ctx.strokeRect(420,80,25,350);
    
    //plancher
    ctx.fillStyle = "rgb(91, 60, 17)";
    ctx.strokeStyle = "rgb(53, 34, 16)";
    ctx.beginPath();
    ctx.fillRect(570,410,90,30);
    ctx.strokeRect(570,410,90,30);

    //vis
    ctx.fillStyle = "rgb(206, 206, 206)";
    ctx.beginPath();
    ctx.arc(432, 92, 6, degToRad(0), degToRad(360), true);
    ctx.fill();
    ctx.stroke();

    //soutien
    ctx.fillStyle = "rgb(91, 60, 17)";
    ctx.rotate(115 * Math.PI / 180);
    ctx.beginPath();
    ctx.fillRect(20,-500,-150,15);
    //ctx.strokeRect(20,-645,100,10);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    hangmanBlock.appendChild(canvas)
  }

  function alphabet(hangmanBlock) {
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

    event.currentTarget.setAttribute('style','background-color:gray')
    event.currentTarget.removeEventListener('click',letter);

}
