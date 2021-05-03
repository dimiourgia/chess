class Obj{
    constructor(pos,val){
    this.pos=pos;
    this.val=val;
    }
}

class pgnObj{
    constructor(event,site,date,round,white,black,result,movetext){
        this.event=event;
        this.date=date;
        this.round=round;
        this.white=white;
        this.black=black;
        this.result=result;
        this.movetext=movetext;
    }
}



class Move{
    map_c=[[]];
    constructor(from,to,piece,map_c,moveNumber,pieceCount,curnt_act_squr="",pre_act_sqr="",nxt_sqr="",incheck=false,mate=false,captured=false,promoted=""){
        this.from = from;
        this.to = to;
        this.piece = piece;
        for(i=0;i<map_c.length;i++){
            this.map_c[i] = map_c[i].slice();
        }
        this.moveNumber=moveNumber;
        this.curnt_act_squr=curnt_act_squr;
        this.pre_act_sqr=pre_act_sqr;
        this.nxt_sqr;
        this.incheck=incheck;
        this.mate=mate;
        this.captured=captured;
        this.promoted=promoted;
        this.pieceCount=pieceCount;
    }
}
map=    [
            ["wr","wn","wb","wq","wk","wb","wn","wr"],
            ["wp","wp","wp","wp","wp","wp","wp","wp"],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["bp","bp","bp","bp","bp","bp","bp","bp"],
            ["br","bn","bb","bq","bk","bb","bn","br"]        
        ];

        displayMap = [[]];
        for(i=0;i<8;i++)
            displayMap[i] = map[i].slice();

renderBoard('white','/images/pieces/',map);
//makeMove('e8c8');

var stockfish = new Worker('/js/stockfish.asm.js');
var pre_ar=[];
var curnt_act_sq_cl = "";
var pre_act_sq_cl = "";
var pre_act_sq_id = "";
var curnt_act_piece="";
var moveNumber=0;
var moves=[];
var availBackMoves=0;
var flipped=true;
var turn='w';
var drgend=true;
var last_x;
var last_y;
var hasBkMoved=false;
var hasWkMoved=false;
var whiteRookKmoved=false;
var whiteRookQmoved=false;
var BlackRookKmoved=false;
var BlackRookQmoved=false;
var whiteCastled = false;
var blackCastled = false;
var canBlackCastle_short=true;
var canBlackCastle_long=true;
var canWhiteCastle_short=true;
var canWhiteCastle_long=true;
var castled=false;
var castleType='';
var wpieceCount = [0,0,0,0,0,0];
var bpieceCount = [0,0,0,0,0,0];
var en="";
var currently_rendering=0;
var clickedActive="";
var showpp=false;
var player1='white';
var player2='black';
var computer = player2;

class LoggedMoves{
    constructor(log,piece,moveNumber){
        this.log=log;
        this.piece=piece;
        this.moveNumber=moveNumber;
    }
}
var loggedMoves=[];

var state = {'hasBkMoved':hasBkMoved,'hasWkMoved':hasWkMoved,'whiteRookKmoved':whiteRookKmoved
,'whiteRookQmoved':whiteRookQmoved,'blackRookKmoved':BlackRookKmoved,'blackRookQmoved':BlackRookQmoved,
'whiteCastled':whiteCastled,'blackCastled':blackCastled,'canWtcstlshort':canWhiteCastle_short,
'canWtcastlLong':canWhiteCastle_long,'canBlcastlshort':canBlackCastle_short,'canBlcastlLong':canBlackCastle_long,
'castled':castled}

//stockfish.postMessage('position fen 5rk1/pp1Q1pp1/5b1p/q1P4B/p2P4/8/6PP/5RK1 w - -');
//stockfish.postMessage('go to depth 20');
//stockfish.postMessage('eval');
//stockfish.onmessage =function(e){
//    console.log(e.data);
//}


//Initialize move array with current position
initializePieceCount();
var pieceCount=[]
pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
moves.push(new Move(00,00,"",map,0,pieceCount));
const board = document.querySelector("#board");
var pos=board.getBoundingClientRect();
var board_x = pos.left;
var board_y= pos.top+window.scrollY;
var sqr_size = Math.floor((pos.width)/8);


//makeMove('e8c8');
//mousedown and drag event
board.addEventListener('mousedown', (e)=>{
    var x= Math.ceil((e.pageX-board_x)/sqr_size);
    var y= Math.ceil((e.pageY-board_y)/sqr_size);
    last_x=x;
    last_y=y;

    if(flipped){
        y = 8-y+1;
    }
    else{
        x=8-x+1;
    }
   
    if(x>0 && x<9 && y>0 && y<9){
        var Id = "#square_"+y+"x"+x;
        var className = ".square_"+y+"x"+x;
    }

    var act_img = document.querySelector(Id);
    if(act_img != null){
        var src = act_img.getAttribute('src');
        curnt_img_src = src;
        curnt_act_piece = curnt_img_src.substr(curnt_img_src.length-6,2);
        if(turn==curnt_act_piece[0]){
       // removeActive();
       // removePreActive();
        makeActive(className);
        }
        act_img.addEventListener('dragstart', (e)=>{
            act_img.style.zindex = 3;
            curnt_act_sq_cl = className;
            pre_act_sq_id = Id;
            var imgNew = new Image();
            imgNew.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(imgNew, 0, 0);
        }, false);
        act_img.addEventListener('drag',(e) =>{
            if(turn==curnt_act_piece[0]){
            act_img.style.left = e.pageX-board_x-sqr_size/2 + "px";
            act_img.style.top = e.pageY-board_y-sqr_size/2 + "px";
            drgend=true;
            }
            else{drgend=false;}
        });
        
        }

});
//drag end event
board.addEventListener('dragend', (e)=>{
    
    if(drgend){
    removePossibleSquaresDisplay(pre_ar);
    var x= Math.ceil((e.pageX-board_x)/sqr_size);
    var y= Math.ceil((e.pageY-board_y)/sqr_size);
        cx =x;
        cy=y;
    if(flipped){
        y = 8-y+1;
    }
    else{
        x=8-x+1;
    }
    
    if(x>0 && x<9 && y>0 && y<9){
        var Id = "square_"+y+"x"+x;
        var className = ".square_"+y+"x"+x;
    }

   var yl = curnt_act_sq_cl.substr(8,1);
   var xl = curnt_act_sq_cl.substr(10,1);
   yl*=1;
   xl*=1;

    //incheck = (isInCheck(curnt_act_piece,tn(yl,xl),tn(y,x)));
    //console.log(allPossibleMoves(curnt_act_piece,tn(yl,xl),map));

    if(isPossibleMove(curnt_act_piece,tn(yl,xl),tn(y,x))){

        if(curnt_act_piece[1]=='r'){
            if(curnt_act_piece[0]=='w'){
                if(yl==1&&xl==1&&!whiteRookQmoved ){whiteRookQmoved=true; canWhiteCastle_long=false;}
                if(yl==1&&xl==8&&!whiteRookKmoved ) {whiteRookKmoved=true; canWhiteCastle_short=false;}
            }
            else{
                if(yl==8&&xl==1&&!BlackRookQmoved ) {BlackRookQmoved=true;canBlackCastle_long=false;}
                if(yl==8&&xl==8&&!BlackRookKmoved ) {BlackRookKmoved=true;canBlackCastle_short=false;}
            }
        }
     
    goahead=true;
    if(curnt_act_piece[1]=='k'){
        if((Math.abs(xl-x)>1)){
            goahead=false;
            console.log('trying long castle 1');
            if((y==1||y==8)&&(x==7||x==3)){
                console.log('trying long castle 2');
                if(x==7){
                    if(canCastle(curnt_act_piece[0],'short')){
                        doCastle(curnt_act_piece[0],'short');
                        goahead=true;
                    }
                    else if(canCastle(curnt_act_piece[0],'long')){
                        console.log('trying long castle');
                        doCastle(curnt_act_piece[0],'long');
                        goahead=true;
                    }
                }
            }
        }
        else if(Math.abs(xl-x)<=1) goahead=true;
        else goahead=false;
    }
  
        if(curnt_act_piece[1]=='k'&&(!hasBkMoved||!hasWkMoved&&goahead)){
           if(curnt_act_piece[0]=='w') hasWkMoved = true;
           else hasBkMoved = true;
       }
        ///////
        var state = {
            'hasBkMoved': hasBkMoved, 'hasWkMoved': hasWkMoved, 'whiteRookKmoved': whiteRookKmoved
            , 'whiteRookQmoved': whiteRookQmoved, 'blackRookKmoved': BlackRookKmoved, 'blackRookQmoved': BlackRookQmoved,
            'whiteCastled': whiteCastled, 'blackCastled': blackCastled, 'canWtcstlshort': canWhiteCastle_short,
            'canWtcastlLong': canWhiteCastle_long, 'canBlcastlshort': canBlackCastle_short, 'canBlcastlLong': canBlackCastle_long,
            'castled': castled
        }
////////
console.log(state);
        if(drgend){
            var tmap=[[]];
            for(i=0;i<8;i++) tmap[i]=map[i].slice();
            console.log(map,tmap);
            tmap[yl-1][xl-1]="";
            tmap[y-1][x-1]=curnt_act_piece;
            if(isInCheck(curnt_act_piece,tmap)){
                incheck=true;
            } 
            else incheck=false;
        }
        if(!incheck&&goahead){
            removePreActive();
            removeActive();
            pre_act_sq_cl = curnt_act_sq_cl;
            makePreActive(pre_act_sq_cl);
            curnt_act_sq_cl = className;
            makeActive(curnt_act_sq_cl);
            var act_img = document.querySelector(className);
  
            if(act_img != null){
                act_img.style.zindex = 1;
                var square = document.querySelector(className);
                newImg = document.createElement('img');
                newImg.src=curnt_img_src;
                newImg.setAttribute('id',Id);
                newImg.setAttribute('class','piece');
                square.appendChild(newImg);
                var preSquare = document.querySelector(pre_act_sq_cl);
                var child = document.querySelector(pre_act_sq_id);
                preSquare.removeChild(child);

                if(map[y-1][x-1]!=""){
                    var tmp = document.querySelector(".square_"+y+"x"+x);
                    var tmp_child = document.querySelector("#square_"+y+"x"+x);
                    tmp.removeChild(tmp_child);
                }

                moveNumber+=1;
                availBackMoves+=1;
                if(map[y-1][x-1]== "") captured=false;
                else{
                    captured = true;
                    capturedpiece = map[y-1][x-1][1];
                }
                map[y-1][x-1]=map[yl-1][xl-1];
                map[yl-1][xl-1]="";

                showpp=false;
                if(curnt_act_piece[1]=='p'){
                    if(y==8||y==1){
                        curnt_act_piece[0]=='w';
                        brd=document.querySelector('.board');
                        ch = document.createElement('span');
                        ch.setAttribute('class','pp');
                        ar=['q','n','b'];
                        
                        ar.forEach(e=>{
                            var tmp=document.createElement('img');
                            tmp.setAttribute('class','square');
                            tmp.setAttribute('src','images/pieces/'+curnt_act_piece[0]+e+'.png');
                            if(curnt_act_piece[0]=='w') num=ar.indexOf(e);
                            else num=3+ar.indexOf(e);
                            tmp.setAttribute('onclick','pawnPromote('+num+','+y+','+x+')');
                            ch.appendChild(tmp);
                        })
                        if(curnt_act_piece[0]=='w'){
                        if(flipped){
                            ch.style.left=(x-1)*sqr_size+'px';
                            ch.style.top='0px';
                        } 
                        else{
                            ch.style.left=(8-x)*sqr_size+'px';
                            ch.style.top=5*sqr_size+'px';
                        }
                        } 
                        if(curnt_act_piece[0]=='b'){
                            if(flipped){
                                ch.style.left=(x-1)*sqr_size+'px';
                                ch.style.top=5*sqr_size+'px';
                            } 
                            else{
                                ch.style.left=(8-x)*sqr_size+'px';
                                ch.style.top='0px';
                            }
                        }

                        brd.appendChild(ch);
                        showpp=true;
                    }
                    console.log("pawn");
                    if(Math.abs(xl-x)>0){
                        if(!captured){
                            captured=true;
                            capturedpiece = map[yl-1][x-1][1];
                            console.log("removing",".square_"+yl+"x"+x);
                            var tmp = document.querySelector(".square_"+yl+"x"+x);
                            var tmp_child = document.querySelector("#square_"+yl+"x"+x);
                            tmp.removeChild(tmp_child);
                            map[yl-1][x-1]="";
                        }
                    }
                }
                checked=false;
                mate=false;
                console.log(turn=='w'? 'b':'w');
                if(isInCheck(turn=='w'? 'b':'w',map)){
                    console.log(turn=='w'? 'b':'w','is in check');
                    checked=true;
                } 
                en="";
                if(curnt_act_piece[1]=='p'&&Math.abs(yl-y)>1){
                    en=turn;
                }
                if(captured){
                    playAudio('captured','forward');
                    switch(capturedpiece){case'p':indx=0;break;case'r':indx=1;break;case'n':indx=2;break;case'b':indx=3;break;case'q':indx=4;break;}
                    if(turn=='w') bpieceCount[indx]-=1;
                    else wpieceCount[indx]-=1;
                }
                else{
                playAudio('move','forward');
                }
                var pieceCount=[];
                pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                move = new Move(tn(yl,xl),tn(y,x),curnt_act_piece,map,moveNumber,pieceCount,curnt_act_sq_cl,pre_act_sq_cl,"",checked,mate,captured);
                showCaptured(move);
                moves.push(move);
                console.log(moves);
                currently_rendering=moveNumber;
                
                if(turn=='w')
                turn="b";
                else turn='w';
                moveLogger(move,captured,castled,castleType);
                castled=false;
                if(!(curnt_act_piece[0]=='p'&&(y==1||y==8)))
                setTimeout(onEngineMove(8),50000);
            }

        }
		else{
			var child = document.querySelector(pre_act_sq_id);
            if(flipped) yl=8-yl+1;
            else xl=8-xl+1;
			child.style.left = (xl-1)*sqr_size+"px";
			child.style.top = (yl-1)*sqr_size+"px";
		}
    }

    else{
        var child = document.querySelector(pre_act_sq_id);
        if(flipped) yl=8-yl+1;
        else xl=8-xl+1;
        child.style.left = (xl-1)*sqr_size+"px";
        child.style.top = (yl-1)*sqr_size+"px";
    }
    }
});
//pawnPromote('wq','square_8x6','square_8x6',8,6);
function pawnPromote(piece,row,col){
    ar=['wq','wn','wb','bq','bn','bb'];
    sqrCls='square_'+row+'x'+col;
    tmp = document.querySelector('#'+sqrCls);
    tmp2 = document.querySelector('.'+sqrCls)
    tmp2.removeChild(tmp);
    tmp=document.createElement('img');
    tmp.setAttribute('class','piece');
    tmp.setAttribute('id',sqrCls);
    tmp.setAttribute('src','images/pieces/'+ar[piece]+'.png');
    tmp2.appendChild(tmp);
    brd=document.querySelector('.board');
    tmp = document.querySelector('.pp');
    brd.removeChild(tmp);
    moves[moves.length-1].map_c[row-1][col-1]=ar[piece];
    moves[moves.length-1].promoted=ar[piece];
    loggedMoves.pop();
    moveLogger(moves[moves.length-1],moves[moves.length-1].captured);
    showpp=false;
    onEngineMove();
}

