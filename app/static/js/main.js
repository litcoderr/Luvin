var data = { // data to be passed to server
    1 : [-1],
    2 : [-1,-1,-1,-1,-1],
    3 : [-1,-1,-1,-1,-1],
    4 : [-1,-1,-1,-1,-1],
    5 : [-1],
    6 : [-1]
}

function checkDone(step){ // check if current step is done filling out
    var validness = true;
    if(step==6){
        var index = 1
        for(index=1;index<7;index++){
            var i = 0;
            for(i=0;i<data[index].length;i++){
                if(data[index][i]==-1) {
                    validness = false;
                    break;
                }
            }
        }
    }else{
        var i = 0;
        for(i=0;i<data[step].length;i++){
            if(data[step][i]==-1) {
                validness = false;
                break;
            }
        }
    }
    
    return validness
}

function btnCheck(id){ // called when button is clicked
    var info = id.split("_");
    var cur_step = info[0];
    var cur_index = info[1];
    var cur_value = info[2];
    // upadte changes
    data[cur_step][cur_index] = parseFloat(cur_value);

    // check if next is available
    // if valid --> turn on button
    // if not valid --> turn off button
    var valid = checkDone(cur_step);
    var next_btn_id = "sb_"+cur_step+"_btn"
    if(valid){
        // delete disabled attribute
        document.getElementById(next_btn_id).disabled = false;
    }else{
        // add disabled attribute
        document.getElementById(next_btn_id).disabled = true;
    }
}

function submit(id){
    // check if last submit or not
    var cur_step = parseInt(id.split("_")[1]);
    console.log(data);
    if(cur_step==6){
        // Last submit btn pressed
        // do server thing here
    }else{
        // go to next btn pressed
        // 1. change current link
        document.getElementById("pills-step"+cur_step).classList.remove('active');
        document.getElementById("pills-step"+cur_step).setAttribute("aria-selected",false);
        // 2. change next link
        document.getElementById("pills-step"+(cur_step+1)).classList.add('active');
        document.getElementById("pills-step"+(cur_step+1)).setAttribute("aria-selected",true);

        // 3. change current div
        document.getElementById("pills-step"+(cur_step)+"-content").classList.remove('active','show');
        // 4. change next div
        document.getElementById("pills-step"+(cur_step+1)+"-content").classList.add('active','show');
    }
}