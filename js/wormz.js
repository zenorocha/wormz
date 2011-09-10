var width = 600;
var height = 600;

var slide=true	
var cut;

var imgContainer = document.getElementById("img-container");

var imageDataCut
var dataCut
var imagesCut

var insert_pos;
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
var img;
var data = new Array();
var imageData = new Array();
var datax;
var imagexData;
var na=8;
var pos=0;
var tim=-pos;
var lastt=new Date();
var state=0;
var hoverObj;
////the chaos variables!
var spd=3;
var mag=5;
var color="#00FF00";
var rdn=0.5;
var ras=0.09;
var num=pos;

var cr=0;
var cg=0;
var cb=0;
var px,py;
/////


function play_pause(e){
	if(slide){
		e.innerHTML="<span>Play Slide</span>"
		slide=false
	}else{
		e.innerHTML="<span>Stop Slide</span>"
		slide=true
	}
}
function creatSlide(){	
	var groupHeight=26+82*images.length;
	var res='';
	for(var i=0;i<images.length;i++){
		if(pos==i)
			res+='<div data-pos='+i+' class="between"></div><img id=img'+i+' draggable="true" data-pos='+i+'  class="thumbnail selectedThumbnail" src="'+images[i]+'" />';
		else
			res+='<div data-pos='+i+' class="between"></div><img id=img'+i+' draggable="true" data-pos='+i+'  class="thumbnail" src="'+images[i]+'" />';
	}
	res+='<div data-pos='+images.length+' class="between"></div>';
	document.getElementById("img-group").innerHTML=res	
	document.getElementById("img-group").style.height=groupHeight;
}
function loadImage(file) {
	f=file.files[0];
	
	var reader = new FileReader();
	reader.onload = function(loadEvent) {
		preload(loadEvent.target.result);
	}
	reader.readAsDataURL(f);
}
function preload(fileURL){	
	if(hoverObj){
		state=hoverObj.getAttribute("data-pos");
		if(hoverObj.className=="thumbnail"){
			images[hoverObj.getAttribute("data-pos")]=fileURL;
		}else{
			images.splice(hoverObj.getAttribute("data-pos"),0,fileURL);
		}
	}else{
		state=images.length;
		images[images.length]=fileURL;			
	}
	creatSlide()
	img.src=fileURL;		
}
var img = new Image();
img.onload = function(){
	ctx.drawImage(img, 0, 0,width,height);	
	imageData.splice(state,0,ctx.getImageData(0, 0, canvas.width, canvas.height))
	data.splice(state,0,imageData[state].data);
	state++;
	if(pos>=imageData.length){pos=0;}		
	loading();
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fillRect(0,0,width,height);		
}

document.addEventListener("dragenter", dragOut, false);

imgContainer.addEventListener('dragstart', dragStart, false);
imgContainer.addEventListener("dragend", dragEnd, false);
imgContainer.addEventListener("dragenter", dragOver, false);
imgContainer.addEventListener("dragover", noopHandler, false);
imgContainer.addEventListener("drop", drop, false);
imgContainer.addEventListener("click", click, false);

function click (evt){
	if(evt.target.id!="img-group"){	
		pos = evt.target.getAttribute("data-pos")
		tim=0;
		creatSlide()
	}
	evt.stopPropagation();
	evt.preventDefault();
}

