// "puzzle" need to be fetched from API
var puzzle=[
    {
        player:'white',
        fen: '4rk2/p1b2p1p/1p4p1/8/8/4B3/1P3P1P/4R1K1 w - - - -',
        intro: 'White to move. There is a mate in two'

    },
    {   
        player:'white',
        fen: 'kbK5/pp6/1P7/8/8/8/8/R7 w - _ _ 0 1',
        intro: 'White to move. There is a mate in two'

    },
    {
        player:'white',
        fen: '3qr2k/pbpp2pp/1p5N/3Q4/2P1P3/P7/1PP2PPP/R4RK1 w - _ _ 0 1',
        intro: 'White to move. There is a mate in two'
    },
    {
        player:'black',
        fen: '2r2rk1/5pPp/p2pb3/q7/4PQP1/p7/1PP5/1K1R1B1R b - - 0 1',
        intro: 'Black to move. Therre is a forced mate but be careful one mistake and black might be loosing'
    }
];


navigation_div = document.querySelector('.span_navigate');
pz_links = document.querySelector('.pz_links');
var dp = document.querySelector('#daily_puzzles');
var container = dp.children[1];


function add(){
 


pz_links.innerHTML = ' ';

for(l=0;l<puzzle.length;l++){
   a = document.createElement('a');
   a.innerHTML = l+1;
   pz_links.appendChild(a);
}


puzzles_div = document.createElement('div');
puzzles_div.setAttribute('class','puzzles');

for(l=0;l<4;l++){

row_div = document.createElement('div');
row_div.setAttribute('class','row');

col_div = document.createElement('div');
col_div.setAttribute('class','col s12 m8');


card_div = document.createElement('div');
card_div.setAttribute('class','card');

image_div = document.createElement('div');
image_div.setAttribute('class','card-image');

board_div = document.createElement('div');
board_div.setAttribute('class','pz-board');

title_span = document.createElement('span');
title_span.setAttribute('class','card-title');
title_span.innerHTML = '#'+l;

image_div.appendChild(board_div);
image_div.appendChild(title_span);


content_div  = document.createElement('div');
content_div.setAttribute('class','card-content');
content_div.innerHTML = puzzle[l].intro;


action_div = document.createElement('div');
action_div.setAttribute('class','card-action');

a = document.createElement('a');
a.setAttribute('class', 'btn-flat');
a.setAttribute('style', 'border:1px solid');
a.setAttribute('href','puzzles.html');
a.innerHTML="solve";

action_div.appendChild(a);

card_div.appendChild(image_div);
card_div.appendChild(content_div);
card_div.appendChild(action_div);



col_div.appendChild(card_div);
row_div.appendChild(col_div);

puzzles_div.appendChild(row_div);


renderBoard(puzzle[l].player,'/images/pieces/',fenToMap(puzzle[l].fen),board_div);
}

container.appendChild(puzzles_div);

}


function renderBoard(side,image_source,map,node){
    var map=map;
    b = node;
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
               //  img.style.left=sqr_size*(7-j)+'px';
              //   img.style.top=sqr_size*(i)+'px';
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
              //   img.style.left=sqr_size*j+'px';
              //   img.style.top=sqr_size*(7-i)+'px';
                 tmp2.appendChild(img);
             }   
             tmp.appendChild(tmp2);
            }
            b.appendChild(tmp);
        }
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

function getFile(num){
    switch(num){case 1: return 'a';case 2: return 'b';case 3: return 'c';case 4: return 'd';case 5: return 'e';case 6: return 'f';case 7: return 'g';case 8: return 'h';}
}


add();


puzzles_div = document.querySelector('.puzzles');



last_pn = Math.floor(container.scrollTop/450);
pz_links.children[last_pn].classList.add('current_puzzle');


container.addEventListener('scroll',(e)=>{
    pn = Math.floor(container.scrollTop/450);

    if(pn!=last_pn){
        console.log(pz_links.children[pn]);
        console.log(last_pn, 'removed');
        pz_links.children[last_pn].classList.remove('current_puzzle');
        
        if(!pz_links.children[pn].classList.contains('current_puzzle'))
            pz_links.children[pn].classList.add('current_puzzle');
        
 
        last_pn = pn;
    }
   
});
