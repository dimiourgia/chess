
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
    constructor(from,to,piece,map_c,moveNumber,pieceCount,curnt_act_squr="",pre_act_sqr="",nxt_sqr="",incheck=false,mate=false,captured=false,promoted=""){ 
        this.from = from;
        this.to = to;
        this.piece = piece;
        this.map_c=[[]];
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
var speeds = {
    nodelay:0,
    pause:500,
    slow:60,
    normal:30,
    fast:10,
}  

var level = 'one';var pre_ar=[];var curnt_act_sq_cl = "";var pre_act_sq_cl = "";var pre_act_sq_id = "";var curnt_act_piece="";var moveNumber=0;var moves=[];var availBackMoves=0;var flipped=true;var turn='w';var drgend=true;var last_x;var last_y;var hasBkMoved=false;var hasWkMoved=false;var whiteRookKmoved=false;var whiteRookQmoved=false;var BlackRookKmoved=false;var BlackRookQmoved=false;var whiteCastled = false;var blackCastled = false;var canBlackCastle_short=true;var canBlackCastle_long=true;var canWhiteCastle_short=true;var canWhiteCastle_long=true;var castled=false;var castleType='';var wpieceCount = [0,0,0,0,0,0];var bpieceCount = [0,0,0,0,0,0];var en="";var currently_rendering=0;var clickedActive="";var showpp=false;var player1='white';var player2='black';var computer = player2;var checked,mate,captured,promoted;var touchDevice=false;var current_puzzle= 0;var fromTouch=false;
var mouseEventAdded = false;
var goneRogue=false;
var moveAfterRogueMode=0;
var doEvaluation=true;

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


//makeMove('e8c8');
renderBoard('white','/images/pieces/',map);
var stockfish = new Worker('/js/stockfish.asm.js');

if(localStorage.getItem('showEvalBar')=='true'){
    doEvaluation=true;
    document.querySelector('.players_info').style.display = 'block';
    document.querySelector('#eval_switch').checked=true;
    console.log('showing Eval bar');
}
else{
    doEvaluation=false;
    document.querySelector('.players_info').style.display = 'none';
    document.querySelector('#eval_switch').checked=false;
    console.log('not showing eval bar');
}


console.log('local storage',localStorage.getItem('showEvalBar'));


var puzzle=[
    {
    fen: '4rk2/p1b2p1p/1p4p1/8/8/4B3/1P3P1P/4R1K1 w - - - -',
    event: '',
    white: 'Magnus Carlsen',
    black: 'Hikaru Nakmura',
    intro: {dialogue:[
        {string:'The game is played in venice in 2015'}
    ]},
    levels: 2,
    moves:{
        one:[
            {
                3568:{response: 'f8g8', correct: true, final: false, 
                    dialogue:[
                        { string:'Great work!', delay:speeds.fast },
                        { string: 'black king has only one move kg8', delay:speeds.normal },
                        {string: 'finally deliver the checkmate', delay:speeds.fast}
                    ]
                    }
            },
            {
                3524:{response:'', correct:false, final:false,
                    dialogue:[
                        {string:'Sorry! but black will force a rook trade by playing re1+ and then he simply has too many pawns and thats an easy win for black', delay:speeds.normal}
                    ]}
            },
    
            {
                defaultText:[
                    {string:'Try finding a more forcing move for a mating net', delay:speeds.normal}
                ]
            },
        ],
        two:[
            {
                1585:{response: '', correct: true, final: true,                                                                
                    dialogue:[
                        { string:'Congratualations!', delay:speeds.fast },
                        { string: 'You are an excellent finder of mate in two moves', delay:speeds.normal },
                    ]
                    }
            },
            {
                defaultText:[
                    {string:'Dude !', delay: speeds.fast},
                    {string:'You got a mate in one', delay: speeds.normal}
                ]
            },
        ],
        
    }
   
},
{   
fen: 'kbK5/pp6/1P7/8/8/8/8/R7 w - _ _ 0 1',
event: 'Imaginary',
white: 'Magnus Carlsen',
black: 'Hikaru Nakmura',
intro: {dialogue:[
    {string:'The game is played in venice in 2015'}
]},
levels: 2,
moves:{
    one:[
        {
            1161:{response: 'b8d6', correct: true, final: false, 
                dialogue:[
                    { string:'Thats it!', delay:speeds.fast },
                    { string: 'black has no choice but to move the bishop away from the defence of  a7 pawn', delay:speeds.normal },
                    {string: 'deliver the final blow', delay:speeds.fast}
                ]
                }
        },
        {
            defaultText:[
                {string:'This is gonna take longer. There is a much quicker way to checkmate! up blak', delay:speeds.normal}
            ]
        },
    ],
    two:[
        {
            6171:{response: '', correct: true, final: true,                                                                
                dialogue:[
                    { string:'Congratualations!', delay:speeds.fast },
                    { string: 'You are an excellent finder of mate in two moves', delay:speeds.normal },
                ]
                }
        },
        {
            defaultText:[
                {string:'There is a mate in one move', delay: speeds.normal}
            ]
        },
    ],
    
}
},
{
    fen: '3qr2k/pbpp2pp/1p5N/3Q4/2P1P3/P7/1PP2PPP/R4RK1 w - _ _ 0 1',
    event: 'Imaginary',
    white: 'Magnus Carlsen',
    black: 'Hikaru Nakmura',
    intro: {dialogue:[
        {string:'The game is played in venice in 2015'}
    ]}, 
    moves:{
    one:[
        {
            5487:{response: 'e8g8', correct: true, final: false, 
                dialogue:[
                    { string:'Excellent Move!', delay:speeds.fast },
                ]
                }
        },
        {
            defaultText:[
                {string:'That is not the move', delay:speeds.normal}
            ]
        },
    ],
    two:[
        {
            6876:{response: '', correct: true, final: true,                                                                
                dialogue:[
                    { string:'Congratualations!', delay:speeds.fast },
                    { string: 'for you smothering abilities', delay:speeds.normal },
                ]
                }
        },
        {
            defaultText:[
                {string:'There is a mate in one move', delay: speeds.normal}
            ]
        },
    ],
}
},
{
    fen: '2r2rk1/5pPp/p2pb3/q7/4PQP1/p7/1PP5/1K1R1B1R b - - 0 1',
    moves:{}
}
];







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

//Initialize move array with current position
initializePieceCount();
var pieceCount=[]
pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
moves.push(new Move(00,00,"",map,0,pieceCount));
const board = document.querySelector("#board");
var pos=board.getBoundingClientRect();
var board_x = pos.left;
var board_y= pos.top+window.scrollY;
var sqr_size = ((pos.width)/8);

if(pos.width%8!=0){
    console.log(pos.width%8);
}


loadPuzzle(puzzle[0]);

var preTouchX='';
var preTouchY='';


board.addEventListener('click',(e)=>{

    if(pre_act_sq_id!=null&&pre_act_sq_id!=""){
        var tmp = document.querySelector(pre_act_sq_id);
        if(tmp!=null){
            tmp.style.top = (pre_act_sq_id.substr(7,1)*1-1)*sqr_size + 'px';
            tmp.style.left = (pre_act_sq_id.substr(9,1)*1-1)*sqr_size + 'px';
        }  
    }
    
    touchDevice=true;
        var x= Math.ceil((e.pageX-board_x)/sqr_size);
        var y= Math.ceil((e.pageY-board_y)/sqr_size);
        real_x=x;
        real_y=y;
        if(flipped){
            y = 8-y+1;
        }
        else{
            x=8-x+1;
        }

        console.log('touch event fired at',y,x);

        if(x>0 && x<9 && y>0 && y<9){
            var Id = "square_"+y+"x"+x;
            var className = ".square_"+y+"x"+x;
        }

        var ar="";
    if(preTouchX==''&&preTouchY==''){
        console.log('executing pre empty touch', map[y-1][x-1]);
        curnt_act_piece = map[y-1][x-1];
        if(map[y-1][x-1]!=''){
            if(turn!=curnt_act_piece[0]){
                if(player1[0].toLowerCase()==curnt_act_piece[0]) toastMessage('It is not your turn');
                else
                toastMessage('Play as '+player1);
                return;
            }

            makeActive(className);
            curnt_act_sq_cl = className;
            pre_act_sq_id = '#'+Id;
            preTouchX=x;
            preTouchY=y;
            if(pre_ar!=null || pre_ar!='') removePossibleSquaresDisplay(pre_ar);
            ar = allPossibleMoves(curnt_act_piece,y*10+x,map);
            displayPossibleSquares(ar);
            pre_ar = ar;
        }
        else{
            if(pre_ar!=null || pre_ar!='') removePossibleSquaresDisplay(pre_ar);
            preTouchX='';
            preTouchY='';
        }
    }
    else{

        if(map[y-1][x-1]==''){
            if(pre_ar!=null || pre_ar!='') removePossibleSquaresDisplay(pre_ar);
            removeActive();
        }

        if(map[y-1][x-1][0]==turn){
            console.log('this is the case');
            curnt_act_piece = map[y-1][x-1];
            removeActive();
            makeActive(className);
            curnt_act_sq_cl = className;
            pre_act_sq_id = '#'+Id;
            preTouchX=x;
            preTouchY=y;
            removePossibleSquaresDisplay(pre_ar);
            ar = allPossibleMoves(curnt_act_piece,y*10+x,map);
            displayPossibleSquares(ar);
            pre_ar=ar;
            return;
        }

        var yl =preTouchY;
        var xl =preTouchX;

        var tmap=[[]];
        for(i=0;i<8;i++) tmap[i]=map[i].slice();
        tmap[yl-1][xl-1]="";
        tmap[y-1][x-1]=curnt_act_piece;
        if(isInCheck(curnt_act_piece,tmap)){
            incheck=true;
        } 
        else incheck=false;

        if(isPossibleMove(curnt_act_piece,tn(yl,xl),tn(y,x))&&!incheck){

            removePossibleSquaresDisplay(pre_ar);

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
     
            gh=true;
                if(curnt_act_piece[1]=='k'){
                if((Math.abs(xl-x)>1)){
                    gh=false;
                    console.log('trying long castle 1');
                    if((y==1||y==8)&&(x==7||x==3)){
                        console.log('trying long castle 2');
                        if(x==7){
                            if(canCastle(curnt_act_piece[0],'short')){
                                doCastle(curnt_act_piece[0],'short');
                                gh=true;
                            }
                            else if(canCastle(curnt_act_piece[0],'long')){
                                console.log('trying long castle');
                                doCastle(curnt_act_piece[0],'long');
                                gh=true;
                            }
                        }
                    }
                }
                else if(Math.abs(xl-x)==1||Math.abs(yl-y)==1) goahead=true;
                else gh=false;
            }
    
            if(curnt_act_piece[1]=='k'&&(!hasBkMoved||!hasWkMoved&&goahead)){
                if(curnt_act_piece[0]=='w') hasWkMoved = true;
                else hasBkMoved = true;
            }

            console.log('value of gh',gh);
        if(gh){

            removePreActive();
            removeActive();
            pre_act_sq_cl = curnt_act_sq_cl;
            makePreActive(pre_act_sq_cl);
            curnt_act_sq_cl = className;
            makeActive(curnt_act_sq_cl);


            if(map[y-1][x-1]!=""){
                var tmp_child = document.querySelector("#square_"+y+"x"+x);
                tmp_child.parentNode.removeChild(tmp_child);
            }


                act_img = document.querySelector(pre_act_sq_id);

                act_img.style.zindex = 1;
                var square = document.querySelector(className);

                act_img.setAttribute('id',Id);
                act_img.style.left = (real_x-1)*sqr_size+'px';
                act_img.style.top = (real_y-1)*sqr_size+'px';


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
                   // playAudio('captured','forward');
                    switch(capturedpiece){case'p':indx=0;break;case'r':indx=1;break;case'n':indx=2;break;case'b':indx=3;break;case'q':indx=4;break;}
                    if(turn=='w') bpieceCount[indx]-=1;
                    else wpieceCount[indx]-=1;
                }
                else{
                //playAudio('move','forward');
                }
                var pieceCount=[];
                pieceCount.push(wpieceCount.slice(),bpieceCount.slice());
                move = new Move(tn(yl,xl),tn(y,x),curnt_act_piece,map,moveNumber,pieceCount,curnt_act_sq_cl,pre_act_sq_cl,"",checked,mate,captured);
                showCaptured(move);
                moves.push(move);
                fromTouch=true;

                
                console.log(moves);
                currently_rendering=moveNumber;
                
                if(turn=='w')
                turn="b";
                else turn='w';
                moveLogger(move,captured,castled,castleType);
                castled=false;

              //  renderRandom(moves.length-1);
              //renderMove(moves[moves.length-1],moves.length-1,true,'forward');
              animateMove(moves.length-1,'forward');
                if(!(curnt_act_piece[0]=='p'&&(y==1||y==8))){}
                    puzzleResponse(unreadableMove(move),puzzle[current_puzzle]);
            }
        else{
            //gh is false;
        }
        if(ar!="")
        removePossibleSquaresDisplay(ar);
    }

    else{
        //not a possible move
        removeActive(curnt_act_sq_cl);
    }

    preTouchX='';
    preTouchY='';
}
},false);

