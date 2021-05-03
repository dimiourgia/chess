
var speeds = {
    pause:500,
    slow:120,
    normal:60,
    fast:30,
}  

  var dialogue= [
    { 
        string:'Hello Everyone!',
        delay:speeds.slow,
    },
    { 
        string:'Agadamator Here',
        delay:speeds.normal,
    },
    { 
        string:'Are you readay to solve some puzzles?',
        delay:speeds.normal,
    },
]

displayDialogue(dialogue);


function displayDialogue(dialogue){
    var speeds = {
        pause:500,
        slow:120,
        normal:60,
        fast:30,
    }  
    var characters=[];
    var container = document.createElement('div');
    container.classList.add('dialogue');
    document.body.appendChild(container);
    dialogue.forEach((line,index) =>{
        if(index< dialogue.length) line.string += " ";
    
        line.string.split("").forEach(c=>{
            var span = document.createElement('span');
            span.textContent = c;
            container.append(span);
            characters.push({
                span: span,
                delay: line.delay,
                classList: line.classes || [],
            });    
        })
    });

    revealCharacter(characters);
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
