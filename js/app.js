//Global Variables (Accessable by multiple functions)
let timer;
let winningCount = 0;
let clickNumber = 0;
//Global Nodes (Accessable by multiple functions)
const dialog = document.querySelector('dialog');
const restart = document.querySelector('.restart');
const stars = document.querySelectorAll('.stars li i');
//Adding Event listeners
restart.addEventListener('click', initilizeGame);

/**
this is the main function which initilize the first/new game
*/
function initilizeGame() {
  resetGame();
  showAllCards();
  this.style.display='none';
  shuffle()
  setTimeout(coverCards, 2000);
  gameBegin();
}

/**
game core logic after the game is initilized
*/
function gameStart() {
  let openedCard = [];
  let cardOpened = 0;
  let clicked = false;
  const Cards = document.querySelectorAll('.card');
  Cards.forEach(element => {
    element.addEventListener('click', function(event) {
      if(element.id != "Clicked"){ // checks if there is an open card already
        setStars();
        console.log(stars);
        cardOpened++;
        clickNumber++;
        document.querySelector(".moves").innerHTML = clickNumber;
        if(cardOpened == 1){ //first open card
          element.classList = 'card show open';
          element.setAttribute("id", "Clicked");
          openedCard.push(element);
        }
        if(cardOpened == 2 ){ //Second opened card
          element.classList = 'card show open';
          element.setAttribute("id", "Clicked");
          openedCard.push(element);
          console.log(openedCard);
          if(verify(openedCard)){ //verify if open cards are matched and keep them opened
            winningCount++;
            console.log(winningCount);
            openedCard.pop().classList = 'card show open match';
            openedCard.pop().classList = 'card show open match';
          }else{
            coverSelected(openedCard.pop(),openedCard.pop());
          }
          cardOpened=0;
        }

      }else{
      //do nothing if the user clicked on already opened card
      }
    })
  });
}

/**
this function updates the star rating for the player by the number of clicks
*/
function setStars(){
  switch(true){
    case clickNumber<=20 && clickNumber>0 :
    stars[0].classList = 'fa fa-star';
    stars[1].classList = 'fa fa-star';
    stars[2].classList = 'fa fa-star';
    break;
    case clickNumber<=30 && clickNumber>21:
    stars[0].classList = 'fa fa-star';
    stars[1].classList = 'fa fa-star';
    stars[2].classList = 'fa fa-star-half';
    break;
    case clickNumber<=36 && clickNumber>31:
    stars[0].classList = 'fa fa-star';
    stars[1].classList = 'fa fa-star';
    stars[2].classList = '';
    break;
    case clickNumber<=44 && clickNumber>37:
    stars[0].classList = 'fa fa-star';
    stars[1].classList = 'fa fa-star-half';
    stars[2].classList = '';
    break;
    case clickNumber<=50 && clickNumber>45:
    stars[0].classList = 'fa fa-star';
    stars[1].classList = '';
    stars[2].classList = '';
    break;
    case clickNumber>51:
    stars[0].classList = 'fa fa-star-half';
    stars[1].classList = '';
    stars[2].classList = '';
    break;
  }
}

/**
this function verify the two selected cards of they matches or not and return true of false
*/
function verify(openedCard){
  if(openedCard[0].innerHTML == openedCard[1].innerHTML){
    console.log("Matched!");
    return true;
  }else{
    return false;
  }
}

/**
in case the player wants to play again or reset the game this function clear the previous game data
*/
function resetGame(){
  dialog.innerHTML = '';
  dialog.close();
  clearInterval(timer)
  timer=null;
  winningCount=0;
  clickNumber=0;
  stars[0].classList = 'fa fa-star';
  stars[1].classList = 'fa fa-star';
  stars[2].classList = 'fa fa-star';
  document.querySelector(".timer").innerHTML = "60";
  document.querySelector(".moves").innerHTML = "0";
  const Cards = document.querySelectorAll('.card');
  // Change the class of multiple cards with a loop
  Cards.forEach(element => {
    element.classList = 'card open show';
    element.removeAttribute("id");
  });
}

/**
this fucntion shuffle the cards nodelist
Stack Overflow Credit to : Yair Even Or
*/
function shuffle() {
  let ul = document.querySelector(".deck"), // get the list
  temp = ul.cloneNode(true); // clone the list
  // shuffle the cloned list (better performance)
  for (let i = temp.children.length + 1; i--; ){
    temp.appendChild( temp.children[Math.random() * i |0] );
  }
  ul.parentNode.replaceChild(temp, ul); // copy shuffled back to 'ul'
}

/**
Show all cards
*/
function showAllCards() {
  const Cards = document.querySelectorAll('.card');
  // Change the class of multiple cards with a loop
  Cards.forEach(element => {
    element.classList = 'card open show';
  });
}

/**
Cover all the cards
*/
function coverCards() {
  const Cards = document.querySelectorAll('.card');
  // Change the class of multiple cards with a loop
  Cards.forEach(element => {
    element.classList = 'card close';
  });
  restart.style.display='';
  startTimer();
}

/**
https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
Display the shuffled cards for few seconds before the game starts and cards are flipped
*/
async function gameBegin() {
  await sleep(2000);
  gameStart();
}

/**
This Function covers the selected cards incase they are not matching
*/
async function coverSelected(element1,element2) {
  await sleep(1000);
  element1.removeAttribute("id");
  element2.removeAttribute("id");
  element1.classList = 'card';
  element2.classList = 'card';
}

/**
Start the timer and check for game status then call the finish dialog and pass time and clicks number
*/
function startTimer(){
  let counter = 60;
  if(!timer){
    timer = setInterval(function() {
      counter--;
      document.querySelector(".timer").innerHTML = counter;
      console.log(counter);
      if (counter >= 0 && winningCount == 8) {
        console.log("Winner:"+ counter +" , "+ clickNumber); //Replace with winning screen
        dialog.show();
        winner(counter,clickNumber);
        clearInterval(timer);
      }

      if (counter === 0) {
        console.log("Game Over"); //Replace with Losing screen
        dialog.show();
        gameOver(counter,clickNumber);
        clearInterval(timer);
      }
    }, 1000);
  }

}

/**
Create the content of Winning Dialog and display it to the player
*/
function winner(counter,clickNumber){
  let btn = document.createElement("BUTTON");
  btn.innerText = "Play Again!";
  btn.classList = 'button';
  btn.addEventListener("click", initilizeGame);
  dialog.setAttribute("style", "height:30%;");
  dialog.innerHTML = '<h2> Winner winner chicken dinner! </h2>'+
  '<h3>You scored ' + stars[0].outerHTML +""+ stars[1].outerHTML+ ""+ stars[2].outerHTML+' Stars! </h3>'
  +'<h3>Your Winning Time is ' + counter + " Seconds"+
  '</h3><h3>Your number of clicks is ' + clickNumber +'</h3>'
  ;
  dialog.appendChild(btn);
  dialog.show();
}

/**
Create the content of Game Over Dialog and display it to the player
*/
function gameOver(counter,clickNumber){
  let btn = document.createElement("BUTTON");
  btn.innerText = "Play Again!";
  btn.classList = 'button';
  btn.addEventListener("click", initilizeGame);
  dialog.setAttribute("style", "height:23%;");
  dialog.innerHTML = '<h2> Game Over... </h2>'+
  '<h3>Good Luck Next Time... </h3>';
  dialog.appendChild(btn);
  dialog.show();
}
