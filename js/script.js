// 全局变量
var main,allRow,grade,stopFlag,speed,maxgrade,maxspeed,kuang = false;

/* 文档加载完毕后 */
window.onload = function(){
    // 黑白格容器
    main = document.getElementById('mainID');
    // 每一行黑白格
    allRow = getAllRow();
    // 当前分数、速度、历史分数、历史速度
    grade = document.getElementById('grade');
    speed = document.getElementById('speed');
    maxgrade = document.getElementById('maxgrade');
    maxspeed = document.getElementById('maxspeed');

    //点击开始游戏
    var play = document.getElementById('play');
    play.onclick = startGame;
    // 点击暂停游戏
    var pause = document.getElementById('pause');
    pause.onclick = pauseGame;
    // 点击停止游戏
    var stop = document.getElementById('stop');
    stop.onclick = stopGame;

    //按键控制
    document.onkeyup = function(event) {
        keyPlay(event);
    };

    // 动画效果
    kuang = document.getElementById('kuang');
};

/* 得到每一行黑白格 */
function getAllRow(){
    allRow = []; // 储存为数组
    var row01 = document.getElementById('row01');
    var row02 = document.getElementById('row02');
    var row03 = document.getElementById('row03');
    var row04 = document.getElementById('row04');
    var row05 = document.getElementById('row05');
    //allRow[0] 到 allRow[4] ，从界面来看是从下往上的
    allRow.push(row05);
    allRow.push(row04);
    allRow.push(row03);
    allRow.push(row02);
    allRow.push(row01);

    initAllRowInfo();
    return allRow;
}

/* 初始化allRow数组的信息 */
function initAllRowInfo(){
    for(var i = 0 ; i<allRow.length; i++){
        //添加新属性 标识每一行是否有黑格，还有黑格的位置
        allRow[i].hasBlackGrid = false;
        allRow[i].blackGridPos = -1;
        allRow[i].preBlackGridPos = -1;

        //黑格全部变为白格
        var row = allRow[i].getElementsByTagName('div');
        for(var j = 0; j < row.length; j++) {
            row[j].style.background = 'rgba(0,0,0,0.2)';
            row[j].rowPos = i; //表示在allRow的哪一位置
            row[j].colPos = j; //表示在该行中的哪个位置
        }
    }

}

/* 点击开始游戏 */
function startGame() {
    stopFlag = false;
    main.style.borderTop = 'none';
    main.style.borderBottom = 'none';
    velocity = 1;
    initialGame();
}


/* 初始化游戏，包括黑白格 */
function initialGame(){
    kuang.classList.add('kuang'); // 添加动画效果
    rowMove(15);     //移动黑白格
}


var timer,timer1;
//表示位移速度（定时器每触发黑白格移动的像素）
var velocity = 1.0 ; 
//tSpeed表示时间速度（定时器隔多久触发）
function rowMove(tSpeed){
    clearInterval(timer);
    clearInterval(timer1);
    //让每一行黑白格进行定时移动
    //用于延迟黑格的加入 调用函数很快 判断次数减少
    var n = 1;
    //准备接触底部的没有黑格
    var hasBlack = false; 
    timer = setInterval(function(){
        //标识该行是否已从上往下移出了容器，如果是，则对allRow中的顺序进行调整
        var flag = false;
        var k;
        for(var i = 0 ; i < allRow.length ; i++){
            var obj = allRow[i];
            var obj2;
            //判断游戏是否结束
            isGameOver(obj);
            if(obj.offsetTop >= 530) {
                //有行移出了容器，那么该行一定是allRow[0]
                flag = true; 
                obj.style.top = '-120px';
                obj2 = allRow[allRow.length-1];
                //延迟时间已到并且该行木有黑格 将一行白格中的一个变为黑格
                if(n>50 && !obj.hasBlackGrid) {
                    for(var j = 0, l = obj.getElementsByTagName('div') ; j < l.length;j++){
                        l[j].style.backgroundColor = 'rgba(0,0,0,0.2)';
                    }
                    //随机一行中第几个白格变成黑格
                    // console.log('1. k的值为'+k);
                    // console.log('1. preBlackGridPos'+obj2.preBlackGridPos);
                    // console.log('1. obj2的值为'+obj2.blackGridPos);
                    // console.log('1. obj的值为'+obj.blackGridPos);
                    k = Math.floor(Math.random()*4);
                    
                    while(k == obj2.preBlackGridPos || k == obj2.blackGridPos){
                        k = Math.floor(Math.random()*4);
                        // console.log('2. k的值为'+k);
                        // console.log('2. obj2的值为'+obj2.blackGridPos);
                    }
                    obj.getElementsByTagName('div')[k].style.background = '#000';
                    obj.hasBlackGrid = true;
                    obj.blackGridPos = k;
                    // console.log('obj的值为'+obj.blackGridPos);
                    console.log('下一个');
                    //游戏中有黑格了
                    hasBlack = true;
                    
                }
            }
            obj.style.top = obj.offsetTop + velocity + 'px';
            
        }

        if(!hasBlack) {
            n++;
        }
        //对移出该容器的行在allRow中的顺序进行调整，移出容器的行移动到allRow的尾部
        if(flag){
            var tempRow01 = allRow[0];
            allRow.shift(); //删除数组的第一个元素
            allRow.push(tempRow01); //将原来位置第一的元素加入到数组的尾部
        }
    },tSpeed);
    if(velocity<=10){
        timer1 = setInterval(function(){
            velocity = velocity+0.1;
            speed.innerHTML = velocity.toFixed(1);
        },1000)
    }


}

