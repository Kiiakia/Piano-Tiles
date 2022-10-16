// 设定一些全局变量
var main1,allRow1,grade1,stopFlag,speed1,maxgrade,maxspeed,kuang1,kuang2,main2,allRow2,grade2,speed2= false;

/* 文档加载完毕后 */
window.onload = function(){
    // 黑白格容器
    main1 = document.getElementById('mainID1');
    main2 = document.getElementById('mainID2');
    // 每一行黑白格
    allRow1 = getAllRow1();
    allRow2 = getAllRow2();

    // 玩家1和2当前分数、速度、历史分数、历史速度
    grade1 = document.getElementById('grade1');
    speed1 = document.getElementById('speed1');
    grade2 = document.getElementById('grade2');
    speed2 = document.getElementById('speed2');
    maxgrade = document.getElementById('maxgrade');
    maxspeed = document.getElementById('maxspeed');

    //点击开始游戏
    var play1 = document.getElementById('play1');
    play1.onclick = startGame1;
    var play2 = document.getElementById('play2');
    play2.onclick = startGame2;
    // 点击暂停游戏
    var pause = document.getElementById('pause');
    pause.onclick = pauseGame;
    // 点击停止游戏
    var stop1 = document.getElementById('stop1');
    stop1.onclick = stopGame1;
    var stop2 = document.getElementById('stop2');
    stop2.onclick = stopGame2;
    //按键控制
    document.onkeyup = function(event) {
        keyPlay(event);
    };

    // 动画效果
    kuang1 = document.getElementById('kuang1');
    kuang2 = document.getElementById('kuang2');
};


/* 得到每一行黑白格 */
function getAllRow1(){
    allRow1 = []; // 储存为数组
    var row01 = document.getElementById('row01');
    var row02 = document.getElementById('row02');
    var row03 = document.getElementById('row03');
    var row04 = document.getElementById('row04');
    var row05 = document.getElementById('row05');
    //allRow1[0] 到 allRow1[4] ，从界面来看是从下往上的
    allRow1.push(row05);
    allRow1.push(row04);
    allRow1.push(row03);
    allRow1.push(row02);
    allRow1.push(row01);

    initAllRowInfo();
    return allRow1;
}

function getAllRow2(){
    allRow2 = []; // 储存为数组
    var row06 = document.getElementById('row06');
    var row07 = document.getElementById('row07');
    var row08 = document.getElementById('row08');
    var row09 = document.getElementById('row09');
    var row10 = document.getElementById('row10');
    //allRow2[0] 到 allRow2[4] ，从界面来看是从下往上的
    allRow2.push(row10);
    allRow2.push(row09);
    allRow2.push(row08);
    allRow2.push(row07);
    allRow2.push(row06);

    initAllRowInfo2();
    return allRow2;
}


/* 初始化allRow数组的信息 */
function initAllRowInfo(){
    for(var i = 0 ; i<allRow1.length; i++){
        //添加新属性 标识每一行是否有黑格，还有黑格的位置
        allRow1[i].hasBlackGrid = false;
        allRow1[i].blackGridPos = -1;
        allRow1[i].preBlackGridPos = -1;

        //全部变为白格
        var row = allRow1[i].getElementsByTagName('div');
        for(var j = 0; j < row.length; j++) {
            row[j].style.background = 'rgba(0,0,0,0.2)';
            row[j].rowPos = i; //表示在allRow的哪一位置
            row[j].colPos = j; //表示在该行中的哪个位置
        }
    }

}

function initAllRowInfo2(){
    for(var i = 0 ; i<allRow2.length; i++){
        //添加新属性 标识每一行是否有黑格，还有黑格的位置
        allRow2[i].hasBlackGrid = false;
        allRow2[i].blackGridPos = -1;
        allRow2[i].preBlackGridPos = -1;

        //全部变为白格
        var row = allRow2[i].getElementsByTagName('div');
        for(var j = 0; j < row.length; j++) {
            row[j].style.background = 'rgba(0,0,0,0.2)';
            row[j].rowPos = i; //表示在allRow的哪一位置
            row[j].colPos = j; //表示在该行中的哪个位置
        }
    }

}

/* 点击开始游戏 */
//单人版
function startGame1(){
    stopFlag = false;
    main1.style.borderTop = 'none';
    main1.style.borderBottom = 'none';
    velocity1 = 1;
    initialGame1();
}

//双人版
function startGame2() {
    stopFlag = false;
    main1.style.borderTop = 'none';
    main1.style.borderBottom = 'none';
    main2.style.borderTop = 'none';
    main2.style.borderBottom = 'none';
    velocity1 = 1;
    velocity2 = 1;
    initialGame1();
    initialGame2();
}