function moveLogger(move,captured=false,castled=false,ct=""){
   var clm="";
   var p = "";
   var rw = Math.floor(move.to/10)
    if(move.piece[1]=='p') p = "";
    else p = move.piece[1];
    p=p.toUpperCase();

    if(p=='R'||p=='N'){
            if(wpieceCount[1]>1){
                op="";
                for(i=0;i<8;i++){
                 for(j=0;j<8;j++){
                     if(map[i][j]==move.piece&&((i+1)*10+j+1)!=move.to*1) op=((i+1)*10+j+1);
                 }
                }
                console.log('other pos:',op);

             opmoves = allPossibleMoves(move.piece,op,moves[move.moveNumber-1].map_c);
             console.log(opmoves);
             for(i=0;i<opmoves.length;i++){
                 if(opmoves[i]*1==move.to*1){
                     if(Math.floor(op/10)==Math.floor(move.to/10)) p+=getFile(move.from%10);
                     else p+=Math.floor(move.to/10);
                 }
             }
            }
    }

    var log="<button class="+"'logmove'"+" onclick="+"'renderRandom("+moveNumber+")'>";
    switch(move.to%10){case 1:clm='a';break;case 2:clm='b';break;case 3:clm='c';break;case 4:clm='d';break;case 5:clm='e';break;case 6:clm='f';break;case 7:clm='g';break;case 8:clm='h';break;}
    if(!castled){
        log+=p;
        if(captured){
            if(p=="") log+=getFile(Math.floor(move.from%10))+"x";
            else log+="x";
        }
        
        log+=clm+rw;
        if(move.promoted!="") log+='='+move.promoted[1];
    }
    else{
        if(ct=='short')log+='O-O';
        else log+='O-O-O';
        castled=false;
    }
    if(move.mate) log+='#';
    else if(move.incheck){log+='+';checked=false;}
    log+="</button>";
    tmpLog = new LoggedMoves(log,move.piece,moveNumber);
    loggedMoves.push(tmpLog);
    displayLoggedMoves(loggedMoves);
   
}

function displayLoggedMoves(ar){
    var tmp = document.querySelector('#moveslog');
        if(tmp!=null) tmp.innerHTML="";
    loggedMoves.forEach(element => {
        mvlg = document.querySelector('.movelogger');
    if(mvlg!=null){
        var tmp = document.querySelector('#moveslog');
        if(tmp!=null){
            if(element.piece[0]=='w')
            tmp.innerHTML+=Math.ceil(element.moveNumber/2)+"."+element.log+" ";
            else tmp.innerHTML+=element.log+" ";
        }
        else{
            tmp=document.createElement('p');
            tmp.innerHTML+=element.moveNumber+"."+element.log+" ";
            tmp.setAttribute('id','moveslog');
            mvlg.appendChild(tmp);
        }
    }
    });
}

board.addEventListener('click', (e)=>{
 
    var x= Math.ceil((e.pageX-board_x)/sqr_size);
    var y= Math.ceil((e.pageY-board_y)/sqr_size);
    
    if(flipped){
        y = 8-y+1;
    }
    else x=8-x+1;
   
    if(x>0 && x<9 && y>0 && y<9){
        var Id = "#square_"+y+"x"+x;
        var className = ".square_"+y+"x"+x;
    }
    var sqr = document.querySelector(Id);
    if(sqr != null){
        curnt_img_src = sqr.getAttribute('src');
        var piece = curnt_img_src.substr(curnt_img_src.length-6,2);
        if(turn==piece[0]){
        if(piece[1]!='p'){
            var ar = allPossibleSquares(piece[1],y*10+x);
        }
        else{
            var ar = allPossibleSquares(piece,y*10+x);
        }

        removePossibleSquaresDisplay(pre_ar);
        displayPossibleSquares(ar);
        pre_ar=ar;
    }
    else removePossibleSquaresDisplay(pre_ar);
}
    else removePossibleSquaresDisplay(pre_ar);
});


function makeActive(classname){
if(classname!=""){
    var tmp = document.querySelector(classname);       
    if(tmp!=null){
        tmp.classList.add('active');
    }
}
}

function makePreActive(classname){
if(classname!=""){
    var tmp = document.querySelector(classname);       
    if(tmp!=null){
        tmp.classList.add('preactive');
    }
}
}

function removeActive(){
var q= document.querySelectorAll('.active');
upto = q.length;
for(i=0;i<upto;i++) q[i].classList.remove('active');
}

function removePreActive(){
var q= document.querySelectorAll('.preactive');
upto=q.length;
for(i=0;i<upto;i++) q[i].classList.remove('preactive');
}

function tn(x,y){
return 10*x+y*1;
}

function displayPossibleSquares(ar){
var x=Math.floor(ar/10);
var y=ar%10;
for(i=0;i<ar.length;i++){
    var className = ".square_"+Math.floor(ar[i]/10)+"x"+ar[i]%10;
    var node=document.querySelector(className);
    node.classList.add('pomo');
}
}

function removePossibleSquaresDisplay(ar){
var x=Math.floor(ar/10);
var y=ar%10;
for(i=0;i<ar.length;i++){
    var className = ".square_"+Math.floor(ar[i]/10)+"x"+ar[i]%10;
    var node=document.querySelector(className);
    if(node.classList.contains("pomo")){
    node.classList.remove('pomo');
    } 
}
}

