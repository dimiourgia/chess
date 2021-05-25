
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