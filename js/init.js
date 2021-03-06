﻿
document.addEventListener('DOMContentLoaded',function(){
    var oC = document.getElementById('c1');
    var gd = oC.getContext('2d');
    var out = 50;
    var direction =[-out,out];
    var rule = 0.05;
    loadImage(resource,function(){
        //用来存放所有生成的炮弹
        var arrBullet = [];
        var arrFish = [];
        var arrCoin = [];
        var arrDieFish = [];
        var arrWeb = [];
        //画炮
        var c = new Cannon(7);
        setInterval(function () {
            gd.clearRect(0,0,oC.width,oC.height);
            //画炮台
            gd.drawImage(JSON['bottom'],
                0,0,765,70,
                0,532,765,70
            );
            c.draw(gd);
            //画炮弹
            for(var i = 0;i<arrBullet.length;i++){
                arrBullet[i].draw(gd);
            }
            //炮弹性能优化
            for(var i = 0;i<arrBullet.length;i++){
                if(arrBullet[i].x<out||arrBullet[i].x>oC.width+out||arrBullet[i].y<out||arrBullet[i].y>oC.height+out){
                    arrBullet.splice(i,1);
                    i--;
                }
            }

            if(Math.random()<rule){
                //生成鱼
                direction.sort(function(){
                    return Math.random()-0.5;
                });
                if(direction[0]<0){
                    var f1 = new Fish(rnd(1,6));
                    f1.x = 0 - out;
                    f1.y = rnd(out,oC.height-out);
                    f1.rotate = rnd(-45,45);
                    arrFish.push(f1);

                }else{
                    var f1 = new Fish(rnd(1,6));
                    f1.x = oC.width + out;
                    f1.y = rnd(out,oC.height-out);
                    f1.rotate = rnd(135,225);
                    arrFish.push(f1);

                }
            }
            //画鱼
            for(var i = 0;i<arrFish.length;i++){
                arrFish[i].draw(gd);
            }
            //画金币
            for(var i = 0;i<arrCoin.length;i++){
                arrCoin[i].draw(gd);
            }
            //画死鱼
            for(var i = 0;i<arrDieFish.length;i++){
                arrDieFish[i].draw(gd);
            }
            //画网
            for(var i = 0;i<arrWeb.length;i++){
                arrWeb[i].draw(gd);
                arrWeb[i].scale+=0.01;
                if(arrWeb[i].scale>1.2){
                    arrWeb.splice(i,1);
                    i--;
                }
            }

            //鱼性能优化
            for(var i = 0;i<arrFish.length;i++){
                if(arrFish[i].x<-out||arrFish[i].x>oC.width+out||arrFish[i].y<out||arrFish[i].y>oC.height+out){
                    arrFish.splice(i,1);
                    i--;
                }
                //判断 所有的鱼跟所有的子弹
                for(var i = 0;i<arrFish.length;i++){
                    for(var j = 0;j<arrBullet.length;j++){

                        if(arrFish[i].isIn(arrBullet[j].x,arrBullet[j].y)){
                            var x = arrFish[i].x;
                            var y = arrFish[i].y;
                            var type = arrFish[i].type;
                            var rotate = arrFish[i].rotate;
                            //鱼死
                            arrFish.splice(i,1);
                            i--;
                            //子弹也死
                            arrBullet.splice(j,1);
                            j--;
                            //生成金币
                            var coin = new Coin(type);
                            coin.x = x;
                            coin.y = y;
                            coin.playSong();
                            arrCoin.push(coin);
                            //生成死鱼
                            var dieFish = new DieFish(type);
                            dieFish.x = x;
                            dieFish.y = y;
                            dieFish.rotate = rotate;
                            arrDieFish.push(dieFish);
                            setTimeout(function(){
                                arrDieFish.shift();
                            },500);
                            //生成渔网
                            var web = new Web();//type
                            web.x = x;
                            web.y = y;
                            arrWeb.push(web);

                        }

                    }
                }
            }
        },30);
        //点击转向
        oC.onclick = function(ev){
            var oA = new Audio();
            oA.src = 'snd/cannon.mp3';
            oA.play();
            var x = ev.clientX - oC.offsetLeft - c.x;
            var y = c.y - (ev.clientY -oC.offsetTop);
            var d =90 - a2d(Math.atan2(y,x));
            c.rotate = d;
            //炮 发射动作
            c.emitChange();
            var bullet = new Bullet(c.type);
            bullet.x = c.x;
            bullet.y = c.y;
            bullet.rotate = c.rotate;
            arrBullet.push(bullet);
        };

    });
},false);