//pawnPromote('wq','square_8x6','square_8x6',8,6);
var firstClick = true;
function pawnPromote(piece,row,col){
    if(firstClick){
        firstClick=false;
        return;
    }
    firstClick=true;
    console.log('pawnpromote clicked');
    ar=['wq','wn','wb','bq','bn','bb'];
    sqrCls='square_'+row+'x'+col;
    tmp = document.querySelector('#'+sqrCls);
    tmp2 = document.querySelector('.'+sqrCls)
    tmp.parentNode.removeChild(tmp);
    tmp=document.createElement('img');
    tmp.setAttribute('class','piece');
    tmp.setAttribute('id',sqrCls);
    var fnlLeft;
    var fnlTop;
    if(flipped){fnlLeft=(col-1)*sqr_size+'px'; fnlTop=(8-row)*sqr_size+'px';}
    else{fnlLeft=(8-col)*sqr_size+'px'; fnlTop=(row-1)*sqr_size+'px';}
    tmp.style.left = fnlLeft;
    tmp.style.top = fnlTop;
    tmp.setAttribute('src','images/pieces/'+ar[piece]+'.png');
    tmp2.appendChild(tmp);
    brd=document.querySelector('.board');
    tmp = document.querySelector('.pp');
    brd.removeChild(tmp);
    map[row-1][col-1] = ar[piece];
    moves[moves.length-1].map_c[row-1][col-1]=ar[piece];
    moves[moves.length-1].promoted=ar[piece];
    loggedMoves.pop();
    moveLogger(moves[moves.length-1],moves[moves.length-1].captured);
    showpp=false;
    puzzleResponse(unreadableMove(move),puzzle[current_puzzle]);
}

