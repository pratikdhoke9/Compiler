var data = document.getElementById("compile");
var output = document.getElementsByClassName('output')[0];
var codeId;
var intervalId;
const compile = async function(){
    var language_code = document.getElementById('language_code').value;
    var code = document.getElementsByClassName('code')[0].value;
    
    output.value = 'Compiling..';
    
    var request = new XMLHttpRequest();
    var data = {"code":code,langId: language_code};
    //opening request
    request.open("POST",'https://codequotient.com/api/executeCode');
    request.setRequestHeader("Content-Type", "application/json");
    //sending request
    request.send(JSON.stringify(data));
    
    request.onreadystatechange = async function() {
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status >= 200 && request.status < 400){
                codeId = JSON.parse(request.responseText).codeId;
                intervalId = setInterval(getResult, 1000);
            }
            else{
                console.error("Request failed with status:", request.status);
            }
        }
    };
    
}
const getResult = async function(){
    var response = await fetch(`https://codequotient.com/api/codeResult/${codeId}`, {
        method: 'GET',
        headers: {
        'Accept': 'application/json'
        }
    });
    if (response.ok) {
        var responseData = await response.json();
        if (JSON.parse(responseData.data).status != 'Pending') {
            clearInterval(intervalId); 
            var output = document.getElementsByClassName('output')[0];
            if(JSON.parse(responseData.data).errors){
                output.value = JSON.parse(responseData.data).errors;
            }
            else{
                output.value = JSON.parse(responseData.data).output;
            }
        }
    }    
    else {
        console.error('Request failed with status:', response.status);
    }     
}   