function dragOut(evt) {	
	
	document.getElementById("trash").className = "close-trash";
	
	if(hoverObj) {
		console.log('dragOut '+hoverObj.className );		
		if(hoverObj.className == "thumbnail hoverThumbnail"  || hoverObj.className == "thumbnail selectedThumbnail"){
			hoverObj.className = "thumbnail";
		}else{
			hoverObj.className = "between";
		}		
	}
	hoverObj=null;
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
	cut=evt.target.getAttribute("data-pos");
	evt.dataTransfer.setData('text/html', evt.target.src);
}
function dragOver(evt) {
	if((evt.target.id!="img-group")&&(evt.target.id!="img-container")){
		if(evt.target.id == "trash") {
			document.getElementById("trash").className = "open-trash";
		} else{ 	
			if(hoverObj){
				if(hoverObj.className == "thumbnail hoverThumbnail"  || hoverObj.className == "thumbnail selectedThumbnail"){
					hoverObj.className = "thumbnail";
				}else{
					hoverObj.className = "between";
				}
			}
			document.getElementById("trash").className = "close-trash";			
			hoverObj = evt.target;
		
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
    console.log('drop '+evt.target.id);
	evt.stopPropagation();
	evt.preventDefault();	
	if(evt.dataTransfer.files.length==0){
		imagesCut=images[cut]
		imageDataCut=imageData[cut]
		dataCut=data[cut]
		
		images.splice(cut,1)
		imageData.splice(cut,1)
		data.splice(cut,1)
	}
	if((evt.target.id!="img-group")&&(evt.target.id!="img-container")){
		if(evt.target.id=="trash"){
			
		}else{	
			if(evt.dataTransfer.files.length>0){
				loadImage(evt.dataTransfer)
			}else{
				var position=evt.target.getAttribute("data-pos")
				if(position>cut)position--;
				if((evt.target.className=="thumbnail hoverThumbnail")&&(cut!=evt.target.getAttribute("data-pos"))){
					imageData.splice(cut,0,imageData[position])
					data.splice(cut,0,data[position]);
					images.splice(cut,0,images[position]);
					imageData.splice(evt.target.getAttribute("data-pos"),1)
					data.splice(evt.target.getAttribute("data-pos"),1);
					images.splice(evt.target.getAttribute("data-pos"),1);
					imageData.splice(evt.target.getAttribute("data-pos"),0,imageDataCut)
					data.splice(evt.target.getAttribute("data-pos"),0,dataCut);
					images.splice(evt.target.getAttribute("data-pos"),0,imagesCut)	
				}else{
					imageData.splice(position,0,imageDataCut)
					data.splice(position,0,dataCut);
					images.splice(position,0,imagesCut)	
				}
				creatSlide();
			}			
		} 
	}else{
		imageData.splice(cut,0,imageDataCut)
		data.splice(cut,0,dataCut);
		images.splice(cut,0,imagesCut)	
		creatSlide();
	}
}
//var timer = document.getElementById("timer");
var angs=new Array();
for(var j=0;j<na;j++){			
	var ang=((360+0)/(na))*j;
	angs.push(Math.round(Math.cos(ang*Math.PI/180)*10));
	angs.push(Math.round(Math.sin(ang*Math.PI/180)*10));
}
function go(){
	this.lx=this.x;
	this.ly=this.y;
	var rx=ry=0;
	var x= Math.round(this.x);
	var y= Math.round(this.y);
	//var p=(Math.round(this.y)+(Math.round(this.x)*img.width))*4;
	var imdw=imageData[pos].width*4;
	if(data[pos][((y*imdw)+(x*4))]>pos){
		var pp=(((y)*(imdw)) + ((x)*4));
		if(data[pos][pp]>100){
			for(var j=0;j<na;j++){
				var px=angs[(j*2)];//Math.round(Math.cos(ang*Math.PI/180)*10);
				var py=angs[(j*2)+1];//Math.round(Math.sin(ang*Math.PI/180)*10);
				if(((x+px>0)&&(x+px<width))&&((y+py>0)&&(y+py<height))){	
					var p=(((py+y)*(imdw)) + ((px+x)*4));
					var ppp=(data[pos][p]+data[pos][p+1]+data[pos][p+2])/3;
					rx+=(px/100)*((255-ppp)/200);
					ry+=(py/100)*((255-ppp)/200); 					
				}
			}
		}
	}	
	this.vx+=rx*mag;
	this.vy+=ry*mag;
	this.vx+=(Math.random()-0.5)*rdn;
	this.vy+=(Math.random()-0.5)*rdn;
	
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
	this.x+=this.vx*spd*1.5;
	this.y+=this.vy*spd*1.5;
	
}

function draw(col){
	//ctx.fillStyle = "#"+col;
	//ctx.fillRect(this.x,this.y,this.w,this.w);
	//ctx.strokeStyle = "#"+col;		
	ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.lx,this.ly);ctx.closePath();ctx.stroke();
}

function dot(nx,ny){
	this.x=this.lx=nx;
	this.y=this.ly=ny;
	this.vx=Math.random()-0.5;
	this.vy=Math.random()-0.5;
	this.c=color;
	this.w=1;//Math.random()*1.0+1.0;
	///metodos
	this.draw=draw;
	this.go=go;
}
function loading(){
	if((state<images.length)&&(isloading)){
		img.src = images[state];
		//document.getElementById("slide").innerHTML+='<img class="thumbnail" src="'+ images[state] +'" />';
	}else{
		isloading=false
	}
}
loading()
creatSlide();
d=new Array();
for(var yy=0;yy<20000;yy++){
	d.push(new dot(Math.random()*width,Math.random()*height));
}
ctx.fillStyle = "rgba(0, 0, 0, 1)";
ctx.fillRect(0,0,width,height);

function act() {
	btnSlide.style.display="inline-block"
	btnGenerate.innerHTML="<span>Regenerate</span>"
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fillRect(0,0,width,height);		
	spd=((speedControl.value*speedControl.value)*0.012)+speedControl.value*0;
	mag=((influenceControl.value*influenceControl.value)*2)+influenceControl.value*0.0;
	rdn=(randomControl.value*randomControl.value);
	ras=(trailControl.value*trailControl.value*trailControl.value)/(spd);
	num=((amountControl.value/2)*(amountControl.value/2)*0.001);	
	cr=redControl.value;
	cg=greenControl.value;
	cb=blueControl.value;
	
	for(var xx=0;xx<num;xx++){
		d[xx].x=d[xx].y=width/2;
		d[xx].lx=d[xx].ly=270;
	}
	if(int_id!=-1)
	clearInterval(int_id);
	int_id=setInterval(ani,30);
	tim=-pos;	
}

function ani(){
	spd=((speedControl.value*speedControl.value)*0.12)+speedControl.value*0.0;
	mag=((influenceControl.value*influenceControl.value)*2)+influenceControl.value*0.0;
	rdn=(randomControl.value*randomControl.value);
	if(spd==0){
		ras=0;
	}else{
		ras=(trailControl.value*trailControl.value*trailControl.value)*(spd/1);
	}
	num=((amountControl.value/2)*(amountControl.value/2)*0.001);		
	cr=parseInt(redControl.value);
	cg=parseInt(greenControl.value);
	cb=parseInt(blueControl.value);
	
	if(cr>255)cr=255;
	if(cr<0)cr=0;
	if(cg>255)cg=255;
	if(cg<0)cg=0;
	if(cb>255)cb=255;
	if(cb<0)cb=0;
	/*if(tim%10==0){
		timer.value=100/(new Date()-lastt);
		lastt=new Date();
	}*/
	tim++;
	if(tim>180){
		if(slide)
			pos++;
		if(pos>=imageData.length){pos=0;}
		creatSlide()
		tim=0;
	}
	ctx.fillStyle = "rgba(0, 0, 0, "+ras+")";
	ctx.fillRect(0,0,width,height);
	var col=(parseInt(cb)+parseInt(cg)*256+parseInt(cr)*256*256).toString(16);		
	while(col.length<6){
		col="0".concat(col);
	}
	ctx.fillStyle = "#"+col;
	ctx.strokeStyle = "#"+col;
	for(var xx=0;xx<num;xx++){
		d[xx].go();
		d[xx].draw(col);
	}
}