function moveLogger(move,captured=false,castled=false,ct=""){
    return;4
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

function unreadableMove(move){
        return move.from*100+move.to;
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

function removeActive(cl=''){
var q= document.querySelectorAll('.active');
upto = q.length;
for(i=0;i<upto;i++) q[i].classList.remove('active');

if(cl!='') makeActive(cl);
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
    console.log('hello from pm');
    var map=tmap;
const row = Math.floor(position/10);
const col = position%10;
var ps = [];
console.log('looking for',piece,'at position ', position);
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
console.log('ps',ps);
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
        if(flipped){
            var fnlLeft = (file-sub-1)*sqr_size+'px';
            var fnlTop = (8-rank)*sqr_size+'px';
        }
        else{
            var fnlLeft = (7-file-sub)*sqr_size+'px';
            var fnlTop = (rank-1)*sqr_size+'px';
        }
        newImg.style.left = fnlLeft;
        newImg.style.top = fnlTop;
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
function preBtnOnClick(end=false){
    var move = moves[availBackMoves];
if(availBackMoves>0){
    removeActive();
    removePreActive();
    if(moves[availBackMoves-1].move_number!=0){
        makePreActive(moves[availBackMoves-1].pre_act_sqr);
        makeActive(moves[availBackMoves-1].curnt_act_squr);
    }
    var castled = (move.piece[1]=='k'&&Math.abs(move.to%10-move.from%10)==2)? true : false;
    var captured = move.captured;
    var promoted = move.promoted;

    img = document.querySelector('#square_'+Math.floor(move.to/10)+'x'+move.to%10);
    img.setAttribute('id','square_'+Math.floor(move.from/10)+'x'+move.from%10);
    if(flipped){var fnlLeft=(move.from%10 - 1)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.from/10))*sqr_size+'px';}
    else{var fnlLeft=(8-move.from%10)*sqr_size + 'px'; var fnlTop = (Math.floor(move.from/10)-1)*sqr_size+'px';}
    img.style.left = fnlLeft;
    img.style.top = fnlTop;
    
    if(captured){
        var cp = moves[availBackMoves-1].map_c[Math.floor(move.to/10)-1][move.to%10-1];
        parent = document.querySelector('.square_'+Math.floor(move.to/10)+'x'+move.to%10);
        tmpImg = document.createElement('img');
        tmpImg.setAttribute('src','images/pieces/'+cp+'.png');
        tmpImg.setAttribute('class','piece');
        tmpImg.setAttribute('id','square_'+Math.floor(move.to/10)+'x'+move.to%10);
        if(flipped){var fnlLeft=(move.to%10 - 1)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.to/10))*sqr_size+'px';}
        else{var fnlLeft=(8-move.to%10)*sqr_size + 'px'; var fnlTop = (Math.floor(move.to/10)-1)*sqr_size+'px';}
        tmpImg.style.left = fnlLeft;
        tmpImg.style.top = fnlTop;
        parent.appendChild(tmpImg);
    }

    if(promoted!=''){
        img.setAttribute('src','images/pieces/'+moves[availBackMoves-1].map_c[Math.floor(move.from/10)-1][move.from%10-1]+'.png')
    }

    if(castled){
        if(move.to%10 == 7){
            img = document.querySelector('#square_'+Math.floor(move.to/10)+'x6');
            if(flipped){var fnlLeft=(7)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.to/10))*sqr_size+'px';}
            else{var fnlLeft=(0)*sqr_size + 'px'; var fnlTop = (Math.floor(move.to/10)-1)*sqr_size+'px';}
            img.setAttribute('id','square_'+Math.floor(move.to/10)+'x8');
            img.style.left = fnlLeft;
            img.style.top = fnlTop;
        }
        else{
            img = document.querySelector('#square_'+Math.floor(move.to/10)+'x4');
            if(flipped){var fnlLeft=(0)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.to/10))*sqr_size+'px';}
            else{var fnlLeft=(7)*sqr_size + 'px'; var fnlTop = (Math.floor(move.to/10)-1)*sqr_size+'px';}
            img.setAttribute('id','square_'+Math.floor(move.to/10)+'x1');
            img.style.left = fnlLeft;
            img.style.top = fnlTop;
        }
    }
    availBackMoves-=1;
    currently_rendering=availBackMoves;

    for(i=0;i<8;i++) displayMap[i] = move.map_c.slice();
}
}