function allPossibleMoves(piece,position,tmap){
    var map=tmap;
const row = Math.floor(position/10);
const col = position%10;
var ps = [];

switch(piece){
    case 'wr': 
    for(i=col;i<=8;i++){
        if(i!=col && map[row-1][i-1][0]=='w')
            break;
        else if(map[row-1][i-1][0]=='b'){
            ps.push(tn(row,i));
            break;
        }
        else if(i!=col)
        ps.push(tn(row,i));
    }
    for(i=col;i>=1;i--){
        if(i!=col && map[row-1][i-1][0]=='w')
            break;
        else if(map[row-1][i-1][0]=='b'){
            ps.push(tn(row,i));
            break;
        }
        else if(i!=col)
        ps.push(tn(row,i));
    }

    for(i=row;i<=8;i++){
        if(i!=row && map[i-1][col-1][0]=='w')
        break;
        else if(map[i-1][col-1][0]=='b'){
            ps.push(tn(i,col));
            break;
        }
        else if(i!=row)
        ps.push(tn(i,col));
    }
    for(i=row;i>=1;i--){
        if(i!=row && map[i-1][col-1][0]=='w')
        break;
        else if(map[i-1][col-1][0]=='b'){
            ps.push(tn(i,col));
            break;
        }
        else if(i!=row)
        ps.push(tn(i,col));
    }
    break;

    case 'br': 
    for(i=col;i<=8;i++){
        if(i!=col && map[row-1][i-1][0]=='b')
            break;
        else if(map[row-1][i-1][0]=='w'){
            ps.push(tn(row,i));
            break;
        }
        else if(i!=col)
        ps.push(tn(row,i));
    }
    for(i=col;i>=1;i--){
        if(i!=col && map[row-1][i-1][0]=='b')
            break;
        else if(map[row-1][i-1][0]=='w'){
            ps.push(tn(row,i));
            break;
        }
        else if(i!=col)
        ps.push(tn(row,i));
    }

    for(i=row;i<=8;i++){
        if(i!=row && map[i-1][col-1][0]=='b')
        break;
        else if(map[i-1][col-1][0]=='w'){
            ps.push(tn(i,col));
            break;
        }
        else if(i!=row)
        ps.push(tn(i,col));
    }

    for(i=row;i>=1;i--){
        if(i!=row && map[i-1][col-1][0]=='b')
        break;
        else if(map[i-1][col-1][0]=='w'){
            ps.push(tn(i,col));
            break;
        }
        else if(i!=row)
        ps.push(tn(i,col));
    }
    break;

    case 'wp': 
    if(row==2 && map[row+1][col-1]==""){
        ps.push(tn(row+2,col));
    } 

     if(row+1<=8){
         if(map[row][col-1]=="")
            ps.push(tn(row+1,col));
        if(col-1>=1 && map[row][col-2][0]=='b') ps.push(tn(row+1,col-1));
        if(col+1<=8 && map[row][col][0]=='b') ps.push(tn(row+1,col+1));
        if(row==5&&en=='b'){
        if(col-1>=1&&map[4][col-2]=='bp') ps.push(tn(row+1,col-1));
        if(col+1<=8&&map[4][col]=='bp') ps.push(tn(row+1,col+1));
        }
    }

    break;

    case 'bp':
        if(row==7 && map[4][col-1]=="") ps.push(tn(row-2,col));

        if(row-1>=1){
            if(map[row-2][col-1]=="")
            ps.push(tn(row-1,col));
            if(col-1 >= 1 && map[row-2][col-2][0]=='w') ps.push(tn(row-1,col-1));
            if(col+1 <= 8 && map[row-2][col][0]=='w') ps.push(tn(row-1,col+1));
            if(row==4&&en=='w'){
            if(col-1>=1&&map[3][col-2]=='wp') ps.push(tn(row-1,col-1));
            if(col+1<=8&&map[3][col]=='wp') ps.push(tn(row-1,col+1));
            }
        }
        break;
    
    case 'wb':
        i=1;
        rt = true;
        lt = true;
        while(row-i>=1){
            if(col-i>=1 && lt){
                if(map[row-i-1][col-i-1][0]=='w') lt=false ;
                else if(map[row-i-1][col-i-1][0]=='b'){
                    ps.push(tn(row-i,col-i));    
                    lt=false;
                }
                else if(lt)
                ps.push(tn(row-i,col-i));
            }
            if(col+i<=8 && rt){
                if(map[row-i-1][col+i-1][0]=='w') rt=false;
                else if(map[row-i-1][col+i-1][0]=='b'){
                    ps.push(tn(row-i,col+i));
                    rt=false;   
                }
                else if(rt)
                ps.push(tn(row-i,col+i));
            } 
            i++;
        }
        i=1;
        rt=true;
        lt=true;
        while(row+i<=8){
            if(col-i>=1 && lt){
                if(map[row+i-1][col-i-1][0]=='w') lt=false;
                else if(map[row+i-1][col-i-1][0]=='b'){
                    ps.push(tn(row+i,col-i));
                    lt=false;    
                }
                else if(lt)
                ps.push(tn(row+i,col-i));
            }
            if(col+i<=8 && rt){
                if(map[row+i-1][col+i-1][0]=='w') rt=false;
                else if(map[row+i-1][col+i-1][0]=='b'){
                    ps.push(tn(row+i,col+i));
                    rt=false;    
                }
                else if(rt)
                ps.push(tn(row+i,col+i));
            } 
            i++;
        }
        break;
        case 'bb':
            i=1;
            lt=true;
            rt=true;
            while(row-i>=1){
                if(col-i>=1 && lt){
                    if(map[row-i-1][col-i-1][0]=='b') lt=false;
                    else if(map[row-i-1][col-i-1][0]=='w'){
                        ps.push(tn(row-i,col-i));
                        lt=false;    
                    }
                    else if(lt)
                    ps.push(tn(row-i,col-i));
                }
                if(col+i<=8 && rt){
                    if(map[row-i-1][col+i-1][0]=='b') rt=false;
                    else if(map[row-i-1][col+i-1][0]=='w'){
                        ps.push(tn(row-i,col+i));
                        rt=false;    
                    }
                    else if(rt)
                    ps.push(tn(row-i,col+i));
                } 
                i++;
            }
            i=1;
            lt=true;
            rt=true;
            while(row+i<=8){
                if(col-i>=1 && lt){
                    if(map[row+i-1][col-i-1][0]=='b') lt=false;
                    else if(map[row+i-1][col-i-1][0]=='w'){
                        ps.push(tn(row+i,col-i));
                        lt=false;    
                    }
                    else if(lt)
                    ps.push(tn(row+i,col-i));
                }
                if(col+i<=8 && rt){
                    if(map[row+i-1][col+i-1][0]=='b') rt=false;
                    else if(map[row+i-1][col+i-1][0]=='w'){
                        ps.push(tn(row+i,col+i));
                        rt=false;    
                    }
                    else if(rt)
                    ps.push(tn(row+i,col+i));
                } 
                i++;
            }
            break;

    case 'wn':
        if(row+2<=8){
            if(col-1>=1 && map[row+1][col-2][0]!='w') ps.push(tn(row+2,col-1));
            if(col+1<=8&& map[row+1][col][0]!='w') ps.push(tn(row+2,col+1));
        }

        if(row-2>=1){
            if(col-1>=1&& map[row-3][col-2][0]!='w') ps.push(tn(row-2,col-1));
            if(col+1<=8&& map[row-3][col][0]!='w') ps.push(tn(row-2,col+1));
        }

        if(col+2<=8){
            if(row-1>=1 && map[row-2][col+1][0]!='w') ps.push(tn(row-1,col+2));
            if(row+1<=8&& map[row][col+1][0]!='w') ps.push(tn(row+1,col+2));
        }

        if(col-2>=1){
            if(row-1>=1&& map[row-2][col-3][0]!='w') ps.push(tn(row-1,col-2));
            if(row+1<=8&& map[row][col-3][0]!='w') ps.push(tn(row+1,col-2));
        }

        break;

        case 'bn':
        if(row+2<=8){
            if(col-1>=1 && map[row+1][col-2][0]!='b') ps.push(tn(row+2,col-1));
            if(col+1<=8&& map[row+1][col][0]!='b') ps.push(tn(row+2,col+1));
        }

        if(row-2>=1){
            if(col-1>=1&& map[row-3][col-2][0]!='b') ps.push(tn(row-2,col-1));
            if(col+1<=8&& map[row-3][col][0]!='b') ps.push(tn(row-2,col+1));
        }

        if(col+2<=8){
            if(row-1>=1 && map[row-2][col+1][0]!='b') ps.push(tn(row-1,col+2));
            if(row+1<=8&& map[row][col+1][0]!='b') ps.push(tn(row+1,col+2));
        }

        if(col-2>=1){
            if(row-1>=1&& map[row-2][col-3][0]!='b') ps.push(tn(row-1,col-2));
            if(row+1<=8&& map[row][col-3][0]!='b') ps.push(tn(row+1,col-2));
        }

        break;


    case 'wk':
        if(col-1>=1 && map[row-1][col-2][0]!='w') ps.push(tn(row,col-1));
        if(col+1<=8 && map[row-1][col][0]!='w') ps.push(tn(row,col+1));

        if(row-1>=1){
            if(map[row-2][col-1][0]!='w')
                ps.push(tn(row-1,col));
            if(col-1>=1 && map[row-2][col-2][0]!='w') ps.push(tn(row-1,col-1));
            if(col+1<=8 && map[row-2][col][0]!='w') ps.push(tn(row-1,col+1));
        }
        if(row+1<=8){
            if(map[row][col-1][0]!='w')
                ps.push(tn(row+1,col));
            if(col-1>=1 && map[row][col-2][0]!='w') ps.push(tn(row+1,col-1));
            if(col+1<=8 && map[row][col][0]!='w') ps.push(tn(row+1,col+1));
        }
        if(map[0][4]=='wk'){
            if(map[0][5]==""&&map[0][6]==""&&map[0][7]=='wr') ps.push(tn(1,7));
            if(map[0][3]==""&&map[0][2]==""&&map[0][1]==""&&map[0][0]=='wr') ps.push(tn(1,3))
        }

        break;

        case 'bk':
        if(col-1>=1 && map[row-1][col-2][0]!='b') ps.push(tn(row,col-1));
        if(col+1<=8 && map[row-1][col][0]!='b') ps.push(tn(row,col+1));

        if(row-1>=1){
            if(map[row-2][col-1][0]!='b')
                ps.push(tn(row-1,col));
            if(col-1>=1 && map[row-2][col-2][0]!='b') ps.push(tn(row-1,col-1));
            if(col+1<=8 && map[row-2][col][0]!='b') ps.push(tn(row-1,col+1));
        }
        if(row+1<=8){
            if(map[row][col-1][0]!='b')
                ps.push(tn(row+1,col));
            if(col-1>=1 && map[row][col-2][0]!='b') ps.push(tn(row+1,col-1));
            if(col+1<=8 && map[row][col][0]!='b') ps.push(tn(row+1,col+1));
        }
        if(map[7][4]=='bk'){
            if(map[7][5]==""&&map[7][6]==""&&map[7][7]=='br') ps.push(tn(8,7));
            if(map[7][3]==""&&map[7][2]==""&&map[7][1]==""&&map[7][0]=='br') ps.push(tn(8,3))
        }

        break;

    case 'wq':
        for(i=col;i<=8;i++){
            if(i!=col && map[row-1][i-1][0]=='w')
                break;
            else if(map[row-1][i-1][0]=='b'){
                ps.push(tn(row,i));
                break;
            }
            else if(i!=col)
            ps.push(tn(row,i));
        }
        for(i=col;i>=1;i--){
            if(i!=col && map[row-1][i-1][0]=='w')
                break;
            else if(map[row-1][i-1][0]=='b'){
                ps.push(tn(row,i));
                break;
            }
            else if(i!=col)
            ps.push(tn(row,i));
        }

        for(i=row;i<=8;i++){
            if(i!=row && map[i-1][col-1][0]=='w')
            break;
            else if(map[i-1][col-1][0]=='b'){
                ps.push(tn(i,col));
                break;
            }
            else if(i!=row)
            ps.push(tn(i,col));
        }
        for(i=row;i>=1;i--){
            if(i!=row && map[i-1][col-1][0]=='w')
            break;
            else if(map[i-1][col-1][0]=='b'){
                ps.push(tn(i,col));
                break;
            }
            else if(i!=row)
            ps.push(tn(i,col));
        }

        i=1;
        rt = true;
        lt = true;
        while(row-i>=1){
            if(col-i>=1 && lt){
                if(map[row-i-1][col-i-1][0]=='w') lt=false ;
                else if(map[row-i-1][col-i-1][0]=='b'){
                    ps.push(tn(row-i,col-i));    
                    lt=false;
                }
                else if(lt)
                ps.push(tn(row-i,col-i));
            }
            if(col+i<=8 && rt){
                if(map[row-i-1][col+i-1][0]=='w') rt=false;
                else if(map[row-i-1][col+i-1][0]=='b'){
                    ps.push(tn(row-i,col+i));
                    rt=false;   
                }
                else if(rt)
                ps.push(tn(row-i,col+i));
            } 
            i++;
        }
        i=1;
        rt=true;
        lt=true;
        while(row+i<=8){
            if(col-i>=1 && lt){
                if(map[row+i-1][col-i-1][0]=='w') lt=false;
                else if(map[row+i-1][col-i-1][0]=='b'){
                    ps.push(tn(row+i,col-i));
                    lt=false;    
                }
                else if(lt)
                ps.push(tn(row+i,col-i));
            }
            if(col+i<=8 && rt){
                if(map[row+i-1][col+i-1][0]=='w') rt=false;
                else if(map[row+i-1][col+i-1][0]=='b'){
                    ps.push(tn(row+i,col+i));
                    rt=false;    
                }
                else if(rt)
                ps.push(tn(row+i,col+i));
            } 
            i++;
        }
        break;       

        case 'bq':
            for(i=col;i<=8;i++){
                if(i!=col && map[row-1][i-1][0]=='b')
                    break;
                else if(map[row-1][i-1][0]=='w'){
                    ps.push(tn(row,i));
                    break;
                }
                else if(i!=col)
                ps.push(tn(row,i));
            }

            for(i=col;i>=1;i--){
                if(i!=col && map[row-1][i-1][0]=='b')
                    break;
                else if(map[row-1][i-1][0]=='w'){
                    ps.push(tn(row,i));
                    break;
                }
                else if(i!=col)
                ps.push(tn(row,i));
            }
    
            for(i=row;i<=8;i++){
                if(i!=row && map[i-1][col-1][0]=='b')
                break;
                else if(map[i-1][col-1][0]=='w'){
                    ps.push(tn(i,col));
                    break;
                }
                else if(i!=row)
                ps.push(tn(i,col));
            }
    
            for(i=row;i>=1;i--){
                if(i!=row && map[i-1][col-1][0]=='b')
                break;
                else if(map[i-1][col-1][0]=='w'){
                    ps.push(tn(i,col));
                    break;
                }
                else if(i!=row)
                ps.push(tn(i,col));
            }

            i=1;
            lt=true;
            rt=true;
            while(row-i>=1){
                if(col-i>=1 && lt){
                    if(map[row-i-1][col-i-1][0]=='b') lt=false;
                    else if(map[row-i-1][col-i-1][0]=='w'){
                        ps.push(tn(row-i,col-i));
                        lt=false;    
                    }
                    else if(lt)
                    ps.push(tn(row-i,col-i));
                }
                if(col+i<=8 && rt){
                    if(map[row-i-1][col+i-1][0]=='b') rt=false;
                    else if(map[row-i-1][col+i-1][0]=='w'){
                        ps.push(tn(row-i,col+i));
                        rt=false;    
                    }
                    else if(rt)
                    ps.push(tn(row-i,col+i));
                } 
                i++;
            }
            i=1;
            lt=true;
            rt=true;
            while(row+i<=8){
                if(col-i>=1 && lt){
                    if(map[row+i-1][col-i-1][0]=='b') lt=false;
                    else if(map[row+i-1][col-i-1][0]=='w'){
                        ps.push(tn(row+i,col-i));
                        lt=false;    
                    }
                    else if(lt)
                    ps.push(tn(row+i,col-i));
                }
                if(col+i<=8 && rt){
                    if(map[row+i-1][col+i-1][0]=='b') rt=false;
                    else if(map[row+i-1][col+i-1][0]=='w'){
                        ps.push(tn(row+i,col+i));
                        rt=false;    
                    }
                    else if(rt)
                    ps.push(tn(row+i,col+i));
                } 
                i++;
            }
            break;       
}
return ps;

}



