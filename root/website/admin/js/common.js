let _BASE_URL="http://localhost/proapp/zem/root/website/api/api.php";
let adminName=localStorage.getItem("userName");
let adminEmail=localStorage.getItem("userEmail");
let adminPhone=localStorage.getItem("userPhone");
let adminId=localStorage.getItem("userId");

$(document).ready(function(){
    if(!adminId && !adminEmail && !adminPhone && !adminName){
        window.location.href="../admin/login.html";
    }
    $("#adminName").text(adminName);
    
});