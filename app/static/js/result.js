// Request Variables
var current_path = new URL(window.location.href);
var request_id = current_path.searchParams.get("request_id"); // got request id string

mode = "deploy"
linkmode = {
    "deploy" : "https://luvin.herokuapp.com",
    "debug" : "http://127.0.0.1:5000"
}

var request_path = linkmode[mode]+"/api/fetch/?request_id="+request_id;

// Check/Iteration variables
var iter_interval = 1000;
var iter_threshold = 60; //wait for a minute
var iter_idx = 1;
var success = false;
var fetch_result = -1;

var iterator = setInterval(check_task, iter_interval);

function fetch(){
    var request = new XMLHttpRequest();
    request.open('GET', request_path, true);
    request.onload = function(){
        // play around with data
        fetch_result = JSON.parse(request.responseText)["result"];
    };
    request.send();
    return fetch_result;
}

function check_task(){
    // stop if iteration is over threshold
    iter_idx += 1;
    if(iter_idx>iter_threshold){
        clearInterval(iterator);
    }

    // fetch data
    var result  = fetch();
    if(result != -1 && result != -2){ // fetched valid result
        success = true;
        clearInterval(iterator);
        console.log("result ready");
        console.log(result);
        // TODO change html value to result
        document.getElementById("result_content").innerHTML = result + "%";
    }else if(result == -1){ // result not valid yet
        console.log("result not ready");
    }else if(result == -2){
        console.log("wrong id");
        clearInterval(iterator);
        // TODO change html value to wrong id
        document.getElementById("result_content").innerHTML = "잘못된 요청.. 다시 시도해주세요";
    }
    if(!success){
        // TODO change html value to "please try later"
        document.getElementById("result_content").innerHTML = "Loading... 오래 걸린다면 다시 시도해주세요";
    }
}