/* 初始化游戏，包括黑白格 */
function initialGame1(){
    // 添加动画效果
    kuang1.classList.add('kuang'); 
    //移动黑白格
    rowMove1(15);     
}
function initialGame2(){
    // 添加动画效果
    kuang2.classList.add('kuang');
    //移动黑白格     
    rowMove2(15);
}


// 全局变量，用来停止计时器
var timer10,timer11,timer20,timer21;
//表示位移速度（定时器每触发黑白格移动的像素）
var velocity1 = 1.0 ,velocity2 = 1.0; 
//tSpeed表示时间速度（定时器隔多久触发）
function rowMove1(tSpeed){
    clearInterval(timer10);
    clearInterval(timer11);
    //让每一行黑白格进行定时移动
    //用于延迟黑格的加入 调用函数很快 判断次数减少
    var n = 1;
    //准备接触底部的没有黑格
    var hasBlack = false; 
    timer10 = setInterval(function(){
        //标识该行是否已从上往下移出了容器，如果是，则对allRow中的顺序进行调整
        var flag = false;
        var k;
        for(var i = 0 ; i < allRow1.length ; i++){
            var obj = allRow1[i];
            var obj2;
            //判断游戏是否结束
            isGameOver1(obj);
            if(obj.offsetTop >= 530) {
                //有行移出了容器，那么该行一定是allRow[0]
                flag = true; 
                obj.style.top = '-120px';
                obj2 = allRow1[allRow1.length-1];
                //延迟时间已到并且该行没有黑格 将一行白格中的一个变为黑格
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
                    
                    // 确保同一列相邻的两个元素不在同一行
                    while(k == obj2.preBlackGridPos || k == obj2.blackGridPos){
                        k = Math.floor(Math.random()*4);
                        // console.log('2. k的值为'+k);
                        // console.log('2. obj2的值为'+obj2.blackGridPos);
                    }
                    obj.getElementsByTagName('div')[k].style.background = '#000';
                    obj.hasBlackGrid = true;
                    obj.blackGridPos = k;
                    // console.log('obj的值为'+obj.blackGridPos);
                    //console.log('下一个');
                    //游戏中有黑格了
                    hasBlack = true;
                    
                }
            }
            // 在极短的时间间隔内移动，以实现钢琴向下移动的动画效果
            obj.style.top = obj.offsetTop + velocity1 + 'px';
        }
        if(!hasBlack) {
            n++;
        }

        //对移出该容器的行在allRow中的顺序进行调整，移出容器的行移动到allRow的尾部
        if(flag){
            var tempRow01 = allRow1[0];
            allRow1.shift(); //删除数组的第一个元素
            allRow1.push(tempRow01); //将原来位置第一的元素加入到数组的尾部
        }
    },tSpeed);
    // 实现越往下移速度越快
    if(velocity1<=10){
        timer11 = setInterval(function(){
            velocity1 = velocity1+0.1;
            speed1.innerHTML = velocity1.toFixed(1);
        },1000)
    }


}

// 玩家2的移动函数
function rowMove2(tSpeed){
    clearInterval(timer20);
    clearInterval(timer21);
    //让每一行黑白格进行定时移动
    //用于延迟黑格的加入 调用函数很快 判断次数减少
    var n = 1;
    //准备接触底部的没有黑格
    var hasBlack = false; 
    timer20 = setInterval(function(){
        //标识该行是否已从上往下移出了容器，如果是，则对allRow中的顺序进行调整
        var flag = false;
        var k;
        for(var i = 0 ; i < allRow2.length ; i++){
            var obj = allRow2[i];
            var obj2;
            //判断游戏是否结束
            isGameOver2(obj);
            if(obj.offsetTop >= 530) {
                //有行移出了容器，那么该行一定是allRow[0]
                flag = true; 
                obj.style.top = '-120px';
                obj2 = allRow2[allRow2.length-1];

                if(n>50 && !obj.hasBlackGrid) {
                    for(var j = 0, l = obj.getElementsByTagName('div') ; j < l.length;j++){
                        l[j].style.backgroundColor = 'rgba(0,0,0,0.2)';
                    }
                
                    k = Math.floor(Math.random()*4);
                    
                    while(k == obj2.preBlackGridPos || k == obj2.blackGridPos){
                        k = Math.floor(Math.random()*4);
                    }
                    obj.getElementsByTagName('div')[k].style.background = '#000';
                    obj.hasBlackGrid = true;
                    obj.blackGridPos = k;
                    //游戏中有黑格了
                    hasBlack = true;
                    
                }
            }
            obj.style.top = obj.offsetTop + velocity2 + 'px';
            
        }

        if(!hasBlack) {
            n++;
        }
        //对移出该容器的行在allRow中的顺序进行调整，移出容器的行移动到allRow的尾部
        if(flag){
            var tempRow01 = allRow2[0];
            allRow2.shift(); //删除数组的第一个元素
            allRow2.push(tempRow01); //将原来位置第一的元素加入到数组的尾部
        }
    },tSpeed);
    if(velocity2<=10){
        timer21 = setInterval(function(){
            velocity2 = velocity2+0.1;
            speed2.innerHTML = velocity2.toFixed(1);
        },1000)
    }
}

