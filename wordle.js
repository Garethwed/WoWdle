let width = 5; // letters per row
let height = 6 // 6 attempts to guess;
let grid = [];
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
tileSizes = ['60px', '50px','45px']

//let word = WORDS[Math.floor(Math.random() * WORDS.length)];
let WORDS = loadWords();
let VALIDWORDS = loadValidWords();
let word = '';



async function loadWords(){
    const response = await fetch('./wowWords.txt');
    const text = await response.text();
    WORDS = text.split(/\r?\n/);
    let RandomSeed = rand_from_seed(~~((new Date)/86400000)); //86400000 = ms in 1 day
    let rand = Math.abs(Math.sin(RandomSeed++));
    //onsole.log("index : " + Math.floor(rand * WORDS.length));
    //word = WORDS[0].toUpperCase();
    
    word = WORDS[Math.floor(rand * WORDS.length)]; 
    word = word.toUpperCase();
    

    //console.log(word);
    width = word.length;
    return WORDS;

}
async function loadValidWords(){
    const response = await fetch('./wordleWords.txt');
    const text = await response.text();
    VALIDWORDS = text.split(/\r?\n/);
}

window.onload = function() {



    setup();
}

function setup() {
    //merge valid words and possible guess word arrays to check if current guess is valid
    VALIDWORDS = VALIDWORDS.concat(WORDS);
    //create grid
    for (let i=0 ;i< height;i++){
        for (let j =0;j< width;j++){
            let tile = document.createElement("div");
            tile.id = i + "-" + j;
            tile.classList.add("tile");
            tile.style.width =  tileSizes[word.length-5];
            tile.style.height = tileSizes[word.length-5];
            grid.push(tile);
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);

        }

    }

    document.addEventListener("keyup",(e) => {
        if (gameOver){
            return;
        }
        //alert(e.code);
        processKey(e);
        

    })
}
function processKey(e){
    console.log(e);
    if ("KeyA" <= e.code && e.code <="KeyZ"){
        if (currentCol < width) {
            
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentCol.toString());
            if (currentTile.innerText == ""){
                currentTile.innerText = e.code[3];
                
                currentCol +=1;
            }

        }
    }
    if (e.code =="Backspace"){
        if (currentCol >0){
            currentCol -=1;
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentCol.toString());
            currentTile.innerText = "";
        }
    }
    if (e.code == "Enter"){
        if (currentCol == width){
            //check to make sure current word is valid     
            let currentWord = '';
            for (let c = 0;c<width;c++){
                currentWord += document.getElementById(currentRow.toString() + "-" + c.toString()).innerText;
                    
            }
            console.log("Current word: " + currentWord);
            currentWord = currentWord.toLowerCase();
            //console.log(VALIDWORDS.includes(currentWord.toLowerCase()));
            if (!VALIDWORDS.includes(currentWord)){
                alert ("please enter a valid word");
            }
            else {
                submitGuess();
                currentRow +=1;
                currentCol = 0;

            }

        
        }
        if (currentRow == height){
            gameOver = true;
            document.getElementById("ans").innerText = "Word = " + word;

        }
    }

}

function rand_from_seed(x, iterations){
    iterations = iterations || 100;
    for(var i = 0; i < iterations; i++)
      x = (x ^ (x << 1) ^ (x >> 1)) % 10000;
    return x;
}
function randWithSeed(seed){
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function keyPressed(key){
    //add functionality to onscreen
    //console.log(key);
    key ="Key"+ key.toUpperCase();
    if (key == "KeyENTER"){
        document.dispatchEvent(new KeyboardEvent("keyup",{'code' : "Enter"},));

    }
    else{
        document.dispatchEvent(new KeyboardEvent("keyup",{'code' : key},));
    }
    
    

    
}
function flipTile(tile, rowpos){
    //runs animation for each tile when submitting;
    tile.classList.add("flip");
    tile.style.animationDelay = 0.2*rowpos + "s";

}


function submitGuess(){
    let correct = 0;
    //checks for duplicate letters and colours them accordingly
    // eg/ only 1 A in word so 2nd instance of A should be gray
    let letterCount = {}; //APPLE -> A:1 P:2 
    for (let i = 0; i <word.length;i++){
        letter = word[i];
        if(letterCount[letter]){
            letterCount[letter]  +=1;

        }
        else {
            letterCount[letter] = 1;
        }
    }
    //check correct letters
    for (let c = 0;c<width;c++){
        let currentTile = document.getElementById(currentRow.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        flipTile(currentTile,c);
        if (letter == word[c]){
            currentTile.classList.add("correct");
            document.getElementById("" + letter.toLowerCase()).classList.remove("present");
            document.getElementById("" + letter.toLowerCase()).classList.add("correct");
            correct +=1;
            letterCount[letter] -=1;
            
        }
        if (correct == width){
            gameOver = true;
            document.getElementById("ans").innerText = "Word = " + word;
            //alert("you won");
        }
        

    }

    //check again but see which letters are present but in wrong position
    for (let c = 0;c<width;c++){
        let currentTile = document.getElementById(currentRow.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        flipTile(currentTile,c);

        if (!currentTile.classList.contains("correct")) {

        
            if (word.includes(letter) && letterCount[letter] > 0){
                currentTile.classList.add("present");
                document.getElementById("" + letter.toLowerCase()).classList.add("present");
                letterCount[letter] -=1;
                
            }
            else {
                currentTile.classList.add("absent");
                document.getElementById("" + letter.toLowerCase()).classList.add("absent");
            }
        }
        
    }

}