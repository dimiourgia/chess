
let move=1;

function formSubmit(){
    let levels = document.querySelector('#levels').value;;
    let fen = document.querySelector('#fen').value;
    let black = document.querySelector('#black').value;
    let white = document.querySelector('#white').value;
    let intro = document.querySelector('#intro').value; 
    let event = document.querySelector('#event').value;


    console.log(event,levels,fen,black,white,intro);

    return false;
}

function addMove(){
    move++;
    let table = document.querySelector('#moves_form');
    var row1 = table.insertRow();
    var row2 = table.insertRow();

    cell1 = row1.insertCell();
    cell2 = row1.insertCell();
    cell3 = row1.insertCell();
    cell4 = row1.insertCell();
    cell5 = row2.insertCell();

    cell1.innerHTML = "<input type='text' name='move' placeholder='move' id='move" + move +  "'>";
    cell2.innerHTML =  "<input type='text' name='response' placeholder='response' id='move" + move +  "_response'>";
    cell3.innerHTML = "<label for='correct'>correct</label><input type='checkbox' name='correct' id='move" + move +  "_correct'>";
    cell4.innerHTML =  "<label for='correct'>final</label><input type='checkbox' name='final' id='move" + move +  "_final'>";
    cell5.innerHTML = "<input type='text' name='dialogue' placeholder='dialogue' id='move" + move +  "_dialogue'>";
    cell5.setAttribute('colspan',4);
    document.querySelector('moves_form');
}




document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {edge: 'left'});
  });


  function close_settings(){
    tmp=document.querySelector('.settings').style.display = 'none';
}


function show_settings(){
    tmp=document.querySelector('.settings').style.display = 'block';
}

function expand(id){

    
    btn = document.querySelector('#'+id);
    if(btn.innerHTML=='expand_less') btn.innerHTML='expand_more';
    else  btn.innerHTML='expand_less';

   // first_card = document.querySelector('.card');
   // first_card_pos = first_card.getBoundingClientRect().top;

    span_parent = btn.parentElement.parentElement.parentElement.parentElement;
    pos = span_parent.getBoundingClientRect();
    span = span_parent.children[1];
    upDiv = span_parent.children[0];


    if(btn.innerHTML=='expand_less'){
        span.style.display = 'block';
        span.style.height = (screen.height-pos.top-pos.height-10) + 'px';
        upDiv.style.borderBottom = '1px solid grey';
        document.body.style.overflow =  'hidden';

      //  span_parent.style.marginTop = (first_card_pos - span_parent.getBoundingClientRect().top+8)+'px';
      //  console.log(span_parent.style.marginTop);
    }
    else{
       // span_parent.style.marginTop = '.5rem';
        upDiv.style.position = 'relative';
        span.style.display = 'none';
        upDiv.style.borderBottom = 'none';
        document.body.style.overflow = 'auto';
    }
    
}

