var rowNum = 20;
var colNum = 30;
//游戏是否已结束
var overed = true;
//存放所有的二位数组
var alltds = [];
//当前的移动方向
var currentDir;
//得分
var totalScore = 0;
//记录当前蛇头所在位置
var headPosition = {
    x: 0,
    y: 8
};
//食物的位置
var foodPosition = {
    x:0,
    y:0
};
// 存放蛇身的数组
var bodys = [];

var gt = document.getElementById("gt");
var speed = document.getElementById("speed");
//移动间隔
var inter = speed.value * 1;

//定时器
var timer;

//初始化游戏，初始位置随机。初始方向向右
function initGame() {
    //游戏还未结束就点击重新开始
    if(timer) {
        clearInterval(timer);
        timer = null;
    }
    totalScore = 0;
    overed = false;
    //清空table
    gt.innerHTML = " ";
    //清空数组
    alltds = [];
    //清空尾巴
    bodys = [];
    //右键
    currentDir = 39;
    // 创建横向30，纵向20的td并添加到table
    for(var i = 0; i < rowNum; i++) {
        var tr = gt.insertRow(); 
        var tempArr = [];
        for(var j = 0; j < colNum; j++) {
            var td = tr.insertCell();
            td.setAttribute("state","normal");
            tempArr.push(td);            
        }
        alltds.push(tempArr);
    } 

    //随机生成蛇头位置
    headPosition.x = Math.floor(Math.random() * rowNum);
    headPosition.y = Math.floor(Math.random() * (colNum - 5));

    
    alltds[headPosition.x][headPosition.y].setAttribute("state","head");

   
    //随机生成食物
    generateFood();

    timer = setInterval(move, inter);
}

//随机生成食物位置(不能是身体)
function generateFood(){
    var flag = true;
    var x = 0, y = 0;
    while(flag) {
        x = Math.floor(Math.random()*rowNum);
        y = Math.floor(Math.random()*colNum);
        if(x === headPosition.x && y === headPosition.y) {
            continue;
        }
        flag = false;
        for(var i = 0; i < bodys.length; i++) {
            if(bodys[i].x === x && bodys[i].y === y) {
                flag = true;
                break;
            }
        }
    }
    foodPosition.x = x;
    foodPosition.y = y;
    console.log(foodPosition);
    alltds[x][y].setAttribute("state", "food");
}

//监听键盘事件，控制蛇头位置
document.body.onkeydown = function(e) {
    if(overed) {
        return;
    }
    if(e.keyCode < 37 || e.keyCode > 40) {
        return;
    }
    // 不能反方向
    if(Math.abs(currentDir - e.keyCode) != 2) {
        currentDir = e.keyCode;        
        move();
        clearInterval(timer);
        timer = setInterval(move, inter);
    }
}

//蛇头移动
function move() {
    //判断移动之后是否失败
    isOver(currentDir);
    //移动蛇身
    bodyMove();
    //移动蛇头
    alltds[headPosition.x][headPosition.y].setAttribute("state","normal");
    if(currentDir === 37) {
        // 左
        if(headPosition.y>0){
            headPosition.y--;                    
        }
    }else if(currentDir === 39) {
        //右
        if(headPosition.y < colNum-1){
            headPosition.y++;                    
        }
    }else if(currentDir === 38) {
        //上
        if(headPosition.x > 0){
            headPosition.x--;                
        }
    }else if(currentDir === 40) {
        //下
        if(headPosition.x < rowNum-1) {
            headPosition.x++;                            
        }
    }
    //判断是否碰触自身
    isTouchBody();
    //判断蛇头是否碰触到食物
    if(headPosition.x === foodPosition.x && headPosition.y === foodPosition.y) {
        //增加一个蛇身
        for(var i = 0; i < 6; i++){
            var b = {
                x: headPosition.x,
                y: headPosition.y
            };
            bodys.push(b);
            totalScore++;
        }
        var s = document.getElementById("score");
        s.textContent = "得分：" + totalScore;
    
        //再生成一个食物
        generateFood();
    }
    //绘制蛇头
    alltds[headPosition.x][headPosition.y].setAttribute("state","head");
    //重新画蛇身
    for(var i = bodys.length - 1; i >= 0 ; i--) {
        var td = alltds[bodys[i].x][bodys[i].y];
        td.setAttribute("state", "body"); 
        var color = Math.floor(200 / (bodys.length + 1) * i);   
        td.style.backgroundColor = "rgb(255,180," + color +")";
    }
}

//蛇身移动函数
function bodyMove() {
    for(var i = bodys.length - 1; i > 0; i--) {
        var td = alltds[bodys[i].x][bodys[i].y]
        td.setAttribute("state","normal");
        td.removeAttribute("style");
        bodys[i].x = bodys[i-1].x;        
        bodys[i].y = bodys[i-1].y;
    }
    if(bodys.length > 0) {
        var td = alltds[bodys[0].x][bodys[0].y];        
        td.setAttribute("state","normal");
        td.removeAttribute("style");
        bodys[0].x = headPosition.x;    
        bodys[0].y = headPosition.y;    
    }
}

//判断是否超界
function isOver(dir) {
    if(dir === 37) {
        // 左
        if(headPosition.y <= 0){
            gameOver();                   
        }
    }else if(dir === 39) {
        //右
        if(headPosition.y >= colNum-1){
            gameOver();                    
        }
    }else if(dir === 38) {
        //上
        if(headPosition.x <= 0){
            gameOver();               
        }
    }else if(dir === 40) {
        //下
        if(headPosition.x >= rowNum-1) {
            gameOver();                            
        }
    }
}

//判断蛇头是否触碰到蛇身
function isTouchBody() {
    if(overed){
        return;
    }
    for(var i = 0; i < bodys.length; i++) {
        if(headPosition.x === bodys[i].x && headPosition.y === bodys[i].y) {
            gameOver();
            break;
        }
    }
}

function gameOver() {
    overed = true;
    clearInterval(timer);
    timer = null;
    alert("游戏结束");
}

//重新开始
function btnClick() {
    inter = speed.value * 1;
    initGame();
}

initGame();






