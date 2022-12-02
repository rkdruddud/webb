
let canvas; 
let context;
let fontSize = 0;
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
range.addEventListener("change",e => context.lineWidth = e.target.value);
range.addEventListener("change",e => fontSize = e.target.value);
let startX=0, startY=0, preX =0, preY=0;
let endX =0, endY=0;
let dragging = false;
let mode;
let selectFont;

document.body.style.backgroundColor = "wheat";
const saveImg = document.querySelector(".savei");


// 초기 설정 초기화 
function init(){
    canvas =document.getElementById("maincanvas");
    context = canvas.getContext("2d");
    
    
    context.strokeStyle = "black";

    canvas.addEventListener("mousemove", function (e) {move(e) }, false);
    canvas.addEventListener("mousedown", function (e) {down(e) }, false);
    canvas.addEventListener("mouseup", function (e) {up(e) }, false);
    canvas.addEventListener("mouseout", function (e) {out(e) }, false);
    
}

// 그리기 및 지우기 
function draw(curX, curY){
    context.beginPath();
    let colorvalue;
    colorvalue = document.getElementById("colorChange").value;
 
  if(mode === "erase"){
    context.strokeStyle = "0fff";
    context.lineJoin="round";
    context.lineCap="round";
    
     context.moveTo(startX, startY);
    context.lineTo(curX,curY);
    context.stroke();
 }else{
    context.strokeStyle = colorvalue;
    context.lineJoin="round";
    context.lineCap="round";
    
     context.moveTo(startX, startY);
    context.lineTo(curX,curY);
    context.stroke();
 }
}
// 마우스 down 이벤트 처음 다운 위치 저장.
function down(e){
    startX = e.offsetX; startY = e.offsetY; dragging = true;
    preX = e.offsetX;
    preY = e.offsetY;
   
}
// 마우스 up 일 때 도형 및 자르기 기능 실행
function up(e){
    dragging = false;
    let colorvalue = document.getElementById("colorChange").value;
    context.strokeStyle = colorvalue;
    if(mode === "square"){
      

        context.beginPath();
       
         context.strokeRect(preX,preY,e.offsetX-preX,e.offsetY-preY);
        
     }
     else if(mode === "circle"){
        
         context.beginPath();
       
        
        context.arc(preX, preY, Math.pow(Math.pow(e.offsetX-preX,2)+Math.pow(e.offsetY-preY,2),0.5),0,2*Math.PI,false);
        context.stroke();
     }
     else if(mode === "triangle"){
        context.beginPath();
        

        context.moveTo(preX, preY);
        context.lineTo(e.offsetX,e.offsetY);
        context.lineTo(preX-(e.offsetX-preX),e.offsetY);
        context.lineTo(preX,preY);
        context.stroke();
        
     }
     else if(mode === "crop"){
        
        img = new Image();
			img.onload = function(){
				var ctx = canvas.getContext("2d");
                ctx.drawImage( img, preX,preY, e.offsetX-preX, e.offsetY-preY, 0, 0, canvas.width,canvas.height );
			};

			img.src = canvas.toDataURL();
     }
}
//마우스 이동(펜과 지우개)
function move(e){
    if(!dragging){
        return;
    }
        let curX = e.offsetX, curY = e.offsetY;
        if(mode === "pencil"){

            draw(curX, curY);
            startX = curX; 
            startY = curY;
        }
        else if(mode === "erase"){
           
            context.strokeStyle = "#fff";
            draw(curX, curY);
            startX = curX; 
            startY = curY;
        }
}
function out(e){ dragging = false;}  // 캔버스 밖으로 마우스 이동시 그려지지 않음

//전체 지우기
function clearClick(e){
    context.clearRect(0,0, canvas.width, canvas.height);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
function eraserClick(e){
    mode = "erase";
}
function pencilClick(e){
    init();
    mode = "pencil";
}

function circleClick(e){
    init();
mode = "circle";     

}
function squareClick(e){
    init();
    mode = "square";
   
}
function triangle(e){
    init();
    mode="triangle";
}
// 캔버스 클릭시 텍스트 입력창 나오도록 하기 위한 함수
function canvasClick(e) {

    if (textInput) return;
    
    let value_str = document.getElementById('f');
     value = value_str.options[value_str.selectedIndex].text;
    if(value==="돋음"){
        font = fontSize+'px Dotum';
    }
    else if(value==="바탕"){
        font = fontSize+'px Batang';
    }
    else if(value==="궁서"){
        font = fontSize+'px Gungsuh';
    }
    else if(value==="굴림체"){
        font = fontSize+'px GulimChe';
    }

    if(mode === "text"){
        
        
        addInput(e.clientX, e.clientY);
    }
    
}

    init();
    var font = '20px Batang';
    var textInput = false;
// 텍스트 클릭하여 입력
    function textClick(e){

        
        mode="text";
        
        // 여기에 폰트 변화 추가
       
       
    }
 // 텍스트 추가
    function addInput(x, y) {
      var input = document.createElement('input');

      input.type = 'text';
      input.style.position = 'fixed';
      input.style.left = (x - 4) + 'px';
      input.style.top = (y - 4) + 'px';

      input.onkeydown = handleEnter;

      document.body.appendChild(input);

      input.focus();

      textInput = true;
    }
    // 엔터키 입력 이벤트
    function handleEnter(e) {
      var keyCode = e.keyCode;
      if (keyCode === 13) {
        drawText(this.value, preX, preY);
        document.body.removeChild(this);
        textInput = false;
      }
    }
    // 입력한 텍스트 그리기 
    function drawText(txt, x, y) {
        let colorvalue2;
       colorvalue2 = document.getElementById("colorChange").value;
        context.fillStyle = colorvalue2;
      context.textBaseline = 'top';
      context.textAlign = 'left';
      context.font = font;
      context.fillText(txt, x - 4, y - 4);
      
      
    }
//로컬에서 이미지 파일 로드
function loadFile(input){
        var file = input.files[0];

        let img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.addEventListener("load", () => {
            resetFilterBtn.click();
            document.querySelector("maincanvas").classList.remove("disable");
        });

        img.onload = function () {   
            context.drawImage(img,0,0,canvas.width, canvas.height);
        }

        textArea_div.style.paddingTop = 105 +"px";
        drawingBoard.style.height = 150+"%";
        uploading = true;

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        
        

    }

// 자르기 버튼 클릭
function CropImage()
{   mode = "crop";
    
}

// 저장 기능
const setCanvasBackground = () => {
    context.fillStyle = "#fff";
    context.fillRect(0,0,canvas.width, canvas.height);
   
}
window.addEventListener("load",() => {
    canvas.width= canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
});

   saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
   });

//텍스트 폰트 지정
var  fontChange = function(value){
    selectFont = value;
    $('f').val(value);
    if(value==="돋음"){
        font = fontSize+'px Dotum';
    }
    else if(value==="바탕"){
        font = fontSize+'px Batang';
    }
    else if(value==="궁서"){
        font = fontSize+'px Gungsuh';
    }
    else if(value==="굴림체"){
        font = fontSize+'px GulimChe';
    }
  
}