function nextBtnOnClick(){
if(availBackMoves<moveNumber){

    var move = moves[availBackMoves+1]

    removeActive();
    removePreActive();
    makePreActive(moves[availBackMoves+1].pre_act_sqr);
    makeActive(moves[availBackMoves+1].curnt_act_squr);
    
    var castled = (move.piece[1]=='k'&&Math.abs(move.to%10-move.from%10)==2)? true : false;
    var captured = move.captured;
    var promoted = move.promoted;

    if(captured){
        tmpImg = document.querySelector('#square_'+Math.floor(moves[availBackMoves+1].to/10)+'x'+moves[availBackMoves+1].to%10);
        tmpImg.parentNode.removeChild(tmpImg);
    }

    img = document.querySelector('#square_'+Math.floor(move.from/10)+'x'+move.from%10);
    img.setAttribute('id','square_'+Math.floor(move.to/10)+'x'+move.to%10);
    if(flipped){var fnlLeft=(move.to%10 - 1)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.to/10))*sqr_size+'px';}
    else{var fnlLeft=(8-move.to%10)*sqr_size + 'px'; var fnlTop = (Math.floor(move.to/10)-1)*sqr_size+'px';}
    img.style.left = fnlLeft;
    img.style.top = fnlTop;
    
  

    if(promoted!=''){
        img.setAttribute('src','images/pieces/'+moves[availBackMoves+1].map_c[Math.floor(move.to/10)-1][move.to%10-1]+'.png')
    }

    if(castled){
        if(move.to%10 == 7){
            img = document.querySelector('#square_'+Math.floor(move.to/10)+'x8');
            if(flipped){var fnlLeft=(5)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.to/10))*sqr_size+'px';}
            else{var fnlLeft=(2)*sqr_size + 'px'; var fnlTop = (Math.floor(move.to/10)-1)*sqr_size+'px';}
            img.setAttribute('id','square_'+Math.floor(move.to/10)+'x6');
            img.style.left = fnlLeft;
            img.style.top = fnlTop;
        }
        else{
            img = document.querySelector('#square_'+Math.floor(move.to/10)+'x1');
            if(flipped){var fnlLeft=(3)*sqr_size + 'px'; var fnlTop = (8-Math.floor(move.to/10))*sqr_size+'px';}
            else{var fnlLeft=(4)*sqr_size + 'px'; var fnlTop = (Math.floor(move.to/10)-1)*sqr_size+'px';}
            img.setAttribute('id','square_'+Math.floor(move.to/10)+'x4');
            img.style.left = fnlLeft;
            img.style.top = fnlTop;
        }
    }
  
    for(i=0;i<8;i++) displayMap[i] = move.map_c.slice();
    availBackMoves+=1;
    currently_rendering=availBackMoves;
}

}
function firstBtnOnClick(){
       repeat_pre(availBackMoves);
}

function repeat_pre(times) {
    preBtnOnClick();
    times && --times && repeat_pre(times);
}

function repeat_nxt(times) {
    nextBtnOnClick();
    times && --times && repeat_nxt(times);
}

function lastBtnOnClick(){
    repeat_nxt(moveNumber);
}

function renderRandom(move_number){
   if(currently_rendering>move_number) repeat_pre(currently_rendering-move_number);
   else if(currently_rendering<move_number) repeat_nxt(move_number-currently_rendering);
}

function renderMove(move,move_number,animate=false,animate_direction=""){

    console.log('i am rendering the move');
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
            var fnlLeft,fnlTop;
            if(flipped){fnlLeft=(j)*sqr_size+'px'; fnlTop=(7-i)*sqr_size+'px';}
            else{fnlLeft=(7-j)*sqr_size+'px'; fnlTop=(i)*sqr_size+'px';}

            tmpImg.style.left = fnlLeft;
            tmpImg.style.top = fnlTop;
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
    return ;
    }

function reAddNode(node){
  var  source = node.getAttribute('src');
   var clas = node.getAttribute('class');
   var id = node.getAttribute('id');
   parent = node.parentElement;

   parent.removeChild(node);

   newNode = document.createElement('img');
   newNode.setAttribute('class',clas);
   newNode.setAttribute('src',source);
   newNode.setAttribute('id',id);

   parent.appendChild(newNode);
}

class Pc{
    constructor(count,piece){
        this.count=count;
        this.piece=piece;
    }
}

