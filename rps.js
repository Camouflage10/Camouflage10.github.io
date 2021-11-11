//select canvas
var canvas,ctx, header,boxes,state, selected=-1
var circles=[]
var g=new Graph();
//find out how to change h2 text
function getCanvas(){
    header=document.getElementById("name");
    canvas=document.getElementById("game");
    ctx=canvas.getContext('2d');
}
function clear(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
function main(){
    header.innerHTML="PICK YOUR GAME(unfinished)"
    clear()
    boxes=[]
     //graph
     let x=Math.floor(canvas.width/2)-20;
     let y=Math.floor(canvas.height/3.5)-40;
     boxes.push(new Box("GRAPH",x,y,55,20,graph));
    //rps
    ctx.fillStyle="black";
    //x=Math.floor(canvas.width/2)-10;
    y+=Math.floor(canvas.height/3);
    boxes.push(new Box("RPS",x,y,33,20,rps));
    //hull
    ctx.fillStyle="black";
    //x=Math.floor(canvas.width/2)-17;
    y+=Math.floor(canvas.height/3);
    boxes.push(new Box("HULL",x,y,45,20,hull));
    boxes.forEach(b => b.display());
}
//equalize mouse pos and button pos
function getMousePos(){
    var r= canvas.getBoundingClientRect();
    return{
        x: (window.event.clientX-r.left)/3.8,
        y: (window.event.clientY-r.top)/3.8
    };
    }
function backBut(){
boxes=[]
boxes.push(new Box("BACK",0,0,45,20,back));
}
function back(){
state=State.MAIN;
console.log(state);
main();
}
//make sure play is changing w the function
function rps(){
header.innerHTML="ROCK, PAPER, SCISSORS"
clear();
backBut();
var play=0;
var bot=0;
//bot play random rn 

//rock
let x=Math.floor(canvas.width/2)-20;
let y=Math.floor(canvas.height/3.5)-40;
boxes.push(new Box("ROCK",x,y,50,20,createState));   
//paper
    ctx.fillStyle="black";
    x=Math.floor(canvas.width/2)-25;
    y+=Math.floor(canvas.height/3);
    boxes.push(new Box("PAPER",x,y,50,20,rps));
//scissors
ctx.fillStyle="black";
x=Math.floor(canvas.width/2)-30;
y+=Math.floor(canvas.height/3);
ctx.fillRect(x,y,45,20);
boxes.push(new Box("SCISSORS",x,y,77,20,hull));

boxes.forEach(b => b.display());
}
function changePlay(play, choice){
    play=choice;
    //win,lose,tie screen functions
    //clear()
    //restart button    
}
function graph(){
header.innerHTML="GRAPHS";
console.log(state);
clear();
backBut();
//link button
boxes.push(new Box("CREATE",50,0,60,20,createState))
boxes.push(new Box("LINK",115,0,50,20,linkState))

//bfs
//dfs
//dyk
boxes.forEach(b => b.display());
switch(state){
    case State.GRAPHCREATION:
        boxes[1].display("red");
        break;
    case State.GRAPHLINK:
        boxes[2].display("red");
        break;

}
g.redraw();
}
function createState(){
    state=State.GRAPHCREATION;
    console.log("linked")
    graph()
}
function linkState(){
    state=State.GRAPHLINK;
    console.log("linked")
    graph()
    //circles.forEach(b => b.display());

}
function hull(){
clear();
backBut();
boxes.forEach(b => b.display());
}
window.onload=function(){
    getCanvas();
    state=State.MAIN;
    main();
    
}
window.onresize=function(){
    switch(state){
        case State.MAIN:
            main();
            break;
        case State.GRAPHCREATION:
            graph();
            break;
        case State.GRAPHLINK:
            graph();
            break;
        case State.RPS:
            rps();
            break;
    }
}
window.onclick=function(){
    let coord=getMousePos();
    x=coord["x"];
    y=coord["y"];
    for(let i=0;i<boxes.length;i++){
        if(boxes[i].inside(x,y)){
            boxes[i].fun();
            return;
        }
    }

    switch(state){
        case State.GRAPHCREATION:
            for(let i=0;i<circles.length;i++){
                if(circles[i].inside(x,y,circles[i].r*1.5)){
                    return
                }
            }
            circles.push(new Vertex(x,y,6,circles.length+1));
            circles[circles.length-1].display("black");
            g.addVert();  
        break;
        case State.GRAPHLINK:
            console.log("t")
            for(let i=0;i<circles.length;i++){
                if(circles[i].inside(x,y)){
                    if(selected<0){
                    selected=i;
                    circles[selected].display("red");
                    }
                    else{
                        g.addEdge(selected,i);
                        circles[selected].display("black");
                        selected=-1;
                    }
                }
            }

    }
}
function Box(text,x,y,width,height,fun){
    this.text=text;
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.fun=fun;
    this.display = function(color="black"){
        ctx.fillStyle=color;
        ctx.fillRect(x,y,width,height);
        ctx.fillStyle="white";
        ctx.font = '15px serif';
        ctx.fillText(text,x+3,y+15);
    }
    this.inside = function(x,y){
        if(x>this.x && x<this.width+this.x&&y>this.y&&y<this.height+this.y){
            return true;
        }
        return false;
    }
}
function Vertex(x,y,r,num){
    this.x=x;
    this.y=y;
    this.r=r;
    this.num=num;
    this.display = function(color="black"){
        ctx.fillStyle="black";
        ctx.strokeStyle=color;
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.r,0,2*Math.PI);
        ctx.stroke();
        ctx.font = r*1.5+'px serif';
        ctx.fillText(this.num,this.x-r*.4,this.y+r*.5);
    }
    this.distance =function(vert){
        return Math.hypot(this.x-vert.x,this.y-vert.y);
    }
    this.inside = function(x,y,space=0){
        return Math.hypot(this.x-x,this.y-y)<this.r+space
    }
    this.pointTo = function(to,color="black"){
        ctx.strokeStyle=color
        var headlen=3;
        var dx=to.x-this.x;
        var dy=to.y-this.y;
        var angle=Math.atan2(dy,dx);
        var distance=Math.hypot(dx,dy)-this.r;
        var fromx=this.x+(this.r* Math.cos(angle));
        var fromy=this.y+(this.r* Math.sin(angle));
        var tox=this.x+(distance* Math.cos(angle));
        var toy=this.y+(distance* Math.sin(angle));
        ctx.moveTo(fromx,fromy);
        ctx.lineTo(tox,toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
        ctx.moveTo(tox,toy);
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
        ctx.stroke()
        return distance-to.r;
    }
}
function Graph(){
    this.verti=0;
    this.graph=[];
    this.addVert= function(){
        this.verti++;
        console.log(this.verti);
        for(var i=0;i<this.verti;i++){
            if(i==this.verti-1){this.graph[i]=[];}
            for(var j=0;j<this.verti;j++){
                if(i==this.verti-1||j==this.verti-1)this.graph[i][j]=-1;
            }
        }

        console.log(this.graph);
    }
    //from, to indexes
    this.addEdge=function(from,to){
        this.graph[from][to]=circles[from].pointTo(circles[to]);
        console.log(this.graph);
    }
    this.redraw= function(){
        for(var i=0;i<this.graph.length;i++){
            circles[i].display();
            for(var j=0;j<this.graph[i].length;j++){
                if(this.graph[i][j]>0){
                    circles[i].pointTo(circles[j]);
                }
            }
        }
    }
}
function dfs(){

}
function bfs(){

}
function dyk(){

}
const State={
    MAIN:'MAIN',
    RPS:'RPS',
    GRAPHCREATION:'GRAPHCREATION',
    GRAPHLINK:'GRAPHLINK',
    HULL:'HULL'
}
const RPS={
    R:'ROCK',
    P:'PAPER',
    S:'SCISSORS'
}