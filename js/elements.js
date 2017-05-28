
//Plank
var Plank = function(c,top,fill){

    this.left = 20;
    this.top = top;
    this.width = c.width - 40;
    this.height = 5;
    this.fill = fill;

    this.draw = function(){
        var rectangle = new fabric.Rect({
            left: this.left,
            top: this.top,
            fill: this.fill,
            width: this.width,
            height: this.height

        });

        rectangle.selectable = false;

        c.add(rectangle);
        rectangle.moveTo(0);
    }
}

//sugardaddy

var SugarDaddy = function(c,left,top, element){

    var t = this;
    this.sugarDaddy = null;
    this.element = element;


    this.size = {
        width: 150,
        height: 155
    }
    this.position = {
        left: left,
        top: top
    }

    this.draw = function(){
        t.sugarDaddy = new fabric.Image(t.element, {
            width: t.size.width,
            height: t.size.height,
            left: t.position.left,
            top: t.position.top,
            originX: 'center',
            originY: 'bottom'
        });

        t.sugarDaddy.selectable = false;

        c.add(t.sugarDaddy);
        t.sugarDaddy.moveTo(100);
    }

//animation of sugardaddy
    this.wobble = function(){
        
        rotateRight();

        function rotateRight() {

            t.sugarDaddy.animate('angle', 10, {
                duration: 500,
                onChange: c.renderAll.bind(c),
                onComplete: function(){
                    rotateLeft();
                },
                easing: fabric.util.ease['easeInQuad']
            });
        }

        function rotateLeft() {

            t.sugarDaddy.animate('angle', -10, {
                duration: 500,
                onChange: c.renderAll.bind(c),
                onComplete: function(){
                    rotateRight();
                },
                easing: fabric.util.ease['easeInQuad']
            });
        }
    }
}

//golddigger 

var Digger = function(c, element){

    var t = this;
    this.digger = null;
    this.element = element;

    this.size = {
        width: 192,
        height: 130
    }
    this.position = {
        left: c.width / 2,
        top: c.height -2
    }

    this.draw = function(){
        t.digger = new fabric.Image(t.element, {
            width: t.size.width,
            height: t.size.height,
            left: t.position.left,
            top: t.position.top,
            originX: 'center',
            originY: 'center',
            selectable: false
        });

        c.add(t.digger);
        t.digger.moveTo(20);
    }
}


var Cash = function(c,left,top,width, element){

    var t = this;
    this.cash = null;
    this.element = element;
    this.hasFallen = false;

    this.left = left;
    this.top = top;
    this.width = width;
    this.height = width;

    this.draw = function(){
        t.cash = new fabric.Image(element,{
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height,
            originX: 'center',
            originY: 'center',
            angle: 0,
            selectable: false
        });

        c.add(t.cash);
        t.cash.moveTo(50);

    }

    this.rotate = function(){

        var startAngle = 180;

        rotateFull(startAngle);

        //rotate full
        function rotateFull(angle) {
            startAngle = startAngle + angle;
            t.cash.animate('angle', startAngle, {
                duration: 500,
                onChange: c.renderAll.bind(c),
                onComplete: function(){
                    rotateFull(angle);
                },
                easing: fabric.util.ease['easeInQuad']
            });
        }
    }

    this.fall = function(endPosition, duration) {

        // call function

        var leftOrRight = Math.floor(Math.random() * 10) + 1 ;

        if(leftOrRight < 5){

            fallHorizontallyLeft();
        
        }
        else{

            fallHorizontallyRight();
  
        }

        function fallHorizontallyLeft() {
            t.cash.animate('left', endPosition, {
                duration: duration,
                onComplete: fallVertically
            });   
        }

        function fallHorizontallyRight() {
            t.cash.animate('left', c.width - (endPosition +5)  , {
                duration: duration,
                onComplete: fallVertically
            });   
        }

        function fallVertically() {
            t.cash.animate('top', 500, {
                duration: 1000,
                onComplete: function() {
                    //cash has fallen --> boolean 1
                    t.hasFallen = true;
                    //delete cash of canvas
                    c.remove(t.cash);                   
                }
            });
        }
    }
}

var Car = function(c, left, top, element) {

    //This in varable t
    var t = this;
    // fabric element will be in  this.cash 
    this.car = null;
    this.el = element;
    this.size = {
        width: 246,
        height: 167
    };
    this.position = {
        left: left,
        top: top
    };


    this.draw = function(){

        t.car = new fabric.Image(t.el,{
            left: t.position.left,
            top: t.position.top,
            width: t.size.width,
            height: t.size.height,
            originX: 'center',
            originY: 'bottom',
            selectable: false
        });

        c.add(t.car);

        t.car.moveTo(1);
    };
   
    this.catchEggs = function() {

        move('right');

        function move(direction) {
            //position is 50px (left from the canvas)
            var position = 100;
            //position is 50px right from canvas
            if(direction == 'right') {
                position = c.width -100;
                t.car.set('flipX',true);
            }
            else {
                t.car.set('flipX',false);
            }
            console.log(position);
            t.car.animate('left',position, {

                duration: 6000,
                onComplete:function() {
                    //animation  to the right -> go to left
                    if(direction == 'right')
                        move('left');
                    //completelys to the end of the left -->  go back to the right
                    else {
                        move('right');
                    }
                }
            })
        }
    }
}