function doCastle(color,type){
    if(color=='w') rank = 1;
    else rank = 8;
    if(type=="short"){
        file=8;
        sub = 2;
        castleType='short';
    } 
    else{
        console.log('long castles');
        file=1;
        sub = -3;
        castleType='long';
    } 

   
    map[rank-1][file-1]="";
    map[rank-1][(file-sub-1)]=color+'r'
    elem=document.querySelector('#square_'+rank+'x'+file);
    elem.parentElement.removeChild(elem);
    var squre = document.querySelector('.square_'+rank+'x'+(file-sub));

        newImg = document.createElement('img');
        newImg.src=elem.getAttribute('src');
        newImg.setAttribute('id','square_'+rank+'x'+(file-sub));
        newImg.setAttribute('class','piece');
        squre.appendChild(newImg);

        if(color=='w'){
            console.log("i'm changing state");
            canWhiteCastle_short=false;
            canWhiteCastle_long=false;
        }
        else{
            canBlackCastle_long=false;
            canBlackCastle_short=false;
        }
        castled=true;
}


function canCastle(color,type){
    console.log("first:",canWhiteCastle_short);
    if(color=='w'){
       if(type=='short'){
        console.log("reaching till check-1",hasWkMoved,whiteRookKmoved,canWhiteCastle_short);
           if(!hasWkMoved&&!whiteRookKmoved&&canWhiteCastle_short){
               console.log("reaching till check");
               if(!isInCheck('ww',map,true,16)&&!isInCheck('ww',map,true,17)){
                canWhiteCastle_short=false;   
                return true;
                } 
               else return false;
           }
           else{
            canWhiteCastle_short=false;
            return false;
           } 
        }
        else if(type=='long'){
            if(!hasWkMoved&&!whiteRookQmoved&&canWhiteCastle_long){
                if(!isInCheck('ww',map,true,12)&&!isInCheck('ww',map,true,13)&&!isInCheck('ww',map,true,14)){
                    canWhiteCastle_long=false;
                    return true;
                } 
                else return false;
            }
            else{
                canWhiteCastle_long=false;
                return false;
            } 
        }
    }
    else if(color=='b'){
        if(type=='short'){
            if(!hasBkMoved&&!BlackRookKmoved&&canBlackCastle_short){
                if(!isInCheck('bb',map,true,86)&&!isInCheck('bb',map,true,88)){
                    canBlackCastle_short=false;
                    return true;
                } 
                else return false;
            }
            else{
                canBlackCastle_short=false;
                return false;
            };
         }
         else if(type=='long'){
             if(!hasBkMoved&&!BlackRookQmoved&&canBlackCastle_long){
                 if(!isInCheck('bb',map,true,82)&&!isInCheck('bb',map,true,83)&&!isInCheck('bb',map,true,84)) {
                    canBlackCastle_long=false;
                    return true;
                 }
                 else return false;
             }
             else {
                canBlackCastle_long=false;
                return false;
             };
         }
     }
}

function isInCheck(piece,tmap,checktarget=false,target=""){
tmap = tmap;
piece=piece;
color ="";
Kposition="";

if(piece[0]=='w') color="b";
else color = "w";

if(!checktarget){
    for(i=0;i<8;i++){
        for(j=0;j<8;j++){
            if(tmap[i][j]==piece[0]+'k'){
                Kposition=(tn(i+1,j+1));
            }
        }
    }
}
else Kposition=target;



var opArmy=[];
for(i=0;i<8;i++){
    for(j=0;j<8;j++){
        if(tmap[i][j][0]==color){
            var obj=new Obj((i+1)*10+j+1,tmap[i][j]);
            opArmy.push(obj);
        }
    }
}


for(j=0;j<opArmy.length;j++){
    tmp = allPossibleMoves(opArmy[j].val,opArmy[j].pos,tmap);
    for(i=0;i<tmp.length;i++){
        if(tmp[i]==Kposition){  
            return true;
        } 
    } 
}
return false;
}

function isPossibleMove(piece,from_position,to_position){
tmp = allPossibleMoves(piece,from_position,map);
for(i=0;i<tmp.length;i++)
    if(tmp[i]==to_position) return true;
return false;
}

