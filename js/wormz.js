var width = 600;
var height = 600;

var slide=true	
var Transfer;

var imgContainer = document.getElementById("img-container");

var imageDataTransfer;
var dataTransfer;
var imagesTransfer;

var insert_position;
var images = ["img/example-img-1.jpg", "img/example-img-2.jpg", "img/example-img-3.jpg", "img/example-img-4.jpg", "img/example-img-5.jpg"];

// control vars
var ctx = document.getElementById("canvas").getContext("2d");
var speedControl = document.getElementById("speed-control");
var influenceControl = document.getElementById("influence-control");
var randomControl = document.getElementById("random-control");
var trailControl = document.getElementById("trail-control");
var amountControl = document.getElementById("amount-control");

// rgb vars
var redControl = document.getElementById("red-control");
var greenControl = document.getElementById("green-control");
var blueControl = document.getElementById("blue-control");

// button vars
var btnGenerate = document.getElementById("btn-generate");
var btnSlide = document.getElementById("btn-slide");

var isloading=true	
var int_id=-1;	
var data = new Array();
var imageData = new Array();
var datax;
var imagexData;
var numberAngles=8;
var position=0;
var timer=-position;
var lastt=new Date();
var state=0;
var hoverElement;
////the chaos variables!
var speed=3;
var influence=5;
var color="#00FF00";
var random=0.5;
var trail=0.09;
var amount=position;

var componentRed=0;
var componentGreen=0;
var componentBlue=0;
var positionX,positionY;
/////


function play_pause(e, event){	
	event.preventDefault();	
	if(slide){
		e.innerHTML="<span>Play Slide</span>";
		slide=false;
	}else{
		e.innerHTML="<span>Stop Slide</span>";
		slide=true;
	}
	
}
function creatSlide(){	
	var res='';
	for(var i=0;i<images.length;i++){
		if(position==i)
			res+='<div data-position='+i+' class="between"></div><img id=img'+i+' draggable="true" data-position='+i+'  class="thumbnail selectedThumbnail" src="'+images[i]+'" />';
		else
			res+='<div data-position='+i+' class="between"></div><img id=img'+i+' draggable="true" data-position='+i+'  class="thumbnail" src="'+images[i]+'" />';
	}
	res+='<div data-position='+images.length+' class="between"></div>';
	document.getElementById("img-group").innerHTML=res	
}
function loadImage(file) {
	var the_file=file.files[0];
	
	var reader = new FileReader();
	reader.onload = function(loadEvent) {
		preload(loadEvent.target.result);
	}
	reader.readAsDataURL(the_file);
}
function preload(fileURL){	
	if(hoverElement){
		state=hoverElement.getAttribute("data-position");
		if(hoverElement.className=="thumbnail hoverThumbnail"){
			images[hoverElement.getAttribute("data-position")]=fileURL;
		}else{
			images.splice(hoverElement.getAttribute("data-position"),0,fileURL);
		}
	}else{
		state=images.length;
		images[images.length]=fileURL;			
	}
	creatSlide()
	image.src=fileURL;		
}
image = new Image();
image.onload = function(){
	ctx.drawImage(image, 0, 0,width,height);	
	imageData.splice(state,0,ctx.getImageData(0, 0,width, height))
	data.splice(state,0,imageData[state].data);
	state++;
	if(position>=imageData.length)position=0;		
	loading();
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fillRect(0,0,width,height);		
}

document.addEventListener("dragenter", dragOut, false);

imgContainer.addEventListener('dragstart', dragStart, false);
imgContainer.addEventListener("dragend", dragEnd, false);
imgContainer.addEventListener("dragenter", dragEnter, false);
imgContainer.addEventListener("dragover", noopHandler, false);
imgContainer.addEventListener("drop", drop, false);
imgContainer.addEventListener("click", click, false);

function click (evt){
	if(evt.target.id!="img-group"){	
		position = evt.target.getAttribute("data-position")
		timer=0;
		creatSlide()
	}
	evt.stopPropagation();
	evt.preventDefault();
}

function dragOut(evt) {		
	document.getElementById("trash").className = "close-trash";	
	if(hoverElement) {		
		if(hoverElement.className == "thumbnail hoverThumbnail"  || hoverElement.className == "thumbnail selectedThumbnail"){
			hoverElement.className = "thumbnail";
		}else{
			hoverElement.className = "between";
		}		
	}
	hoverElement=null;
	evt.stopPropagation();
	evt.preventDefault();
}

