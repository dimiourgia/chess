
page1 = document.querySelector('.page1');
page2 = document.querySelector('.page2');



page1.addEventListener('touchstart',(e)=>{
    firstTouch = e.touches[0].clientX;
});

page1.addEventListener('touchmove',(e)=>{
    var change = firstTouch-e.touches[0].clientX;


    if(change>20){
        page2.style.display = 'block';
        page1.style.left = '-'+change+'px';
        page2.style.left = (screen.width-change)+'px';
    }
    e.preventDefault();
});

page1.addEventListener('touchend',(e)=>{
    var change = firstTouch-e.changedTouches[0].clientX;
    console.log(change);
        
    if(change>screen.width/3){
        page2.style.left='0px';
        page1.style.left = '-100%';
        document.querySelector('.nav_text').innerHTML='All Puzzles';
     //   page1.style.display='none';
    }
    else{
        page2.style.transition = 'all .3s';
        page1.style.transition = 'all .3s';
        page1.style.left = '0px';
        page2.style.left = '100%';
        page2.style.display = 'none';
    }
});


page2.addEventListener('touchstart',(e)=>{
    firstTouch = e.touches[0].clientX;
});

page2.addEventListener('touchmove',(e)=>{
    var change = firstTouch-e.touches[0].clientX;


    if(change<0){
        page1.style.display = 'block';
        page2.style.left = Math.abs(change)+'px';
        page1.style.left = (Math.abs(change)-screen.width)+'px';
    }
    e.preventDefault();
});

page2.addEventListener('touchend',(e)=>{
    var change = firstTouch-e.changedTouches[0].clientX;
    console.log(change);
        
    if(change<screen.width/3){
        page1.style.left='0px';
        page2.style.left = '100%';
        page2.style.display='none';
        document.querySelector('.nav_text').innerHTML='Puzzle Board';
    }
    else{
        page2.style.transition = 'all .3s';
        page1.style.transition = 'all .3s';
        page1.style.left = '-100%';
        page2.style.left = '0px';
      //  page1.style.display = 'none';
    }
});