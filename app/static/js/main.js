var data = { // data to be passed to server
    1 : [-1],
    2 : [-1,-1,-1,-1,-1],
    3 : [-1,-1,-1,-1,-1],
    4 : [-1,-1,-1,-1,-1],
    5 : [-1],
    6 : [-1]
}

link = {
    "api_request" : "http://https://luvin.herokuapp.com/api/request/",
    "result_page" : "http://https://luvin.herokuapp.com/result"
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
        var payload = {};
        var request_id = getRequestId();
        var request_string = getDatatoString();

        payload["request_id"] = request_id;
        payload["request_string"] = request_string;
        post(link["api_request"],payload);
        window.location.href = gen_result_link(request_id);
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

function gen_result_link(request_id){
    var result = link["result_page"]+"?request_id="+request_id;
    return result;
}

function getRequestId(){
    var uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    return uuid;
}

function getDatatoString(){
    var i = 1;
    var result_string = "";
    for(i=1;i<=6;i++){
        var j = 0;
        for(j=0;j<data[i].length;j++){
            result_string += (data[i][j]+" ");
        }
    }
    return result_string;
}

function post(url, data) {
    $.post({
        url,
        data
    });
}