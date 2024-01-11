function submit(){
    console.log("submit function called")
    radiobuttons = document.querySelectorAll("input[type = 'radio']");
    console.log(radiobuttons)
    IDsOfSelected = [];

    radiobuttons.forEach(button =>{
        if(button.checked === true){
            IDsOfSelected.push(button.id);
        }
    })
    
    let req = new XMLHttpRequest();
    req.open("POST", "/SubmitTest");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(IDsOfSelected));

    req.onreadystatechange = function (){
        if (req.status === 201){
            document.body.innerHTML = req.responseText;
            //open the test results here  
        }

        if (req.status ===500){
            alert("error processing test results");
        }
    }
}