function login(){

let user=document.getElementById("userid").value;
let pass=document.getElementById("password").value;

if(user==="admin" && pass==="admin"){

window.location="dashboard.html";

}else{

document.getElementById("msg").innerHTML="Invalid Login";

}

}