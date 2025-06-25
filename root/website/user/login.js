

// Getting form data for register 


$(document).ready(function(){
    $("#userName,#userEmail,#userPassword,#confirm_password").on("input",function(){
        $(".bordered").css("border","1px solid #CBD3D9");
    });
    $("#register").on("click",function(){
        let userName=$("#userName").val();
        let userEmail=$("#userEmail").val();
        let userPassword=$("#userPassword").val();
        let confirm_password=$("#confirm_password").val();
        if(userName != "" && userEmail !="" && userPassword != "" && confirm_password !=""){
        if(userPassword==confirm_password){
            $.ajax({
                url:_BASE_URL,
                data:{
                    function_name:"userRegister",
                    userName:userName,
                    userEmail:userEmail,
                    userPassword:userPassword
                },
                method:"post",
                success:function(response){
                    data=JSON.parse(response)
                    
                    if(data.status==1)
                    {
                        alert(data.message);
                        window.location.href="login.html";
                    }
                    
                    else
                    alert(data.msg)
                console.log(data);
                },
                error:function(xhr,error){
                    console.debug(xhr);
                    console.debug(error);
                    console.log("Error");
                }
            });
        }
        else{
            alert("Password is not same in both fields");
            event.preventDefault();
        }
    }
    else
    {
        alert("All fields are mandatory");
        $(".bordered").css("border","1px solid red");
    }
    });


    // Login data
    $("#login").on("click",function(){
        let loginEmail=$("#loginEmail").val();
        let loginPassword=$("#loginPassword").val();
        if(loginEmail !="" && loginPassword !=""){
            $.ajax({
                url:_BASE_URL,
                data:{
                    function_name:"userLogin",
                    loginEmail:loginEmail,
                    loginPassword:o=loginPassword
                },
                method:"post",
                success:function(response){
                    
                    let data=JSON.parse(response);
                    if(data.status==1){
                        localStorage.setItem("userName",data.data.userName);
                        localStorage.setItem("userId",data.data.id);
                        window.location.href="index.html";
                    }
                    else{
                        alert(data.message);
                    }
                },
                error:function(xhr,error){
                    console.debug(xhr);
                    console.debug(error);
                    console.log("Error");
                }
            });
        }
        else
        {
            alert("Please Enter user Email and Password");
            
        }
    });

    
});



