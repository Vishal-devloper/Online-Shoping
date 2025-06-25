let _BASE_URL="http://localhost/proapp/zem/root/website/api/api.php";

// Signup
$(document).ready(function() {
    $("#signup").on("click", function() {
        let name = $("#name").val();
        let email = $("#email").val();
        let phone = $("#phone").val();
        let password = $("#password").val();
        let confirm_password = $("#confirm_password").val();

        if (password === confirm_password) {
            // Password validation
            let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (passwordPattern.test(password)) {
                $.ajax({
                    url:_BASE_URL,
                    data:{
                       function_name:"adminSignup",
                       name:name, 
                       email:email, 
                       phone:phone, 
                       password:password, 
                    },
                    method:"post",
                    success:function(response){
                        let data=JSON.parse(response);
                            if(data.status==1){
                                alert(data.message);
                                window.location.href="login.html";
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
                
            } else {
                
                alert("Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.");
            }
        } else {
            alert("Passwords should match!");
        }
    });

    $("#login").on("click",function(event){
        event.preventDefault();
        let loginEmail= $("#loginEmail").val();
        let loginPassword= $("#loginPassword").val();
        if(loginEmail!="" && loginPassword !=""){
            $.ajax({
                url:_BASE_URL,
                data:{
                    function_name:"adminLogin",
                    loginEmail:loginEmail,
                    loginPassword:loginPassword
                },
                method:"post",
                success:function(response){
                    let data=JSON.parse(response);
                    if(data.status==1){
                        localStorage.setItem("userId",data.data.id);
                        localStorage.setItem("userName",data.data.name);
                        localStorage.setItem("userEmail",data.data.email);
                        localStorage.setItem("userPhone",data.data.phone);
                        window.location.href="dashboard.html";
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
        else{
            alert("Email and Password not be Blank");
        }
    });
});
