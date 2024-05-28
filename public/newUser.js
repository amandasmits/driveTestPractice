function save(){
    let newUser = {};
    newUser.username = document.getElementById("newusername").value;
    newUser.password = document.getElementById("newpassword").value;

    if (newUser.username === "" || newUser.password === ""){
        alert("Invalid input")
        document.getElementById("newpassword").value = "";
        document.getElementById("newusername").value = "";
        return;
    }

    let req = new XMLHttpRequest();

    if(this.status == 200){
        alert("User Saved")
        document.getElementById("newpassword").value = "";
        document.getElementById("newusername").value = "";
    }

    req.onreadystatechange= function(){
        if (this.status == 400){
            alert("User already exists")
            document.getElementById("newusername").value = "";
            document.getElementById("newpassword").value = "";
        }
    }

    req.open("POST", "/newUser");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(newUser));
}