function noopHandler(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}
function dragEnd(evt) {
	document.getElementById("trash").className = "close-trash";			
	evt.stopPropagation();
	evt.preventDefault();
	creatSlide()
}
function dragStart(evt){
	Transfer=evt.target.getAttribute("data-position");
	evt.dataTransfer.setData('text/html', evt.target.src);
}
function dragEnter(evt) {
	if((evt.target.id!="img-group")&&(evt.target.id!="img-container")){
		if(evt.target.id == "trash") {
			document.getElementById("trash").className = "open-trash";
		} else{ 	
			if(hoverElement){
				if(hoverElement.className == "thumbnail hoverThumbnail"  || hoverElement.className == "thumbnail selectedThumbnail"){
					hoverElement.className = "thumbnail";
				}else{
					hoverElement.className = "between";
				}
			}
			document.getElementById("trash").className = "close-trash";			
			hoverElement = evt.target;
		
			if(evt.target.className == "thumbnail" || evt.target.className == "thumbnail selectedThumbnail"){
				evt.target.className = "thumbnail hoverThumbnail";
			}else{
				evt.target.className = "between betweenHover";
			}			
		}
	}
	evt.stopPropagation();
	evt.preventDefault();
}
function drop(evt){	
	evt.stopPropagation();
	evt.preventDefault();	
	if(evt.dataTransfer.files.length==0){
		imagesTransfer=images[Transfer]
		imageDataTransfer=imageData[Transfer]
		dataTransfer=data[Transfer]
		
		images.splice(Transfer,1)
		imageData.splice(Transfer,1)
		data.splice(Transfer,1)
	}
	if((evt.target.id!="img-group")&&(evt.target.id!="img-container")){
		if(evt.target.id=="trash"){
			
		}else{	
			if(evt.dataTransfer.files.length>0){
				loadImage(evt.dataTransfer)
			}else{
				var positionElement=evt.target.getAttribute("data-position")
				if(positionElement>Transfer)positionElement--;
				if((evt.target.className=="thumbnail hoverThumbnail")&&(Transfer!=evt.target.getAttribute("data-position"))){
					imageData.splice(Transfer,0,imageData[positionElement])
					data.splice(Transfer,0,data[positionElement]);
					images.splice(Transfer,0,images[positionElement]);
					imageData.splice(evt.target.getAttribute("data-position"),1)
					data.splice(evt.target.getAttribute("data-position"),1);
					images.splice(evt.target.getAttribute("data-position"),1);
					imageData.splice(evt.target.getAttribute("data-position"),0,imageDataTransfer)
					data.splice(evt.target.getAttribute("data-position"),0,dataTransfer);
					images.splice(evt.target.getAttribute("data-position"),0,imagesTransfer)	
				}else{
					imageData.splice(positionElement,0,imageDataTransfer)
					data.splice(positionElement,0,dataTransfer);
					images.splice(positionElement,0,imagesTransfer)	
				}
				creatSlide();
			}			
		} 
	}else{
		imageData.splice(Transfer,0,imageDataTransfer)
		data.splice(Transfer,0,dataTransfer);
		images.splice(Transfer,0,imagesTransfer)	
		creatSlide();
	}
}
var anglesComp=new Array();
for(var j=0;j<numberAngles;j++){			
	var ang=((360+0)/(numberAngles))*j;
	anglesComp.push(Math.round(Math.cos(ang*Math.PI/180)*10));
	anglesComp.push(Math.round(Math.sin(ang*Math.PI/180)*10));
}
function go(){
	this.lastX=this.x;
	this.lastY=this.y;
	var resultX=resultY=0;
	var x= Math.round(this.x);
	var y= Math.round(this.y);
	var dataImageWidth=imageData[position].width*4;
	if(data[position][((y*dataImageWidth)+(x*4))]>position){
		var dataImageCurrentPosition=(((y)*(dataImageWidth)) + ((x)*4));
		if(data[position][dataImageCurrentPosition]>100){
			for(var j=0;j<numberAngles;j++){
				var positionX=anglesComp[(j*2)];
				var positionY=anglesComp[(j*2)+1];
				if(((x+positionX>0)&&(x+positionX<width))&&((y+positionY>0)&&(y+positionY<height))){	
					var dataImageAnglePosition=(((positionY+y)*(dataImageWidth)) + ((positionX+x)*4));
					var colorValue=(data[position][dataImageAnglePosition]+data[position][dataImageAnglePosition+1]+data[position][dataImageAnglePosition+2])/3;
					resultX+=(positionX/100)*((255-colorValue)/200);
					resultY+=(positionY/100)*((255-colorValue)/200); 					
				}
			}
		}
	}	
	this.vx+=resultX*influence;
	this.vy+=resultY*influence;
	this.vx+=(Math.random()-0.5)*random;
	this.vy+=(Math.random()-0.5)*random;
	
	var som=Math.sqrt((this.vx*this.vx)+(this.vy*this.vy));
	this.vx/=som;
	this.vy/=som;
	
	if((x<0)){
		this.vx*=-1;
		this.x=0;
	}
	if((x>width)){
		this.vx*=-1;
		this.x=width;
	}
	if((y<0)){
		this.vy*=-1;
		this.y=0;
	}
	if((y>height)){
		this.vy*=-1;
		this.y=height;
	}	
	this.x+=this.vx*speed*1.5;
	this.y+=this.vy*speed*1.5;	
}