// 暂停游戏（同时暂停玩家1和2的游戏）
function pauseGame() {
    clearInterval(timer10);
    clearInterval(timer11);
    clearInterval(timer20);
    clearInterval(timer21);
    kuang1.classList.remove('kuang');
    kuang2.classList.remove('kuang');
    stopFlag = true;
}

// 停止游戏
function stopGame1() {
    grade1.innerHTML = '0';
    clearInterval(timer10);
    clearInterval(timer11);
    kuang1.classList.remove('kuang');
    main1.style.borderTop = '1px solid darkturquoise';
    main1.style.borderBottom = '1px solid darkturquoise';
    //每一行的位置初始化
    allRow1[0].style.top = 400 + 'px';
    allRow1[1].style.top = 270 + 'px';
    allRow1[2].style.top = 140 + 'px';
    allRow1[3].style.top = 10 + 'px';
    allRow1[4].style.top = -120 + 'px';
    initAllRowInfo();
}

function stopGame2(){
    grade2.innerHTML = '0';
    clearInterval(timer20);
    clearInterval(timer21);
    kuang2.classList.remove('kuang');
    stopFlag = true;
    main2.style.borderTop = '1px solid darkturquoise';
    main2.style.borderBottom = '1px solid darkturquoise';
    allRow2[0].style.top = 400 + 'px';
    allRow2[1].style.top = 270 + 'px';
    allRow2[2].style.top = 140 + 'px';
    allRow2[3].style.top = 10 + 'px';
    allRow2[4].style.top = -120 + 'px';
    initAllRowInfo2();
}

// 键盘控制
function keyPlay(event) {
    event = event || window.event ;
    if(event.keyCode == 113){
        startGame1();  // F2键
    } else if(event.keyCode == 114){
        startGame(); // F3键
    } else if(event.keyCode == 32){
        pauseGame(); // 空格键
    } else if(event.keyCode == 115){
        pauseGame(); // 空格键
    } else if(event.keyCode == 82 || event.keyCode == 84 || event.keyCode == 89 || event.keyCode == 85){
        // R:82 T:84 Y:89 U:85
        if(!stopFlag) {
            var blackRowPos = -1; // 标识具有黑格的行
            var blackGridPos = -1; // 标识该行黑格的具体位置
            for(var i = 0 ; i < allRow1.length ;i++){
                if(allRow1[i].hasBlackGrid){
                    blackRowPos = i;
                    blackGridPos = allRow1[i].blackGridPos;
                    break;
                }
            }

            if(blackRowPos != -1 && blackGridPos != -1){
                //对应黑格的位置，按了正确的键
                if((event.keyCode == 82 && blackGridPos == 0)
                    || (event.keyCode == 84 && blackGridPos == 1)
                    || (event.keyCode == 89 && blackGridPos == 2)
                    || (event.keyCode == 85 && blackGridPos == 3)) {
                    rightChange1(blackRowPos, blackGridPos);   
                }else {
                    var errorGrid1=null;
                    if(event.keyCode == 82) {
                        errorGrid1 = allRow1[blackRowPos].getElementsByTagName('div')[0];
                    }else if(event.keyCode == 84){
                        errorGrid1 = allRow1[blackRowPos].getElementsByTagName('div')[1];
                    }else if(event.keyCode == 89){
                        errorGrid1 = allRow1[blackRowPos].getElementsByTagName('div')[2];
                    }else if(event.keyCode == 85){
                        errorGrid1 = allRow1[blackRowPos].getElementsByTagName('div')[3];
                    }
                    gameOver1(errorGrid1);
                } 
            }
        }
    }else if(event.keyCode == 70 || event.keyCode == 71 || event.keyCode == 72 || event.keyCode == 74){
        // F:70 G:71 H:72 J:74
        if(!stopFlag) {
            var blackRowPos = -1; // 标识具有黑格的行
            var blackGridPos = -1; // 标识该行黑格的具体位置
            for(var i = 0 ; i < allRow2.length ;i++){
                if(allRow2[i].hasBlackGrid){
                    blackRowPos = i;
                    blackGridPos = allRow2[i].blackGridPos;
                    break;
                }
            }

            if(blackRowPos != -1 && blackGridPos != -1){
                //对应黑格的位置，按了正确的键
                if((event.keyCode == 70 && blackGridPos == 0)
                    || (event.keyCode == 71 && blackGridPos == 1)
                    || (event.keyCode == 72 && blackGridPos == 2)
                    || (event.keyCode == 74 && blackGridPos == 3)) {
                    rightChange2(blackRowPos, blackGridPos);   
                }else {
                    var errorGrid2;
                    if(event.keyCode == 70) {
                        errorGrid2 = allRow2[blackRowPos].getElementsByTagName('div')[0];
                    }else if(event.keyCode == 71){
                        errorGrid2 = allRow2[blackRowPos].getElementsByTagName('div')[1];
                    }else if(event.keyCode == 72){
                        errorGrid2 = allRow2[blackRowPos].getElementsByTagName('div')[2];
                    }else if(event.keyCode == 74){
                        errorGrid2 = allRow2[blackRowPos].getElementsByTagName('div')[3];
                    }
                    //游戏结束
                    gameOver2(errorGrid2);
                }
            }
        }
    }
    
}

