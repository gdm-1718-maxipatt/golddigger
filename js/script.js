



window.onload = function() {

    //declare a canvas with the fabric library
    var canvas = this.__canvas = new fabric.Canvas('playground');

    var plank = new Plank(canvas,155,'#521e2e');
    plank.draw();

    //defining all elements
    var elementSugarDaddy = document.getElementById('imgSugarDaddy');
    var elementDigger = document.getElementById('imgDigger');
    var elementCash = document.getElementById('imgCash');
    var elementCar = document.getElementById('imgCar');
    var elementScore = document.getElementById('scoreValue');
    var elementLives = document.getElementById('livesValue');
    var music = document.getElementById('audioTag2');

   

    //BUTTONS
    var btnStart = document.getElementById('btnStart');
    var btnPause = document.getElementById('btnPause');
    var btnstop= document.getElementById('btnStop');
    var btnMute = document.getElementById('btnMute');

    //DECLARATIONS
    var hiScoreValue=0;
    var score = 1;
    var lives =3;
    var cashArray = [];
    var centerPos = canvas.width/2;
    var cashSpeed = 2000;
    var gameStatus = 'start';
    var createCashInterval;
    var monitorGameInterval;
    var cashWidth = 65;


    //start game
    btnStart.addEventListener('click', function(){

        gameStatus = 'start';
          btnStart.disabled = true;
        btnPause.disabled = false;
        btnMute.disabled = false;


        //Sugardaddy and car on canvas
        sugarDaddy.draw();
        sugarDaddy.wobble();

        car.draw();
        car.catchEggs();

        //dropping cash
        createCashInterval = setInterval(createCash,cashSpeed);
        monitorGameInterval = setInterval(monitorGame, 100);

        
        //buttons disable
        btnStart.disabled = true;
        btnPause.disabled = false;
        btnMute.disabled = false;



    });




    //pause game
    btnPause.addEventListener('click', function(){

        gameStatus = 'pause';

        btnStart.disabled = false;
        btnPause.disabled = true;
        btnMute.disabled = false;

        music.pause();

        //delete current objects on canvas
        
        canvas.remove(car.car);
        canvas.remove(sugarDaddy.sugarDaddy);


        for(var i = 0; i < cashArray.length; i++) {
            var currentCash = cashArray[i];

            canvas.remove(currentCash.cash);



        }
        
    
        clearInterval(createCashInterval);
        clearInterval(monitorGameInterval);

        btnStart.disabled = false;
        btnPause.disabled = true;
        btnMute.disabled = false ;

    });



    //stop game
    btnStop.addEventListener('click', function(){

        gameStatus = 'stop';

        btnStart.disabled = false;
        btnPause.disabled = true;
        btnMute.disabled = false;
        btnStop.disabled=true;


        //pause music
        music.pause();


        //reset score
        score=0;
        elementScore.textContent = score;


        //delete all objects
        
        canvas.remove(car.car);
        canvas.remove(sugarDaddy.sugarDaddy);


        for(var i = 0; i < cashArray.length; i++) {
            var currentCash = cashArray[i];

            canvas.remove(currentCash.cash);



        }
        
    
        clearInterval(createCashInterval);
        clearInterval(monitorGameInterval);

        btnStart.disabled = false;
        btnPause.disabled = false;
        btnMute.disabled = false ;
        btnStop.disabled = true;

    });


     

    //Make sugardaddy
    var sugarDaddy = new SugarDaddy(canvas, centerPos,160,elementSugarDaddy);
    
    //Digger functionality
    var diggerEat = new Digger(canvas, elementDigger);
    diggerEat.draw();

    if(score < 2) {
        canvas.on('mouse:move', moveDigger);
        function moveDigger(options) {

            var xPosCursor = options.e.layerX;

            diggerEat.digger.left = xPosCursor;
        }
    }

    
    //create cash every... miliseconds
    function createCash() {
        //get a random xposition
        var randomLeft = randomXPos();

        var cash = new Cash(canvas,canvas.width/2, 140, cashWidth, elementCash);
        cash.draw();

        //rotate cash
        cash.rotate();

        //duration of the animation depends on distance
        var distance = Math.abs(centerPos - randomLeft);
        var duration = distance *10;

        //let the cash fall down
        cash.fall(randomLeft,duration);

        //add current cash to the array with cash
        cashArray.push(cash);
    }

    var car = new Car(canvas, 100, 570, elementCar);

    function monitorGame() {
        //check the eggs in basket
        checkEggs();

        checkCar();
    }

    //does digger catch the money ? 
    function checkEggs() {
        for(var i = 0; i < cashArray.length; i++) {
            var cashChecken = cashArray[i];
            var x = cashChecken.cash.left;
            var y = cashChecken.cash.top;
            if(cashChecken.hasFallen) {
                //remove from array
                cashArray.splice(i,1);
            }

            if( y > 400 && cashChecken.hasFallen == false) {
                var diggerPos = diggerEat.digger.left;
                var diggerPadding = 50;
                document.getElementById('audioTag').play();

                if((diggerPos - diggerPadding) < x && x < (diggerPos + diggerPadding)) {
                    cashChecken.hasFallen = true;
                    score++;
                    elementScore.textContent = score;
                    //if catched score +1
                }else{
                    cashChecken.hasFallen = false;
                    score--;
                    elementScore.textContent = score;
                    //if not score -1

                    lives++;
                    elementLives.textContent = lives;
                    // add to  not catched money 'donation for homeless'
                }


            }


        //trying to make highscores
            if (score>hiScoreValue.textContent){
        hiScore++;
        hiScoreValue.textContent++;
        elHiScore.textContent=hiScore; }
        }
    }

    //check if car counters cash
    function checkCar() {
        for(var i = 0; i < cashArray.length; i++) {
            var cashChecken = cashArray[i];
            var x = cashChecken.cash.left;
            var y = cashChecken.cash.top;

            if(y == 110) {

                //de x-pos of car
                var CarPos =car.car.left;
                var carPadding = 25;

                if((carPos - carPadding) < x && x < (carPos + carPadding)) {


                    // cash has fallen is true
                    cashChecken.hasFallen = true;
                    //delete  it of canvas
                    canvas.remove(cashChecken.cash);
                }

               
            }
            }
        }
   

    //--------HELPERS-------------\\
    function randomXPos() {
        var min = 50;
        var max = canvas.width -70;

        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function makeHandler(arg) {
        return function(e) {
            if(e.target) {
                e.target.animate('angle', arg,{
                    duration: 100,
                    onChange: canvas.renderAll.bind(canvas)
                });
            }
        };
    }

    var canvasObjects = canvas.getObjects();

   
}