function draw(col){	
	ctx.beginPath();
	ctx.moveTo(this.x,this.y);
	ctx.lineTo(this.lastX,this.lastY);
	ctx.closePath();
	ctx.stroke();
}

function worm(nx,ny){
	this.x=this.lastX=nx;
	this.y=this.lastY=ny;
	this.vx=Math.random()-0.5;
	this.vy=Math.random()-0.5;
	
	this.draw=draw;
	this.go=go;
}
function loading(){
	if((state<images.length)&&(isloading)){
		image.src = images[state];
	}else{
		isloading=false
	}
}
loading()
creatSlide();
wormz=new Array();
for(var yy=0;yy<20000;yy++){
	wormz.push(new worm(Math.random()*width,Math.random()*height));
}
ctx.fillStyle = "rgba(0, 0, 0, 1)";
ctx.fillRect(0,0,width,height);

function action(event) {
    event.preventDefault();
	btnSlide.style.display="inline-block";
	btnGenerate.innerHTML="<span>Regenerate</span>";
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fillRect(0,0,width,height);		
	speed=((speedControl.value*speedControl.value)*0.012)+speedControl.value*0;
	influence=((influenceControl.value*influenceControl.value)*2)+influenceControl.value*0.0;
	random=(randomControl.value*randomControl.value);
	trail=(trailControl.value*trailControl.value*trailControl.value)/(speed);
	amount=((amountControl.value/2)*(amountControl.value/2)*0.001);	
	
	componentRed=redControl.value;
	componentGreen=greenControl.value;
	componentBlue=blueControl.value;
	
	for(var xx=0;xx<amount;xx++){
		wormz[xx].x=wormz[xx].y=width/2;
		wormz[xx].lastX=wormz[xx].lastY=270;
	}
	if(int_id!=-1)
	clearInterval(int_id);
	int_id=setInterval(ani,30);
	timer=-position;	
}

function ani(){
	speed=((speedControl.value*speedControl.value)*0.12)+speedControl.value*0.0;
	influence=((influenceControl.value*influenceControl.value)*2)+influenceControl.value*0.0;
	random=(randomControl.value*randomControl.value);
	if(speed==0){
		trail=0;
	}else{
		trail=(trailControl.value*trailControl.value*trailControl.value)*(speed/1);
	}
	amount=((amountControl.value/2)*(amountControl.value/2)*0.001);		
	componentRed=parseInt(redControl.value);
	componentGreen=parseInt(greenControl.value);
	componentBlue=parseInt(blueControl.value);
	
	timer++;
	if(timer>180){
		if(slide)
			position++;
		if(position>=imageData.length)position=0;
		creatSlide()
		timer=0;
	}
	ctx.fillStyle = "rgba(0, 0, 0, "+trail+")";
	ctx.fillRect(0,0,width,height);
	var col=(parseInt(componentBlue)+parseInt(componentGreen)*256+parseInt(componentRed)*256*256).toString(16);		
	while(col.length<6){
		col="0".concat(col);
	}
	ctx.fillStyle = "#"+col;
	ctx.strokeStyle = "#"+col;
	for(var xx=0;xx<amount;xx++){
		wormz[xx].go();
		wormz[xx].draw(col);
	}
}
