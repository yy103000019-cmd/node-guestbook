var canvas = document.getElementById('canvas'); // 取得畫布元素
var ctx = canvas.getContext('2d'); // 使用2D繪圖

var toshow = document.getElementById('toshow'); // 按鈕產生圖
var show = document.getElementById('show'); 	// 顯示圖
var clear = document.getElementById('clear'); // 按鈕清除
var drawing = false;	//判斷是否正在繪圖
var queue = [];		//佇列結構依序產生筆畫
//自訂繪圖函式，x,y起始、x1,y1結束
function drawLine(ctx,x,y,x1,y1) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.closePath();
    ctx.stroke();

    //滑鼠左鍵按下
canvas.addEventListener('mousedown', function(e) {
    if(!drawing) { 		//預設為false，加!變相反
        drawing = true;	//繪圖狀態啟動true
	  // e為事件者(游標)的當下位置，偏移位置讓落點好看
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,x,y,x,y);	//起始位置繪圖
        queue.push([x,y]);	//依序將經過的路徑放入佇列
    }
});
//滑鼠移動
canvas.addEventListener('mousemove', function(e) {
    if(drawing) {	//按著滑鼠時為true
        var old = queue.shift();	//依序移除佇列，取得剛剛路徑
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0],old[1],x,y);	//持續繪圖(舊>新)
        queue.push([x,y]);	//持續更新新位置
    }
});
//滑鼠左鍵起來
canvas.addEventListener('mouseup', function(e) {
    if(drawing) {
        var old = queue.shift();		//依序移除佇列
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0], old[1], x, y);	//最後位置繪圖
        drawing = false;	//結束繪圖狀態
    }
}