function showCaptured(move){
    p1=document.querySelector('.player-1');
    p2=document.querySelector('.player-2');

    if(p1==null || p2==null) return;
    p1.innerHTML="";
    p2.innerHTML="";
    var wpieceCount = move.pieceCount[0];
    var bpieceCount = move.pieceCount[1];
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
    var ind = document.createElement('span');


    if(side == 'black'){
        flipped=false;

        for(i=0;i<8;i++){
            //handle index dsiplaying
            ind = document.createElement('span');
            ind.setAttribute('class','rowindex_span');
            ind.innerHTML=i+1;
            //.........................
            var tmp = document.createElement('div');
            tmp.setAttribute('class','_my_row _my_row_'+(i+1));
            tmp.appendChild(ind);
            for(j=7;j>=0;j--){
                 //handle colm index dsiplaying
           if(i==0){
            ind = document.createElement('span');
            ind.setAttribute('class','colindex_span');
            ind.innerHTML=getFile(j+1);
           }
            //.........................
             var tmp2=document.createElement('div');
             tmp2.setAttribute('class','square square_'+(i+1)+"x"+(j+1));
             tmp2.appendChild(ind);
             if(map[i][j]!=""){
                 var img = document.createElement('img');
                 img.setAttribute('src',image_source+map[i][j]+'.png');
                 img.setAttribute('class','piece');
                 img.setAttribute('id','square_'+(i+1)+"x"+(j+1));
                 img.style.left=sqr_size*(7-j)+'px';
                 img.style.top=sqr_size*(i)+'px';
                 tmp2.appendChild(img);
             }   
             tmp.appendChild(tmp2);
		
            }
            b.appendChild(tmp);
        }
    }

    
    if(side == 'white'){
        flipped=true;
        for(i=7;i>=0;i--){
          
            var tmp = document.createElement('div');
            tmp.setAttribute('class','_my_row _my_row_'+(i+1));
                  //handle index dsiplaying
                  ind = document.createElement('span');
                ind.setAttribute('class','rowindex_span');
                ind.innerHTML=i+1;
                tmp.appendChild(ind);
                //.........................
            
            for(j=0;j<8;j++){
                      //handle colm index dsiplaying
            if(i==0){
                ind = document.createElement('span');
                ind.setAttribute('class','colindex_span');
                ind.innerHTML=getFile(j+1);
            }
           
            //.........................
             var tmp2=document.createElement('div');
             tmp2.setAttribute('class','square square_'+(i+1)+"x"+(j+1));
             tmp2.appendChild(ind);
             if(map[i][j]!=""){
                 var img = document.createElement('img');
                 img.setAttribute('src',image_source+map[i][j]+'.png');
                 img.setAttribute('class','piece');
                 img.setAttribute('id','square_'+(i+1)+"x"+(j+1));
                 img.style.left=sqr_size*j+'px';
                 img.style.top=sqr_size*(7-i)+'px';
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
        if(p1!=null&&p2!=null){
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
     
    }
    else{
        renderBoard('white','/images/pieces/',moves[move_number].map_c);
       
        if(p1!=null&&p2!=null){
        p1.classList.remove('player-1');
        p1.classList.add('player-2');
        p2.classList.remove('player-2');
        p2.classList.add('player-1');
        p1=document.querySelector('.player-1');
        p2=document.querySelector('.player-2');
        p1.style.marginBottom=0+'px';
        p2.style.marginTop=10+'px';
        }

    }

    if(moveNumber!=0){
        makeActive(moves[moves.length-1].curnt_act_squr);
        makePreActive(moves[moves.length-1].pre_act_sqr);
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

function toCls(num){
    return '.square_'+Math.floor(num/10)+'x'+num%10;
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

function mapToFen(map,premature=false){
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
    if(premature){
        return str+' -';
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
function makeMove(m,c){
                console.log('make move execute with move', m);
                fr=m[1];
                fc=fileToNum(m[0]);
                tr=m[3];
                tc=fileToNum(m[2]);
                piece = c+'p';
                var x= tc;
                var y= tr;
                var Id = "square_"+y+"x"+x;
                var className = ".square_"+y+"x"+x;
                curnt_act_sq_cl=className;
                yl = fr;
                xl = fc;
                pre_act_sq_id = "#square_"+yl+"x"+xl;
                pre_act_sq_cl = ".square_"+yl+"x"+xl;
  
                removePreActive();
                removeActive();

                if(map[y-1][x-1]!=""){
                    var tmp_child = document.querySelector("#square_"+y+"x"+x);
                    tmp_child.parentNode.removeChild(tmp_child);
                }

                act_img = document.querySelector(pre_act_sq_id);
                act_img.setAttribute('id',Id);
                var fnlLeft,fnlTop;
                if(flipped){fnlLeft=(x-1)*sqr_size+'px'; fnlTop=(8-y)*sqr_size+'px';}
                else{fnlLeft=(8-x)*sqr_size+'px'; fnlTop=(y-1)*sqr_size+'px';}

                act_img.style.left = fnlLeft;
                act_img.style.top = fnlTop;

                var square = document.querySelector(className);
                square.classList.add('active');

                curnt_act_piece=map[yl-1][xl-1];
                var preSquare = document.querySelector(pre_act_sq_cl);
                preSquare.classList.add('preactive');

               

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
                if(m.length==5){
                    map[y-1][x-1]=c+m[4];
                    promoted=turn+m[4]; 
                    console.log('trying to promote');
                    act_img.setAttribute('src','images/pieces/'+turn+m[4]+'.png');

                } 
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
                            }
                            else if(canCastle(curnt_act_piece[0],'long')){
                                doCastle(curnt_act_piece[0],'long');
                                goahead=true;
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
                 //   playAudio('captured','forward');
                    switch(capturedpiece){case'p':indx=0;break;case'r':indx=1;break;case'n':indx=2;break;case'b':indx=3;break;case'q':indx=4;break;}
                    if(turn=='w') bpieceCount[indx]-=1;
                    else wpieceCount[indx]-=1;
                }
                else{
              //  playAudio('move','forward');
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

                console.log('I did everything');

            for(i=0;i<8;i++){
                displayMap[i]=map[i].slice();
            }
            currently_rendering=moveNumber
            animateMove(moveNumber,'forward');
          //  renderMove(moves[moveNumber],moveNumber);
            evaluate();
}

async function displayDialogue(dialogue,timeout=0){

    return new Promise(resolve=>{
        if(dialogue=='') {resolve('resolved'); return;}

        var speeds = {
            pause:500,
            slow:120,
            normal:60,
            fast:30,
        }  
        var totalDelay=0;
        var characters=[];

        var container = document.createElement('div');
        container.classList.add('dialogue');
        container.classList.add('msg');
        rp =document.querySelector('.rightpanel');
        rp.innerHTML="";
        rp.appendChild(container);
        dialogue.forEach((line,index) =>{
            if(index< dialogue.length) line.string += " ";
        
            line.string.split("").forEach(c=>{
                var span = document.createElement('span');
                span.textContent = c;
                totalDelay+=line.delay;
                container.append(span);
                characters.push({
                    span: span,
                    delay: line.delay,
                    classList: line.classes || [],
                });    
            })
        });
        
        var msgbdy = document.querySelector('.rightpanel');
        msgbdy.scrollTop = msgbdy.scrollHeight - msgbdy.clientHeight;
        
       revealCharacter(characters);
        setTimeout(function(){
            console.log('finished revealing');
            resolve('resolved');
        },totalDelay); 
        
    });
        
}
    
    
function revealCharacter(list){
        var next = list.splice(0,1)[0];
        next.span.classList.add('revealed');
        if(list.length>0){
            setTimeout(function(){
                revealCharacter(list);
            },next.delay);
        }
}

function fenToMap(fen){
    var map=[["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""]];
    str = fen.split(' ')[0].split('/');
    console.log(str);
    for(i=0;i<8;i++){
        var tmp = str[7-i];
        k=0;
        for(z=0;z<tmp.length;z++){
            if(!(tmp[z].toLowerCase() != tmp[z].toUpperCase())){
                for(j=0;j<tmp[z];j++){
                    map[i][k]="";
                    k++;
                }
            }
            else{
                if(tmp[z] === tmp[z].toUpperCase()) map[i][k]='w'+tmp[z].toLowerCase();
                else map[i][k] = 'b'+tmp[z].toLowerCase();
                k++;
            }
        }
    }
    return map;
}

function loadPuzzle(puzzle,pn=0){
    if(pn!=0) current_puzzle = pn;
    tmp = document.querySelector('.nextPuzzleButton');
    if(!tmp.classList.contains('hide')) tmp.classList.add('hide');
    level ='one';
    map = fenToMap(puzzle.fen);
    turn = puzzle.fen.split(' ')[1];
    castleStatus = puzzle.fen.split(' ')[2];
    
    //handle castling
    console.log(castleStatus);
    canWhiteCastle_long=false;
    canWhiteCastle_short=false;
    canBlackCastle_long=false;
    canBlackCastle_short=false;
    if(castleStatus.indexOf('k')!= -1) canBlackCastle_short=true;
    if(castleStatus.indexOf('q')!= -1) canBlackCastle_long=true;
    if(castleStatus.indexOf('K')!= -1) canWhiteCastle_short=true;
    if(castleStatus.indexOf('Q')!= -1) canWhiteCastle_long=true;

    //Clear the rightpanel 
    var pre = document.querySelectorAll('.dialogue');
        if(pre!=null){
            pre.forEach((item)=>{
                item.style.display = 'none';
               item.style.color = 'grey';
            })
        }
    pre=document.querySelector('.btnDiv');
    if(pre!=null) pre.style.display='none';

    //set main player
    player1= (turn=='w')? 'white':'black';
  
    moves.length=0;
    wpieceCount = [0,0,0,0,0,0];
    bpieceCount = [0,0,0,0,0,0];
    initializePieceCount();
    moves.push(new Move(0,0,'',map,0,pieceCount));
    moveNumber=0;
    currently_rendering=0;
    availBackMoves=0;
    moveAfterRogueMode=0;
    renderBoard('white','/images/pieces/',map);

    //handle eval bar
    if(player1=='black'){
        flipOnClick();
        document.querySelector('.eval_div').classList.add('eval_div_flip');
        document.querySelector('.eval_bar').classList.add('eval_bar_flip');
    }
    else if(document.querySelector('.eval_div').classList.contains('eval_div_flip')){
        document.querySelector('.eval_div').classList.remove('eval_div_flip');
        document.querySelector('.eval_bar').classList.remove('eval_bar_flip');
    }

    evaluate();
}

function undo(times=1){
    console.log('undo');
    if(times>moves.length-1) times=moves.length-1;
    renderRandom(availBackMoves-times);
    if(moveNumber>0 ){
        for(i=0;i<times;i++)
          moves.pop();
        moveNumber=moves.length-1;
        console.log(moves);
        console.log(moveNumber);
        for(i=0;i<8;i++)
        map[i]=moves[moveNumber].map_c[i].slice();
        wpieceCount=moves[moveNumber].pieceCount[0].slice();
        bpieceCount=moves[moveNumber].pieceCount[1].slice();
        
        for(i=0;i<times;i++)
           loggedMoves.pop();
       // displayLoggedMoves(loggedMoves);
       if(times%2!=0)
        turn = turn == 'w' ? 'b' : 'w';

        console.log('ps:',pre_act_sq_id,'cs:', curnt_act_sq_cl, turn);
    }
}


//fen = '4R1K1/1P3P1P/4B3/8/8/1p4p1/p1b2p1p/4rk2 w - - - -';
//console.log(fen.split(' ')[0].split('/'));

function puzzleResponse(move,puzzle){
    evaluate();
    console.log("hello",puzzle);
    var obj;
    switch(level){case 'one': obj=puzzle.moves.one; break; case 'two': obj=puzzle.moves.two; break; case 'three': obj=puzzle.moves.three };

    console.log("object:", move);
    var foundCorrect = false;
    var defaultDialogue =  "";

    if(obj!=undefined){
        obj.forEach((e)=>{
            if(e.hasOwnProperty('defaultText')){
                defaultDialogue = e.defaultText;
                console.log("df",defaultDialogue);
            }
            if(e.hasOwnProperty(move)){
                foundCorrect = true;
                correct = e[move].correct;
                response = e[move].response;
                dialogue = e[move].dialogue;
                if(correct) {
                   // document.querySelector(curnt_act_sq_cl).style.background = 'rgb(78 162 15 / 50%)';
                }
                displayDialogue(dialogue).then((message)=>{
                    if(correct){
                        // onEngineMove(5);
                        if(response!='')
                        setTimeout(()=>{makeMove(response,turn);},'1500');
                        

                    }
                
                    else{
                        showButtons();
                    }
                });
                
                //makeMove(response,turn);
                if(correct){
                    if(!e[move].final){
                        switch(level){case 'one': level='two'; break; case 'two': level='three'; break; case 'three': level='four'; break;}
                    }
                    else{
                        el = document.querySelector(".rightpanel");
                        nextPuzzleButton();
                        el.scrollTop = el.scrollHeight - el.clientHeight;
                        current_puzzle+=1;
                    }
                }
            }
        });

        if(moveAfterRogueMode!=0)
        defaultDialogue = [{string: 'Click below to go to original postion', delay:speeds.nodelay}];
        if(!foundCorrect&&defaultDialogue!=""){
            displayDialogue(defaultDialogue).then((message)=>{
                showButtons();
            });
        }
    }
    else onEngineMove();
}

window.addEventListener('resize',()=>{
    pos=board.getBoundingClientRect();
    board_x = pos.left;
    board_y= pos.top+window.scrollY;
    sqr_size = (pos.width)/8;
    renderRandom(moves.length-1);
});

function toastMessage(message) {
    var x = document.getElementById("snackbar");
    x.innerHTML=message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function responseMethod(method,response,depth=5){
    switch(method){
        case 'puzzleResponse': return puzzleResponse(response); break;
        case 'onEngineMove': return onEngineMove(depth); break;
        default: return;
    }
}

function onEngineMove(depth=2){
    str=mapToFen(map);
    stockfish.postMessage("position "+str);
    stockfish.postMessage('go depth '+depth);
    var bestmove = "";
    stockfish.onmessage = function(event){
        msg = event.data;
        console.log(msg);
        if(msg.match('bestmove')){
            mv = msg.substr(9,5).trim();
            bestmove = mv;            
        }
    }
    
    setTimeout(()=>{makeMove(bestmove,'b');}, 1500);
}

function showButtons(){
    if(goneRogue){
        
        tmp = document.querySelector('.rogue1');
        if(tmp!=null&&tmp!=""){
            document.querySelector('.rightpanel').removeChild(tmp);
          //  tmp = document.querySelector('.rogue2');
          //  document.querySelector('.rightpanel').removeChild(tmp);
            moveAfterRogueMode++;
        }
        else{
            moveAfterRogueMode++;
        }

        var btn1=document.createElement('button');
        var btn2=document.createElement('button');
        btn1.classList.add('waves-light');
        btn1.classList.add('waves-effect');
        btn1.classList.add('btn-small');
        btn1.classList.add('rogue1');

        btn1.innerHTML='Go to original position';
    
        document.querySelector('.rightpanel').appendChild(btn1);

        btn1.addEventListener('click',()=>{
            console.log('will try to undo ', moveAfterRogueMode);
            undo(moveAfterRogueMode);
            goneRogue=false;
            moveAfterRogueMode=0;
        });
        
        onEngineMove();
        moveAfterRogueMode++;
    }
    else{
        var btn1=document.createElement('button');
        var btn2=document.createElement('button');
   
      //  btn1.classList.add('dialogue');
        btn1.classList.add('waves-light');
        btn1.classList.add('waves-effect');
        btn1.classList.add('btn-small');
      //  btn2.classList.add('dialogue');
        btn2.classList.add('waves-light');
        btn2.classList.add('waves-effect');
        btn2.classList.add('btn-small');
        
        btn1.innerHTML = 'Let me continue with this move';
        btn2.innerHTML = 'Ok, I will try something else';

        var btnDiv = document.createElement('div');
        btnDiv.classList.add('btnDiv');
        btnDiv.appendChild(btn2);
        btnDiv.appendChild(btn1);
        document.querySelector('.rightpanel').appendChild(btnDiv);
        //document.querySelector('.rightpanel').appendChild(btn1);
    
        //Add event listeners
    
        btn1.addEventListener('click',()=>{
            onEngineMove();
            goneRogue=true;
            moveAfterRogueMode+=2;
            document.querySelector('.rightpanel').innerHTML='';
        });
        btn2.addEventListener('click',()=>{
            undo();
            goneRogue=false;
            document.querySelector('.rightpanel').innerHTML='';
        });

       // btn2.addEventListener('click',undo());
        //btn3.addEventListener('click',''); 
    }
    
}


function evaluate(){
    if(!doEvaluation) return ;
 stockfish.postMessage('position '+ mapToFen(map));
            stockfish.postMessage('go depth 15');
            stockfish.onmessage = function(event){
                msg = event.data;
              //  console.log(msg);
                    var score = contentBetween(msg,'score','nodes');
              //      console.log('score',score);

                    if(score!=undefined){
                        if(score.match('cp')){
                            var val = score.substr(4,score.length-4);
                            val = val.split(' ')[0];
                            val = val.trim();
                            val = val/100;


                            upto = Math.ceil(val);
                                    upto = Math.abs(upto);
                                    y=1;
                                    for(i=1;i<upto;i++){
                                        y = y+y/((i*2.2)+1);
                                    }
                                    y=y*10;
                            

                            if(Math.abs(val)==0) document.querySelector('#eval_bar').style.height = '50%';

                            if(turn==player1[0].toLowerCase()){
                                if(val<0){
                                    y=50-y;
                                    document.querySelector('#eval_bar').innerHTML=  val;
                                }
                                else{
                                    y=50+y;
                                    document.querySelector('#eval_bar').innerHTML=  '+'+val;
                                }
                                
                            }

                            else{
                                if(val<0){
                                    y=50+y;
                                    document.querySelector('#eval_bar').innerHTML= '+'+ Math.abs(val);
                                }
                                else if(val>0){
                                    y=50-y;
                                    document.querySelector('#eval_bar').innerHTML= '-'+val;
                                }
                                
                            }

                            if(y>100) y=98;
                            if(y<0) y = 1;
                            document.querySelector('#eval_bar').style.height = y + '%';
                        }

                        if(score.match('mate')){
                            score=score.trim();
                            var mate = score.substr(4,score.length-4).trim();
                            
                            if(turn==player1[0].toLowerCase()){
                                if(mate.match('-')||mate=='0'){
                                    if(mate.match('-'))
                                        mate=mate.substr(1,mate.length-1);
                                    document.querySelector('#eval_bar').style.height = '0%';
                                    var tmp = document.querySelector('.eval_div');
                                    tmp.innerHTML = '-M'+mate;
                                    tmp2 = document.createElement('div');
                                    tmp2.id='eval_bar';
                                    tmp2.style.width = '0px';
                                    tmp2.style.marginRight = '0px';
                                    tmp.appendChild(tmp2);
                                    tmp.style.color='white';
                                    tmp.style.textAlign = 'left';
                                    tmp.style.marginLeft = '5px';
                                }
                                else{
                                    var mate = score.substr(4,score.length-4).trim();
                                    document.querySelector('#eval_bar').style.height = '100%';
                                    document.querySelector('#eval_bar').innerHTML = '+M'+mate;
                                }   
                            }
                            else{
                                if(mate.match('-')){
                                    mate=mate.substr(1,mate.length-1);
                                    var mate = score.substr(4,score.length-4).trim();
                                    document.querySelector('#eval_bar').style.height = '100%';
                                    document.querySelector('#eval_bar').innerHTML = '+M'+Math.abs(mate);
                                }
                                if(mate*1>0){
                                    document.querySelector('#eval_bar').style.height = '0%';
                                    var tmp = document.querySelector('.eval_div');
                                    tmp.innerHTML = '-M'+mate;
                                    tmp2 = document.createElement('div');
                                    tmp2.id='eval_bar';
                                    tmp2.style.width = '0px';
                                    tmp2.style.marginRight = '0px';
                                    tmp.appendChild(tmp2);
                                    tmp.style.color='white';
                                    tmp.style.textAlign = 'left';
                                    tmp.style.marginLeft = '5px';
                                }
                                else{
                                    mate=mate.substr(1,mate.length-1);
                                    var mate = score.substr(4,score.length-4).trim();
                                    document.querySelector('#eval_bar').style.height = '100%';
                                    document.querySelector('#eval_bar').innerHTML = '+M'+Math.abs(mate);
                                }
                            }
                            
                        }
                    }
              //      console.log('moves',contentBetween(msg,'pv','bmc'));
            }
}

function contentBetween(main,str1,str2){
    if(!main.match(str1)) return;
    var start = main.match(str1).index+str1.length;
    if(main.match(str2))
    var length = main.match(str2).index-start;
    else var length = main.length-start;
    return main.substr(start,length);
}

function selectTheme(themeName){
    document.body.classList.add(themeName);
    document.querySelector('#board').classList.add('board'+themeName);
    document.querySelectorAll('.square').forEach((item)=>{
        x = item.classList[1];
        console.log(x);
        item.classList.add(x+themeName);
    });
}

function displayOverlayMessage(msg){
    tmp=document.createElement('div');
    tmp.classList.add('overlay');
    tmp.innerHTML=msg;
    document.querySelector('#board').appendChild(tmp);
}

function nextPuzzleButton(){
    btn=document.createElement('div');
    btn.setAttribute('class','nextPuzzleButton waves-effect waves-light btn');
    btn.addEventListener('click',()=>{
        loadPuzzle(puzzle[current_puzzle]);
        document.querySelector('.rightpanel').innerHTML = '';
    });
    btn.innerHTML='Next Puzzle';

    document.querySelector('.rightpanel').appendChild(btn);
}


function close_menu(){
    tmp=document.querySelector('.menu');
    tmp.style.width = '0px';
    document.querySelector('.collapsed_btn').style.opacity = '1';
    document.querySelectorAll('.menu_btn').forEach((item)=>{
        item.style.display = 'none';
    });
    pos=board.getBoundingClientRect();
    board_x = pos.left;
    board_y= pos.top+window.scrollY;
    sqr_size = (pos.width)/8;
   // renderRandom(moves.length-1);
}

function show_menu(){
    tmp=document.querySelector('.menu');
    tmp.style.width = '150px';
    document.querySelector('.collapsed_btn').style.opacity = '0';
    document.querySelectorAll('.menu_btn').forEach((item)=>{
        item.style.display = 'flex';
    });
    pos=board.getBoundingClientRect();
    board_x = pos.left;
    board_y= pos.top+window.scrollY;
    sqr_size = (pos.width)/8;
    renderRandom(currently_rendering);
}

function close_settings(){
    tmp=document.querySelector('.settings').style.display = 'none';
}


function show_settings(){
    tmp=document.querySelector('.settings').style.display = 'block';
}

document.querySelector('#eval_switch').addEventListener('change',()=>{
    var isChecked = document.querySelector('#eval_switch').checked;
    console.log(isChecked);
    
    if(!isChecked){
        document.querySelector('.players_info').style.display = 'none';
        doEvaluation = false;
        localStorage.setItem('showEvalBar','false');
    } 
    if(isChecked){
        document.querySelector('.players_info').style.display = 'block';
        doEvaluation=true;
        localStorage.setItem('showEvalBar','true');
        evaluate();
    } 
});

document.querySelector('#lightMode').addEventListener('change',()=>{

    var isChecked = document.querySelector('#lightMode').checked;
    if(isChecked){

        document.body.classList.remove('lighten-3');
        document.body.classList.add('darken-3');

        bton = document.querySelectorAll('.bton').forEach((item)=>{
            if(item.classList.contains('light')) item.classList.remove('light');
            item.classList.add('dark')
        })
    }

    else{

        document.body.classList.remove('darken-3');
        document.body.classList.add('lighten-3');


        bton = document.querySelectorAll('.bton').forEach((item)=>{
            if(item.classList.contains('dark')) item.classList.remove('dark');
            item.classList.add('light')
        })

    }


})
