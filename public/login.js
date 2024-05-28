function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "" || password ===""){
        alert("Invalid information, please try again");
    }

    let tosend = {};
    tosend.username = username;
    tosend.password = password;

    let req = new XMLHttpRequest();
    req.open("POST", "/login");
    req.setRequestHeader("Content-Type","application/json");
    req.send(JSON.stringify(tosend));

    req.onreadystatechange= function(){
        if (req.status === 200){
                html = req.responseText;
                document.body.innerHTML = html; 
        }
        
        if (req.status === 404){
            alert("Incorrect login information")
            document.getElementById("password").value = "";
        }

        if (req.status === 401){
            alert("User does not exist")
            document.getElementById("username").value = "";
        }
    }
};  