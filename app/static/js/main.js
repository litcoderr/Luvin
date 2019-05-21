
// collection of buttons and their info
var id_info = {
    "gen_1_btn" : {
        "step" : 1,
        "index" : 0,
        "value" : 1
    },
    "gen_2_btn" : {
        "step" : 1,
        "index" : 0,
        "value" : 0
    },
    "sb_1_btn" : {
        "step" : 1
    }
}

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
    for(var i=0;i<data[step].length;i++){
        if(data[step][i]==-1) validness = false; break;
    }
    return validness
}

function btnCheck(id){ // called when button is clicked
    var cur_step = id_info[id]["step"];
    var cur_index = id_info[id]["index"];
    var cur_value = id_info[id]["value"];
    // upadte changes
    data[cur_step][cur_index] = cur_value;

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
    var cur_step = id_info[id]["step"];
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
        $("#pills-step"+(cur_step+1)+"-content").fadeIn(150);
        document.getElementById("pills-step"+(cur_step+1)+"-content").classList.add('active','show');
    }
}