// 暂停游戏
function pauseGame() {
    clearInterval(timer);
    clearInterval(timer1);
    kuang.classList.remove('kuang');
    stopFlag = true;
}

// 停止游戏
function stopGame() {
    grade.innerHTML = '0';
    clearInterval(timer);
    clearInterval(timer1);
    kuang.classList.remove('kuang');
    stopFlag = true;

    main.style.borderTop = '1px solid darkturquoise';
    main.style.borderBottom = '1px solid darkturquoise';

    //每一行的位置初始化
    allRow[0].style.top = 400 + 'px';
    allRow[1].style.top = 270 + 'px';
    allRow[2].style.top = 140 + 'px';
    allRow[3].style.top = 10 + 'px';
    allRow[4].style.top = -120 + 'px';
    initAllRowInfo();
}

// 键盘控制
function keyPlay(event) {
    event = event || window.event ;
    if(event.keyCode == 113){
        startGame();  // F2键
    } else if(event.keyCode == 32){
        pauseGame(); // 空格键
    } else if(event.keyCode == 82 || event.keyCode == 84 || event.keyCode == 89 || event.keyCode == 85){
        // R:82 T:84 Y:89 U:85
        if(!stopFlag) {
            var blackRowPos = -1; // 标识具有黑格的行
            var blackGridPos = -1; // 标识该行黑格的具体位置
            for(var i = 0 ; i < allRow.length ;i++){
                if(allRow[i].hasBlackGrid){
                    blackRowPos = i;
                    blackGridPos = allRow[i].blackGridPos;
                    break;
                }
            }

            if(blackRowPos != -1 && blackGridPos != -1){
                //对应黑格的位置，按了正确的键
                if((event.keyCode == 82 && blackGridPos == 0)
                    || (event.keyCode == 84 && blackGridPos == 1)
                    || (event.keyCode == 89 && blackGridPos == 2)
                    || (event.keyCode == 85 && blackGridPos == 3)) {
                    rightChange(blackRowPos, blackGridPos);   
                }else {
                    var errorGrid;
                    if(event.keyCode == 82) {
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[0];
                    }else if(event.keyCode == 84){
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[1];
                    }else if(event.keyCode == 89){
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[2];
                    }else if(event.keyCode == 85){
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[3];
                    }
                    //游戏结束
                    gameOver(errorGrid);
                }
            }
        }
    }
    
}

//当踩到黑格时，黑格颜色发生“正确”变化（通知用户）
// blackRowPos 黑格所在的行在allRow中的位置； blackGridPos 黑格在该行中的位置
function rightChange(blackRowPos, blackGridPos) {
    //修改标志
    allRow[blackRowPos].hasBlackGrid = false;
    allRow[blackRowPos].preBlackGridPos = allRow[blackRowPos].blackGridPos ;
    allRow[blackRowPos].blackGridPos = -1;
    grade.innerHTML = (parseInt(grade.innerHTML) + 1) ;
    var grid = allRow[blackRowPos].getElementsByTagName('div')[blackGridPos];
 
    grid.style.background = 'rgba(0,0,0,0.5)';
}

// 判断游戏是否结束
function isGameOver(obj){
    var temp1 = obj.offsetTop + obj.offsetHeight;
    var temp2 = main.offsetHeight -20;
    if(temp1 > temp2){
        if(obj.hasBlackGrid) {
            // 把标记还原为只有白格的
            obj.hasBlackGrid = false ;
            var index = obj.blackGridPos ;
            obj.blackGridPos = -1;
            gameOver(obj.getElementsByTagName('div')[index]);
        }
    }
}

//游戏结束
function gameOver(errorGrid) {
    errorGrid.style.background = 'red';
    if(parseInt(grade.innerHTML)>parseInt(maxgrade.innerHTML)){
        maxgrade.innerHTML = parseInt(grade.innerHTML);
    }
    if(parseFloat(speed.innerHTML)>parseFloat(maxspeed.innerHTML)){
        maxspeed.innerHTML = parseFloat(speed.innerHTML).toFixed(1) ;
    }
    setTimeout(function() {
        errorGrid.style.background = 'rgba(0,0,0,0.2)';
        setTimeout(function() {
            errorGrid.style.background = 'red';
            alert('游戏结束，您最后的得分是：' + grade.innerHTML + '！');
            stopGame();
        }, 100);
    }, 100);
}