function allPossibleSquares(piece,position){
const row = Math.floor(position/10);
const col = position%10;
var ps = [];

switch(piece){
    case 'r': 
    for(i=1;i<=8;i++){
        if(i!=col)
        ps.push(tn(row,i));
    }
    for(i=1;i<=8;i++){
        if(i!=row)
        ps.push(tn(i,col));
    }
    break;

    case 'wp': 
    if(row==2){
        ps.push(tn(row+2,col));
    } 

     if(row+1<=8){
        ps.push(tn(row+1,col));
        if(col-1>=1) ps.push(tn(row+1,col-1));
        if(col+1<=8) ps.push(tn(row+1,col+1));
    }
    break;

    case 'bp':
        if(row==6) ps.push(tn(row-2,col));

        if(row-1>=1){
            ps.push(tn(row-1,col));
            if(col-1 >= 1) ps.push(tn(row-1,col-1));
            if(col+1 <= 8) ps.push(tn(row-1,col+1));
        }
        break;
    
    case 'b':
        i=1;
        while(row-i>=1){
            if(col-i>=1) ps.push(tn(row-i,col-i));
            if(col+i<=8) ps.push(tn(row-i,col+i));
            i++;
        }
        i=1;
        while(row+i<=8){
            if(col-i>=1) ps.push(tn(row+i,col-i));
            if(col+i<=8) ps.push(tn(row+i,col+i));
            i++;
        }
        break;

    case 'n':
        if(row+2<=8){
            if(col-1>=1) ps.push(tn(row+2,col-1));
            if(col+1<=8) ps.push(tn(row+2,col+1));
        }

        if(row-2>=1){
            if(col-1>=1) ps.push(tn(row-2,col-1));
            if(col+1<=8) ps.push(tn(row-2,col+1));
        }

        if(col+2<=8){
            if(row-1>=1) ps.push(tn(row-1,col+2));
            if(row+1<=8) ps.push(tn(row+1,col+2));
        }

        if(col-2>=1){
            if(row-1>=1) ps.push(tn(row-1,col-2));
            if(row+1<=8) ps.push(tn(row+1,col-2));
        }

        break;

    case 'k':
        if(col-1>=1) ps.push(tn(row,col-1));
        if(col+1<=8) ps.push(tn(row,col+1));

        if(row-1>=1){
            ps.push(tn(row-1,col));
            if(col-1>=1) ps.push(tn(row-1,col-1));
            if(col+1<=8) ps.push(tn(row-1,col+1));
        }
        if(row+1<=8){
            ps.push(tn(row+1,col));
            if(col-1>=1) ps.push(tn(row+1,col-1));
            if(col+1<=8) ps.push(tn(row+1,col+1));
        }

        break;

    case 'q':
        for(var i=1;i<=8;i++){
            if(i!=col)
            ps.push(tn(row,i));
        }
        for(var i=1;i<=8;i++){
            if(i!=row)
            ps.push(tn(i,col));
        }

        var i=1;
        while(row-i>=1){
            if(col-i>=1) ps.push(tn(row-i,col-i));
            if(col+i<=8) ps.push(tn(row-i,col+i));
            i++;
        }
        i=1; 
        while(row+i<=8){
            if(col-i>=1) ps.push(tn(row+i,col-i));
            if(col+i<=8) ps.push(tn(row+i,col+i));
            i++;
        }
        break;       
}

return ps;
}
function preBtnOnClick(){
if(availBackMoves>0){
    renderMove(moves[availBackMoves-1],availBackMoves-1,true,'backwards');
    availBackMoves-=1;
    currently_rendering=availBackMoves;
}
}

function nextBtnOnClick(){
if(availBackMoves<moveNumber){
   renderMove(moves[availBackMoves + 1], availBackMoves + 1, true, 'forward');
    availBackMoves+=1;
    currently_rendering=availBackMoves;
}

}
function firstBtnOnClick(){
    renderMove(moves[0],0);
    availBackMoves=0;
    displayMap=[
        ["wr","wn","wb","wq","wk","wb","wn","wr"],
        ["wp","wp","wp","wp","wp","wp","wp","wp"],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["bp","bp","bp","bp","bp","bp","bp","bp"],
        ["br","bn","bb","bq","bk","bb","bn","br"]        
    ];
    currently_rendering=0;
}

function lastBtnOnClick(){
    renderMove(moves[moves.length-1],moves.length-1);
    availBackMoves=moves.length-1;
    for(i=0;i<8;i++) displayMap[i]=map[i].slice();
    currently_rendering=moves.length-1;
}

function renderRandom(move_number){
   
    renderMove(moves[move_number],move_number,);
    availBackMoves=move_number;
    for(i=0;i<8;i++) displayMap[i] = moves[move_number].map_c[i].slice();
    currently_rendering=move_number;
}

function renderMove(move,move_number,animate=false,animate_direction=""){
    showCaptured(move);
    if(moveNumber==move_number+1&&animate_direction=="backwards"){
        for(i=0;i<8;i++) displayMap[i]=map[i].slice();
    }
mp = move.map_c;

removeActive();
removePreActive();
if(move.move_number!=0){
    makePreActive(move.pre_act_sqr);
    makeActive(move.curnt_act_squr);
}

if(true){
pieces = document.querySelectorAll(".piece");
for(i=0;i<pieces.length;i++){
    pieces[i].parentElement.removeChild(pieces[i]);}


for(i=0;i<8;i++){
    for(j=0;j<8;j++){
        if(mp[i][j]!=""){
            tmpImg = document.createElement('img');
            tmpImg.setAttribute('class','piece');
            tmpImg.setAttribute('Id','square_'+(i+1)+'x'+(j+1));
            tmpImg.setAttribute('src','/images/pieces/'+mp[i][j]+".png");
            document.querySelector(".square_"+(i+1)+'x'+(j+1)).appendChild(tmpImg);
        }
    }
}
}
    if(animate){
             animateMove(move_number,animate_direction);
    }
}

function animateMove(move_number,direction,_to="",_from=""){
var move_number = move_number
var direction = direction;
var move = moves[move_number];

if(direction == 'forward'){
    to = moves[move_number].from;
    from  = moves[move_number].to;
}

if( direction == 'backwards'){
    from = moves[move_number+1].from;
    to   = moves[move_number+1].to;
}




fx=Math.floor(from/10);
fy=from%10;

tx = Math.floor(to/10);
ty = Math.floor(to%10);

if(_to!=""&&_from!=""){
    fx=Math.floor(_from/10);
    fy=_from%10;

    tx = Math.floor(_to/10);
    ty = Math.floor(_to%10);
}

var elem = document.querySelector("#square_"+fx+"x"+fy);
    if(flipped){
        fx=8-fx+1;
        tx=8-tx+1
    }
    else {
        fy=8-fy+1;
        ty=8-ty+1;
    }
    elem.style.top = (tx-1)*sqr_size + 'px';
    elem.style.left = (ty-1)*sqr_size + 'px';

    diff_row = (tx-fx)*sqr_size;
    diff_col = (ty-fy)*sqr_size;
        
    var id = setInterval(frame, 2);
    initial_left = (ty-1)*sqr_size;
    initial_top = (tx-1)*sqr_size;
    final_left = (fy-1)*sqr_size;
    final_top = (fx-1)*sqr_size;
  async function frame() {

        sp = 3.3;
        r = 2;

        if(diff_row>0){
            if(diff_col!=0){
                var scale = (tx-fx)/(ty-fy);
                if(initial_top<final_top+r&& initial_top>final_top-r){
                    clearInterval(id);
                    elem.style.left = final_left+'px';
                    elem.style.top = final_top+'px';
                    if(move.captured&&direction=='forward') playAudio('captured',direction);
                    else playAudio('move',direction);
                  
                }
                else{
                    initial_top-=sp;
                    initial_left-=sp/scale;
                    elem.style.left = initial_left+'px';
                    elem.style.top = initial_top+'px';
                }
            }
            
            else{//vertically upward slide
                if(initial_top<final_top+r&& initial_top>final_top-r){
                    clearInterval(id);
                    elem.style.left = final_left+'px';
                   elem.style.top = final_top+'px';
                   if(move.capture&&direction=='forward') playAudio('captured',direction);
                    else playAudio('move',direction);
                }
                else{
                    initial_top-=sp;
                    elem.style.top = initial_top+'px';
                }
            }

        }
        else if(diff_row<0){
            if(diff_col!=0){
                var scale = (tx-fx)/(ty-fy);
                if(initial_top<final_top+r&& initial_top>final_top-r){
                    clearInterval(id);
                    elem.style.left = final_left+'px';
                    elem.style.top = final_top+'px';
                    if(move.captured&&direction=='forward') playAudio('captured',direction);
                    else playAudio('move',direction);
                }
                else{
                    initial_top+=sp;
                    if(direction=='backward')
                      initial_left-=sp/scale;
                    else initial_left+=sp/scale;
                    elem.style.left = initial_left+'px';
                    elem.style.top = initial_top+'px';
                }
            }
            else{//vertically downward slide
                if(initial_top<final_top+r&& initial_top>final_top-r){
                    clearInterval(id);
                    elem.style.left = final_left+'px';
                   elem.style.top = final_top+'px';
                   if(move.captured&&direction=='forward') playAudio('captured',direction);
                    else playAudio('move',direction);
                }
                else{
                    initial_top+=sp;
                    elem.style.top = initial_top+'px';
                }
            }
        }
        else{
            //horizontal slide
            if(initial_left<final_left+1 && initial_left>final_left-1){
                 clearInterval(id);
                 elem.style.left = final_left+'px';
                elem.style.top = final_top+'px';
                if(move.captured&&direction=='forward') playAudio('captured',direction);
                    else playAudio('move',direction);
            }
                else{
                    if(diff_col>0){//slide left
                        initial_left-=1.5;
                        elem.style.left=initial_left+'px';
                    }
                    else if (diff_col<0){// slide right
                        initial_left+=1.5;
                        elem.style.left=initial_left+'px';
                    }
                }
        }
    }
}
class Pc{
    constructor(count,piece){
        this.count=count;
        this.piece=piece;
    }
    count;
    piece;
}

