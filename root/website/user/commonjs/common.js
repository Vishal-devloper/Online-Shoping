let _BASE_URL="http://localhost/proapp/zem/root/website/api/api.php";
    let getStoredId= localStorage.getItem("userId");
    let getStoredName= localStorage.getItem("userName");

    // if(!storedId && !storedName){
    //     window.location.href="..//user/login.html";
    // }
    
    $(document).ready(function(){
        if(!getStoredId && !getStoredName){
            $("#verify").removeClass("hide");
        }
        else{
            if(getStoredId !="" && getStoredName !=""){
                $("#verify").addClass("hide");
            }
        }
        
    });