//当踩到黑格时，黑格颜色发生“正确”变化（通知用户）
// blackRowPos 黑格所在的行在allRow中的位置； blackGridPos 黑格在该行中的位置
function rightChange1(blackRowPos, blackGridPos) {
    //修改标志
    allRow1[blackRowPos].hasBlackGrid = false;
    allRow1[blackRowPos].preBlackGridPos = allRow1[blackRowPos].blackGridPos ;
    allRow1[blackRowPos].blackGridPos = -1;
    grade1.innerHTML = (parseInt(grade1.innerHTML) + 1) ;
    var grid = allRow1[blackRowPos].getElementsByTagName('div')[blackGridPos];
 
    grid.style.background = 'rgba(0,0,0,0.5)';
}
function rightChange2(blackRowPos, blackGridPos) {
    //修改标志
    allRow2[blackRowPos].hasBlackGrid = false;
    allRow2[blackRowPos].preBlackGridPos = allRow2[blackRowPos].blackGridPos ;
    allRow2[blackRowPos].blackGridPos = -1;
    grade2.innerHTML = (parseInt(grade2.innerHTML) + 1) ;
    var grid = allRow2[blackRowPos].getElementsByTagName('div')[blackGridPos];
 
    grid.style.background = 'rgba(0,0,0,0.5)';
}

// 判断游戏是否结束
function isGameOver1(obj){
    var temp1 = obj.offsetTop + obj.offsetHeight;
    var temp2 = main1.offsetHeight -20;
    if(temp1 > temp2){
        if(obj.hasBlackGrid) {
            // 把标记还原为只有白格的
            obj.hasBlackGrid = false ;
            var index = obj.blackGridPos ;
            obj.blackGridPos = -1;
            gameOver1(obj.getElementsByTagName('div')[index]);
        }
    }
}
function isGameOver2(obj){
    var temp1 = obj.offsetTop + obj.offsetHeight;
    var temp2 = main2.offsetHeight -20;
    if(temp1 > temp2){
        if(obj.hasBlackGrid) {
            // 把标记还原为只有白格的
            obj.hasBlackGrid = false ;
            var index = obj.blackGridPos ;
            obj.blackGridPos = -1;
            gameOver2(obj.getElementsByTagName('div')[index]);
        }
    }
}

function max(a,b,c){
    if(a>b){
        if(a>c)
            return a;
        else
            return c;
    }else{
        if(b>c)
            return b;
        else
            return c;
    }
}
//游戏结束
function gameOver1(errorGrid) {
    errorGrid.style.background = 'red';
    maxgrade.innerHTML = max(parseInt(grade1.innerHTML),parseInt(grade2.innerHTML),parseInt(maxgrade.innerHTML));
    maxspeed.innerHTML = max(parseInt(speed2.innerHTML),parseInt(speed1.innerHTML),parseInt(maxspeed.innerHTML));
    setTimeout(function() {
        errorGrid.style.background = 'red';
        alert('游戏结束，玩家1您最后的得分是：' + grade1.innerHTML + '！');
        stopGame1();
    }, 100);
}

function gameOver2(errorGrid) {
    errorGrid.style.background = 'red';
    maxgrade.innerHTML = max(parseInt(grade1.innerHTML),parseInt(grade2.innerHTML),parseInt(maxgrade.innerHTML));
    maxspeed.innerHTML = max(parseInt(speed2.innerHTML),parseInt(speed1.innerHTML),parseInt(maxspeed.innerHTML));
    setTimeout(function() {
        errorGrid.style.background = 'red';
        alert('游戏结束，玩家2您最后的得分是：' + grade2.innerHTML + '！');
        stopGame2();
    }, 100);
}