function showCaptured(move){
    p1=document.querySelector('.player-1');
    p2=document.querySelector('.player-2');
    p1.innerHTML="";
    p2.innerHTML="";
    var wpieceCount = move.pieceCount[0];
    var bpieceCount = move.pieceCount[1];
    console.log(wpieceCount,bpieceCount);
    wp=new Pc(8-wpieceCount[0],'wp');
    wr=new Pc(2-wpieceCount[1],'wr');
    wn=new Pc(2-wpieceCount[2],'wn');
    wb=new Pc(2-wpieceCount[3],'wb');
    wq=new Pc(1-wpieceCount[4],'wq');
    bp=new Pc(8-bpieceCount[0],'bp');
    br=new Pc(2-bpieceCount[1],'br');
    bn=new Pc(2-bpieceCount[2],'bn');
    bb=new Pc(2-bpieceCount[3],'bb');
    bq=new Pc(1-bpieceCount[4],'bq');
    var white=[];
    var black=[];
    white.push(wp,wr,wn,wb,wq);
    black.push(bp,br,bn,bb,bq);

    white.forEach((e)=>{
        for(i=0;i<e.count;i++){
            im = document.createElement('img');
            im.src='/images/pieces/'+e.piece+'.png';
            
            if(e.piece[1]!='p'){
                im.style.width=20+'px';
                im.style.height=20+'px';
            }
            
            else{
                im.style.width=17+'px';
                im.style.height=17+'px';
                im.style.marginTop=3+'px';
            } 
            p2.appendChild(im);
        }
    });
    black.forEach((e)=>{
        for(i=0;i<e.count;i++){
            im = document.createElement('img');
            im.src='/images/pieces/'+e.piece+'.png';
            if(e.piece[1]!='p'){
                im.style.width=20+'px';
                im.style.height=20+'px';
            }
            else{
                im.style.width=17+'px';
                im.style.height=17+'px';
                im.style.marginTop=3+'px';
            } 
            p1.appendChild(im);
        }
    });
}

function renderBoard(side,image_source,map){
    var map=map;
    b = document.querySelector('#board');
    b.innerHTML="";

    ci = document.querySelector('.colmindex');
    ri = document.querySelector('.rowindex');
    ci.style.width=sqr_size*8+'px';
    ri.style.height=sqr_size*8+'px';


    if(side == 'black'){
        flipped=false;
        ri.innerHTML="";
        ci.innerHTML="";

        for(i=0;i<8;i++){
            //handle index dsiplaying
            ind = document.createElement('p');
            ind.setAttribute('class','rowindex_child');
            ind.innerHTML=i+1;
            ri.appendChild(ind);
            //.........................
            var tmp = document.createElement('div');
            tmp.setAttribute('class','row row_'+(i+1));
            for(j=7;j>=0;j--){
                 //handle colm index dsiplaying
           if(i==0){
            ind = document.createElement('p');
            ind.setAttribute('class','colmindex_child');
            letter="";
            switch(j+1){case 1:letter='a'; break;case 2:letter='b';break;case 3:letter='c';break;case 4:letter='d';break;case 5:letter='e';break;case 6:letter='f';break;case 7:letter='g';break;case 8:letter='h';break;}
            ind.innerHTML=letter;
            ci.appendChild(ind);
           }
            //.........................
             var tmp2=document.createElement('div');
             tmp2.setAttribute('class','square square_'+(i+1)+"x"+(j+1));
             if(map[i][j]!=""){
                 var img = document.createElement('img');
                 img.setAttribute('src',image_source+map[i][j]+'.png');
                 img.setAttribute('class','piece');
                 img.setAttribute('id','square_'+(i+1)+"x"+(j+1));
                 tmp2.appendChild(img);
             }   
             tmp.appendChild(tmp2);
		
            }
            b.appendChild(tmp);
        }
    }

    
    if(side == 'white'){
        flipped=true;
        ri.innerHTML="";
        ci.innerHTML="";

        for(i=7;i>=0;i--){
            //handle index dsiplaying
            ind = document.createElement('p');
            ind.setAttribute('class','rowindex_child');
            ind.innerHTML=i+1;
            ri.appendChild(ind);
            //.........................
            var tmp = document.createElement('div');
            tmp.setAttribute('class','row row_'+(i+1));
            for(j=0;j<8;j++){
                      //handle colm index dsiplaying
            if(i==0){
                ind = document.createElement('p');
                ind.setAttribute('class','colmindex_child');
                letter="";
                switch(j+1){case 1:letter='a';break;case 2:letter='b';break;case 3:letter='c';break;case 4:letter='d';break;case 5:letter='e';break;case 6:letter='f';break;case 7:letter='g';break;case 8:letter='h';}
                ind.innerHTML=letter;
                ci.appendChild(ind);
            }
           
            //.........................
             var tmp2=document.createElement('div');
             tmp2.setAttribute('class','square square_'+(i+1)+"x"+(j+1));
             if(map[i][j]!=""){
                 var img = document.createElement('img');
                 img.setAttribute('src',image_source+map[i][j]+'.png');
                 img.setAttribute('class','piece');
                 img.setAttribute('id','square_'+(i+1)+"x"+(j+1));
                 img.style.left=sqr_size*j+'px';
                 img.style.top=sqr_size*(7-i)+'px';
                 img.style.cursor='grab';
                 tmp2.appendChild(img);
             }   
             tmp.appendChild(tmp2);
            }
            b.appendChild(tmp);
        }
    }

}

function flipOnClick(move_number=currently_rendering){
    p1=document.querySelector('.player-1');
    p2=document.querySelector('.player-2');
    if(flipped){
        renderBoard('black','/images/pieces/',moves[move_number].map_c);
        p1.classList.remove('player-1');
        p1.classList.add('player-2');
        p2.classList.remove('player-2');
        p2.classList.add('player-1');
        p1=document.querySelector('.player-1');
        p2=document.querySelector('.player-2');
        p1.style.marginTop=10+'px';
        p2.style.marginBottom=0+'px';
        p2.style.marginTop=0+'px';
     
    }
    else{
        renderBoard('white','/images/pieces/',moves[move_number].map_c);
       
        p1.classList.remove('player-1');
        p1.classList.add('player-2');
        p2.classList.remove('player-2');
        p2.classList.add('player-1');
        p1=document.querySelector('.player-1');
        p2=document.querySelector('.player-2');
        p1.style.marginBottom=0+'px';
        p2.style.marginTop=10+'px';

    }
    if(showpp==true){
        f=moves[moves.length-1].to;
        var y=Math.floor(f/10),x=f%10;
        brd=document.querySelector('.board');
        ch = document.createElement('span');
        ch.setAttribute('class','pp');
        ar=['q','n','b'];
        
        ar.forEach(e=>{
            var tmp=document.createElement('img');
            tmp.setAttribute('class','square');
            tmp.setAttribute('src','images/pieces/'+curnt_act_piece[0]+e+'.png');
            if(curnt_act_piece[0]=='w') num=ar.indexOf(e);
            else num=3+ar.indexOf(e);
            tmp.setAttribute('onclick','pawnPromote('+num+','+y+','+x+')');
            ch.appendChild(tmp);
        })
        if(curnt_act_piece[0]=='w'){
        if(flipped){
            ch.style.left=(x-1)*sqr_size+'px';
            ch.style.top='0px';
        } 
        else{
            ch.style.left=(8-x)*sqr_size+'px';
            ch.style.top=5*sqr_size+'px';
        }
        } 
        if(curnt_act_piece[0]=='b'){
            if(flipped){
                ch.style.left=(x-1)*sqr_size+'px';
                ch.style.top=5*sqr_size+'px';
            } 
            else{
                ch.style.left=(8-x)*sqr_size+'px';
                ch.style.top='0px';
            }
        }

        brd.appendChild(ch);
        showpp=true;
    }
    showCaptured(moves[move_number]);
}

document.querySelector('.uploadpgn').addEventListener('change',function(){
    var fr = new FileReader();
    fr.onload=function(){
        document.querySelector('.movelogger').textContent=fr.result;
        data=parsePgn(fr.result);
        loadMoves(data.movetext);
    }
    fr.readAsText(this.files[0]);
});

function parsePgn(pgn){
    var pgn=pgn;
    var tokens=[]
    var event,site,date,round,white,black,result,movetext;
    while(pgn.indexOf('[')!=-1){
        str=pgn.substr(pgn.indexOf('['),pgn.indexOf(']')-pgn.indexOf('[')+1);
        tokens.push(str);
        pgn=pgn.substr(pgn.indexOf(']')+1,pgn.length-pgn.indexOf(']'));
    }
    if(tokens.length>0){
    event=tokens[0].substr(tokens[0].indexOf('"')+1,tokens[0].indexOf(']')-tokens[0].indexOf('"')-2);
    site=event=tokens[1].substr(tokens[1].indexOf('"')+1,tokens[1].indexOf(']')-tokens[1].indexOf('"')-2);
    date=tokens[2].substr(tokens[2].indexOf('"')+1,tokens[2].indexOf(']')-tokens[2].indexOf('"')-2);
    round=tokens[3].substr(tokens[3].indexOf('"')+1,tokens[3].indexOf(']')-tokens[3].indexOf('"')-2);
    white=tokens[4].substr(tokens[4].indexOf('"')+1,tokens[4].indexOf(']')-tokens[4].indexOf('"')-2);
    black=tokens[5].substr(tokens[5].indexOf('"')+1,tokens[5].indexOf(']')-tokens[5].indexOf('"')-2);
    result=tokens[6].substr(tokens[6].indexOf('"')+1,tokens[6].indexOf(']')-tokens[6].indexOf('"')-2);
    }
    movetext=pgn.substr(0,pgn.length).trim();

    PGN = new pgnObj(event,site,date,round,white,black,result,movetext);
    return(PGN);
}

function loadMoves(movetext){
    pgnmoves=[];
    mvs=[];
    x=1;y=2;
    console.log(movetext.indexOf(y));
    movetext=movetext.substr(movetext.indexOf('.')+1,movetext.length);

    while(movetext.indexOf('.')!=-1){
        mvs.push(movetext.substr(0,movetext.indexOf('.')-2).trim());
        movetext=movetext.substr(movetext.indexOf('.')+1,movetext.length);
    }
    mvs.push(movetext);
    console.log(mvs);
    
    var tmpMap=[[]];
    for(i=0;i<8;i++) tmpMap[i] = map[i].slice();

    mvn=0;
   // initializePieceCount();
    console.log(wpieceCount,bpieceCount);
    for(f=0;f<mvs.length;f++){
        console.log('hello');
        if(mvs[f].indexOf(' ')!=-1){
            s = mvs[f].split(' ');
            w = s[0];
            b = s[1];
        }
        else {w=mvs[f];b="";}
        
        if(w!=""||w!=null)
        pgnmoves.push(moveArray(w,'w',tmpMap,mvn++));
        if(b!=""||b!=null)
        pgnmoves.push(moveArray(b,'b',tmpMap,mvn++));
}
console.log(pgnmoves);
map = pgnmoves[pgnmoves.length-1].map_c;
moves=pgnmoves;
engine_result="";
//moves.forEach(element => {
  //  str=mapToFen(element.map_c);
   // stockfish.postMessage("position "+str);
    //stockfish.postMessage('go depth 2');
    //stockfish.postMessage('eval');

    //stockfish.onmessage = function(event){
     //   msg = event.data;
       // console.log(msg);
//}
//});

moveNumber=pgnmoves.length;
availBackMoves=120;
console.log(moves);                                     
}

