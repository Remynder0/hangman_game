function init() {
    let soloMode = document.getElementById('solo');
    soloMode.addEventListener('click',solo);
    let multiMode = document.getElementById('multi');
    multiMode.addEventListener('click',multi);
    
}

function multi() {
    let form = document.getElementById("form-multi");
    form.setAttribute('style', 'display : block');
    let buttons = document.querySelectorAll('main button');
    buttons.forEach(function(button) {
        button.setAttribute('style', 'display : none');
      });

    document.getElementById("submit-word").addEventListener('click', formMulti);
    console.log('ok');
}

function solo() {
    let form = document.getElementById("form-solo");
    form.setAttribute('style', 'display : block');
    let button = document.querySelectorAll('main button');
    button.setAttribute('style', 'display : none');

    document.getElementById("submit-number").addEventListener('click', formSolo);
    console.log('ok');
}




function formMulti(event) {

    const errorWord = document.getElementById("error-word");

    if (!(word.value.trim())){
        errorWord.textContent = 'Choose a word';
        event.preventDefault();
    }
    else {
        let form = document.getElementById("form-multi");
        form.setAttribute('style', 'display : none');

        const input=document.getElementsByTagName("input")
        let word = input.namedItem("word");
        console.log(word.value);
    }
}


function formSolo() {
    let form = document.getElementById("form-solo");
    form.setAttribute('style', 'display : block');

    const input=document.getElementsByTagName("input")
    let number = input.namedItem("number");
    console.log(number.value);

}