function moveArray(w,color,tmpMap,f){
    var piece,from,to,captured,movenumber,incheck,promoted;
    var w=w;
    var color=color;
    movenumber=f;
    if(w=='O-O'){
        if(color=='w') r = 0;
        else r=7;
        piece=color+'k';
        from=tn(r+1,5);
        to=tn(r+1,7);
        tmpMap[r][4]="";
        tmpMap[r][6]=piece;
        tmpMap[r][5]=color+'r';
        tmpMap[r][7]='';
        pieceCount=[];
        pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
        return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from));
    }

    if(w=='O-O-O'){
        if(color=='w') r = 0;
        else r=7;
        piece=color+'k';
        from=tn(r+1,5);
        to=tn(r+1,3);
        tmpMap[r][4]="";
        tmpMap[r][2]=piece;
        tmpMap[r][3]=color+'r';
        tmpMap[r][0]='';
        pieceCount=[];
        pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
        return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from));
    }
    
    if(w.length==2){
        if(color=='w') cf=0;
        else cf=2;

        row = w[1]*1;
        col = fileToNum(w[0])*1;
        piece=color+'p';
        to = tn(row,col);
        if(tmpMap[row-2+cf][col-1]==color+'p'){
            if(color=='w'){
            from=tn(row-1,col);
            tmpMap[row-2][col-1]="";
            tmpMap[row-1][col-1]=color+'p';
            }
            else{
                from=tn(row+1,col);
            tmpMap[row][col-1]="";
            tmpMap[row-1][col-1]=color+'p';
            }
        }
        else{
            if(color=='w'){
            from=tn(row-2,col);
            tmpMap[row-3][col-1]="";
            tmpMap[row-1][col-1]=color+'p';
            }
            else{
                from=tn(row+2,col);
            tmpMap[row+1][col-1]="";
            tmpMap[row-1][col-1]=color+'p';
            }
        }
        pieceCount=[];
        pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
        return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from));
      //  console.log(new Move(from,to,piece,tmpMap,movenumber,toCls(to),toCls(from)));
    }
    if(w.length>2){
        if(w[0]==w[0].toUpperCase()){
            piece=color+w[0].toLowerCase();
            
            if(w.length==4){
                if(w.indexOf('x')==-1){
                    if(w[3]=='+'){
                        row=w[2];
                        col=fileToNum(w[1]);
                        to=tn(row,col);
                        for(l=0;l<8;l++){
                            for(j=0;j<8;j++){
                                if(tmpMap[l][j]==piece){
                                    var tmp=allPossibleMoves(piece,tn(l+1,j+1),tmpMap);
                                    for(k=0;k<tmp.length;k++){
                                        if(tmp[k]==to){
                                            from=tn(l+1,j+1);
                                            tmpMap[l][j]="";
                                            tmpMap[row-1][col-1]=piece;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        pieceCount=[];
                        pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                        return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",true,false,false);
                    }
                    else{
                        row=w[3];
                        col=fileToNum(w[2]);
                        to = tn(row,col);
                        if(Number.isInteger(w[1]*1)){
                            for(j=0;j<8;j++){
                                if(tmpMap[w[1]-1][j]==piece){
                                   from=tn(w[1]*1,j+1);
                                   tmpMap[w[1]-1][j]="";
                                   tmpMap[row-1][col-1]=piece;
                                }
                            }    
                        }
                        else{
                            for(j=0;j<8;j++){
                                if(tmpMap[j][fileToNum(w[1])-1]==piece){
                                   from=tn(j+1,fileToNum(w[1]));
                                   tmpMap[j][fileToNum(w[1])-1]="";
                                   tmpMap[row-1][col-1]=piece;
                                }
                            }
                        }
                        pieceCount=[];
                        pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                        return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from));
                    }
                }
                else{
                    row=w[3]*1;
                    col=fileToNum(w[2]);
                    if(color=='w') cf=0;
                    else cf=2;
                    to=tn(row,col);
                    console.log(tmpMap);
                    console.log('to num:',pieceToNum(tmpMap[row-1][col-1][1]));
                    if(tmpMap[row-1][col-1]==""){
                        if(tmpMap[row-2+cf][col-1][0]=='w')
                        wpieceCount[pieceToNum(tmpMap[row-2+cf][col-1][1])]-=1;
                        else bpieceCount[pieceToNum(tmpMap[row-2+cf][col-1][1])]-=1;
                    }
                    else{
                    if(tmpMap[row-1][col-1][0]=='w')
                    wpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
                    else bpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
                    }
                    for(l=0;l<8;l++){
                        for(j=0;j<8;j++){
                            if(tmpMap[l][j]==piece){
                                var tmp=allPossibleMoves(piece,tn(l+1,j+1),tmpMap);
                                for(k=0;k<tmp.length;k++){
                                    if(tmp[k]==to){
                                        from=tn(l+1,j+1);
                                        tmpMap[l][j]="";
                                        tmpMap[row-1][col-1]=piece;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    pieceCount=[];
                    pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                    console.log(pieceCount);
                    return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",false,false,true);
                }
            }
            if(w.length==3){
                row=w[2]*1;
                col = fileToNum(w[1]); 
                to = tn(row,col);
                piece=color+w[0].toLowerCase();
                for(l=0;l<8;l++){
                    for(j=0;j<8;j++){
                        if(tmpMap[l][j]==piece){
                            var tmp=allPossibleMoves(piece,tn(l+1,j+1),tmpMap);
                            for(k=0;k<tmp.length;k++){
                                if(tmp[k]==to){
                                    from=tn(l+1,j+1);
                                    tmpMap[l][j]="";
                                    tmpMap[row-1][col-1]=piece;
                                    break;
                                }
                            }
                        }
                    }
                }
                pieceCount=[];
                pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                console.log(pieceCount);
                return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from));
            }

            if(w.length==5){
                if(w[4]=='+'){
                    row=w[3];
                    col=fileToNum(w[2]);
                    to=tn(row,col);
                    piece=color+w[0].toLowerCase();
                    for(l=0;l<8;l++){
                        for(j=0;j<8;j++){
                            if(tmpMap[l][j]==piece){
                                var tmp=allPossibleMoves(piece,tn(l+1,j+1),tmpMap);
                                for(k=0;k<tmp.length;k++){
                                    if(tmp[k]==to){
                                        from=tn(l+1,j+1);
                                        tmpMap[l][j]="";
                                        tmpMap[row-1][col-1]=piece;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    pieceCount=[];
                    pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                    console.log(pieceCount);
                    return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",true,false,true);
                }
                else{
                    row=w[4];
                    col=fileToNum(w[3]);
                    to=tn(row,col);
                    piece=color+w[0].toLowerCase();
                    if(tmpMap[row-1][col-1][0]=='w')
                    wpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
                    else bpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;

                    if(Number.isInteger(w[1]*1)){
                        for(j=0;j<8;j++){
                            if(tmpMap[w[1]-1][j]==piece){
                               from=tn(w[1]*1,j+1);
                               tmpMap[w[1]-1][j]="";
                               tmpMap[row-1][col-1]=piece;
                            }
                        }    
                    }
                    else{
                        for(j=0;j<8;j++){
                            if(tmpMap[j][fileToNum(w[1])-1]==piece){
                               from=tn(j+1,fileToNum(w[1]));
                               tmpMap[j][fileToNum(w[1])-1]="";
                               tmpMap[row-1][col-1]=piece;
                            }
                        }
                    pieceCount=[];
                    pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                    console.log(pieceCount);
                    return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",false,false,true);
                }
            }
            }
            if(w.length==6){
                row=w[4];
                    col=fileToNum(w[3]);
                    to=tn(row,col);
                    piece=color+w[0].toLowerCase();

                    if(Number.isInteger(w[1]*1)){
                        for(j=0;j<8;j++){
                            if(tmpMap[w[1]-1][j]==piece){
                               from=tn(w[1]*1,j+1);
                               tmpMap[w[1]-1][j]="";
                               tmpMap[row-1][col-1]=piece;
                            }
                        }    
                    }
                    else{
                        for(j=0;j<8;j++){
                            if(tmpMap[j][fileToNum(w[1])-1]==piece){
                               from=tn(j+1,fileToNum(w[1]));
                               tmpMap[j][fileToNum(w[1])-1]="";
                               tmpMap[row-1][col-1]=piece;
                            }
                        }
                    }
                    pieceCount=[];
                    pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                    console.log(pieceCount);
                    return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",true,false,true);
            }
        }
        else{

            if(w.indexOf('=')!=-1){
                if(color=='w') cf=0;
                else cf=2;
                row=w[1]*1;
                col=fileToNum(w[0]);
                to=tn(row,col);
                from=tn(row-1+cf,col);
                piece=color+'p';
                tmpMap[row-1][col-1]=color+w[3].toLowerCase();
                tmpMap[row-2+cf][col-1]="";
                if(w.length==4&&w[3]=='+') incheck=true;
                else incheck=false;
                pieceCount=[];
                pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                console.log(pieceCount);
                return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",incheck,false,false,color+w[3].toLowerCase());
            }

            if(w.length==3&&w[2]=='+'){
                
                if(color=='w') cf=0;
                else cf=2;
                row=w[1]*1;
                col = fileToNum(w[0]);
                if(tmpMap[row-1][col-1][0]=='w')
                wpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
                else bpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
                to=tn(row,col);
                from = tn(row-1+cf,fileToNum(w[0]));
                piece=color+'p';
                tmpMap[row-1][col-1]=color+'p';
                tmpMap[row-2+cf][fileToNum(w[0])-1]="";
                var pieceCount=[];
                pieceCount.push(wpieceCount,bpieceCount);
                return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",true,false,true);    
            }

            if(color=='w') cf=0;
            else cf=2;
            row=w[3]*1;
            col = fileToNum(w[2]);
            if(tmpMap[row-1][col-1][0]=='w')
                wpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
                else bpieceCount[pieceToNum(tmpMap[row-1][col-1][1])]-=1;
            to=tn(row,col);
            from = tn(row-1+cf,fileToNum(w[0]));
            piece=color+'p';
            if(tmpMap[row-1][col-1]==""){
                if(color=='w') tmpMap[row-2][col-1]="";
                else tmpMap[row][col-1]=""
            }
            tmpMap[row-1][col-1]=color+'p';
            tmpMap[row-2+cf][fileToNum(w[0])-1]="";
            if(w[w.length-1]=='+') incheck=true;
            else incheck=false;
            pieceCount=[];
            pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
            console.log(pieceCount);
            return new Move(from,to,piece,tmpMap,movenumber,pieceCount,toCls(to),toCls(from),"",incheck,false,true);
        }
    }
}

//loadMoves('1.e4 e6 2.d4 d5 3.Nd2 Nf6 4.e5 Nfd7 5.f4 c5 6.c3 Nc6');

function toCls(num){
    return '.square_'+Math.floor(num/10)+'x'+num%10;
}
function undo(){
    console.log('undo');
    if(moveNumber>=2 && computer=='black'){
        if(moveNumber%2==0) moves.pop();
        moves.pop();
        moveNumber=moves.length-1;
        for(i=0;i<8;i++)
        map[i]=moves[moveNumber].map_c[i].slice();
        wpieceCount=moves[moveNumber].pieceCount[0].slice();
        bpieceCount=moves[moveNumber].pieceCount[1].slice();
        renderRandom(moveNumber);
        if(moveNumber%2==0) loggedMoves.pop();
        loggedMoves.pop();
        displayLoggedMoves(loggedMoves);
    }

}
function playAudio(arg,direction){
    switch(arg){
        case 'move':
            var audio = new Audio('/sounds/move.wav');
            audio.play();
            break;
        
            case 'captured':{
                var audio = new Audio('/sounds/capture.mp3');
                audio.play();
                break;
            }
    }
}

//e2e4

//be2be4

    
function makeMove(m,c){
    fr=m[1];
    fc=fileToNum(m[0]);
    tr=m[3];
    tc=fileToNum(m[2]);
    piece = c+'p';
    var x= tc;
    var y= tr;
    var Id = "square_"+y+"x"+x;
    var className = ".square_"+y+"x"+x;
    yl = fr;
    xl = fc;
    pre_act_sq_id = "#square_"+yl+"x"+xl;
    pre_act_sq_cl = ".square_"+yl+"x"+xl;
    var act_img = document.querySelector(className);
  
            if(act_img != null){
                removePreActive();
                removeActive();
                act_img.style.zindex = 1;
                var square = document.querySelector(className);
                newImg = document.createElement('img');
                newImg.src=document.querySelector(pre_act_sq_id).src;
                if(m.length==5)newImg.src='images/pieces/'+c+m[4]+'.png';
                newImg.setAttribute('id',Id);
                newImg.setAttribute('class','piece');
                square.appendChild(newImg);
                curnt_act_piece=newImg.src.substr(newImg.src.length-6,2);
                if(m.length==5) curnt_act_piece=c+'p';
                var preSquare = document.querySelector(pre_act_sq_cl);
                var child = document.querySelector(pre_act_sq_id);
                preSquare.removeChild(child);

                if(map[y-1][x-1]!=""){
                    var tmp = document.querySelector(".square_"+y+"x"+x);
                    var tmp_child = document.querySelector("#square_"+y+"x"+x);
                    tmp.removeChild(tmp_child);
                }

                moveNumber+=1;
                availBackMoves+=1;
                captured = true;
                if(map[y-1][x-1]== ""){
                    captured=false;
                } 
                else{
                    captured=true;
                    capturedpiece=map[y-1][x-1][1];
                }
                promoted="";
                if(m.length==5){map[y-1][x-1]=c+m[4]; promoted=turn+m[4];} 
                else map[y-1][x-1]=map[yl-1][xl-1];
                map[yl-1][xl-1]="";
                if(curnt_act_piece[1]=='r'){
                    if(curnt_act_piece[0]=='w'){
                        if(yl==1&&xl==1&&!whiteRookQmoved ){whiteRookQmoved=true; canWhiteCastle_long=false;}
                        if(yl==1&&xl==8&&!whiteRookKmoved ) {whiteRookKmoved=true; canWhiteCastle_short=false;}
                    }
                    else{
                        if(yl==8&&xl==1&&!BlackRookQmoved ) {BlackRookQmoved=true;canBlackCastle_long=false;}
                        if(yl==8&&xl==8&&!BlackRookKmoved ) {BlackRookKmoved=true;canBlackCastle_short=false;}
                    }
                }
                if(curnt_act_piece[1]=='k'){
                    if((Math.abs(xl-x)>1)){
                        goahead=false;
                        if((y==1||y==8)&&(x==7||x==3)){
                            if(x==7){
                                if(canCastle(curnt_act_piece[0],'short')){
                                    doCastle(curnt_act_piece[0],'short');
                                    goahead=true;
                                }
                                else if(canCastle(curnt_act_piece[0],'long')){
                                    doCastle(curnt_act_piece[0],'long');
                                    goahead=true;
                                }
                            }
                        }
                    }
                    else{
                        if(curnt_act_piece[0]=='w'){
                            canWhiteCastle_long=false;
                            canWhiteCastle_short=false;
                        }
                        else{
                            canBlackCastle_long=false;
                            canBlackCastle_short=false;
                        }
                    }
                }

                if(curnt_act_piece[1]=='p'){
                    console.log("pawn");
                    if(Math.abs(xl-x)>0){
                        if(!captured){
                            captured=true;
                            capturedpiece = map[yl-1][x-1][1];
                            console.log("removing",".square_"+yl+"x"+x);
                            var tmp = document.querySelector(".square_"+yl+"x"+x);
                            var tmp_child = document.querySelector("#square_"+yl+"x"+x);
                            tmp.removeChild(tmp_child);
                            map[yl-1][x-1]="";
                        }
                    }
                }
                en="";
                if(curnt_act_piece[1]=='p'&&Math.abs(yl-y)>1){
                    en=turn;
                }

                if(isInCheck(turn=='w'? 'b':'w',map)){
                    console.log(turn=='w'? 'b':'w','is in check');
                    checked=true;
                } 
                if(captured){
                    playAudio('captured','forward');
                    switch(capturedpiece){case'p':indx=0;break;case'r':indx=1;break;case'n':indx=2;break;case'b':indx=3;break;case'q':indx=4;break;}
                    if(turn=='w') bpieceCount[indx]-=1;
                    else wpieceCount[indx]-=1;
                }
                else{
                playAudio('move','forward');
                }
                var pieceCount=[];
                pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                move = new Move(tn(yl,xl),tn(y,x),curnt_act_piece,map,moveNumber,pieceCount,className,pre_act_sq_cl,"",checked,mate,captured,promoted);
                showCaptured(move);
                moves.push(move);
                console.log(move);
                currently_rendering=moveNumber;
               
                if(turn=='w')
                    turn='b';
                else turn='w';
                moveLogger(move,captured,castled,castleType);
                castled=false;
            }

            renderMove(moves[moveNumber]);
}

function mapToFen(map){
    ar = map;
    str = "fen ";
    sc=0;
    for(i=7;i>=0;i--){
        for(j=0;j<8;j++){
            if(map[i][j]==""){
                sc++;
            }
            else{
                if(map[i][j][0]=='w'){//white piece
                    if(sc!=0) str+=sc
                        str+=map[i][j][1].toUpperCase();
                    sc=0;
                }
                else{   //black piece
                    
                    if(sc!=0) str+=sc
                        str+=map[i][j][1];
                    sc=0;
                }
            }
        }
        if(sc!=0) str+=sc;
        sc=0;
        if(i!=0)
            str+='/';
    }

    str+=" "+turn+" ";

    if(canWhiteCastle_short) str+="K";
    if(canWhiteCastle_long) str+="Q";
    if(canBlackCastle_short) str+="k";
    if(canBlackCastle_long) str+='q';
    lstmove= moves[moves.length-1];
    if(lstmove.piece[1]=='p'){
        rowJump = Math.floor(lstmove.to/10)-Math.floor(lstmove.from/10);
        if(rowJump==2||rowJump==-2){
            str+=" "+getFile(lstmove.to%10)+Math.floor(lstmove.to/10);
        }
        else str+=" -";
    }
    else str+=" -";

    str+=" "+moveNumber+" ";
    str+=Math.floor(moveNumber/2+1);
    console.log(str);
    return str;
}

function getFile(num){
    switch(num){case 1: return 'a';case 2: return 'b';case 3: return 'c';case 4: return 'd';case 5: return 'e';case 6: return 'f';case 7: return 'g';case 8: return 'h';}
}
function fileToNum(c){
    switch(c){case 'a': return 1;case 'b': return 2;case 'c': return 3;case 'd': return 4;case 'e': return 5;case 'f': return 6;case 'g': return 7;case 'h': return 8;}
}

function onEngineMove(depth=2){
    str=mapToFen(map);
    stockfish.postMessage("position "+str);
    stockfish.postMessage('go depth '+depth);
    stockfish.postMessage('eval');

    stockfish.onmessage = function(event){
        msg = event.data;
        if(msg.match('bestmove')){
            mv = msg.substr(9,5).trim();
            makeMove(mv,'b');
        }
        if(msg.match('mate 0')){
            if(msg)
            alert('mate!!');
        }
    }
}

function initializePieceCount(){
    for(i=0;i<8;i++){
        for(j=0;j<8;j++){
            if(map[i][j][0]=='w'){
                switch(map[i][j][1]){
                    case 'p': wpieceCount[0]++;break;
                    case 'r': wpieceCount[1]++;break;
                    case 'n': wpieceCount[2]++;break;
                    case 'b': wpieceCount[3]++;break;
                    case 'q': wpieceCount[4]++;break;
                    case 'k': wpieceCount[5]++;break;
                }
            }
            if(map[i][j][0]=='b'){
                switch(map[i][j][1]){
                    case 'p': bpieceCount[0]++;break;
                    case 'r': bpieceCount[1]++;break;
                    case 'n': bpieceCount[2]++;break;
                    case 'b': bpieceCount[3]++;break;
                    case 'q': bpieceCount[4]++;break;
                    case 'k': bpieceCount[5]++;break;
                }
            }
        }
    }
    }
    
    function pieceToNum(piece){
        switch(piece){
            case 'p':return 0; case 'r':return 1; case 'n': return 2; case 'b': return 3; case 'q': return 4; case 'k': return 5;
        }
    }





