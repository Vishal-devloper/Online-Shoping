
const url=window.location.href;
const urlParams= new URLSearchParams(window.location.search);
const id=urlParams.get('id');
// ajax for single product pages
if(!id){
    window.location.href="productlisting.html?categoryId=0";
}
$.ajax({
    url:_BASE_URL,
    data:{
        function_name:"productSingle",
        id:id
    },
    method:"post",
    success:function(response){
        console.log(response);
        let data = JSON.parse(response);
        console.log(data);
        if(data.status == 1){
            let product=data.data;
            let productId=product.Id;
            console.log(data.data.productName);
            let productName=data.data.productName;
            let productPrice=product.productPrice;
            let discountedPrice=product.discountedPrice;
            let productDiscription=product.productDiscription;
            let productImage=product.productImage;
                $("#productName").text(productName);
                $("#productPrice").text("$"+productPrice);
                $("#discountedPrice").text("$"+discountedPrice);
                $("#productDiscription").text(productDiscription);
                $("#productImage").html(`<img src="../uploadedImages/${productImage}" alt="" class="img-fluid" style="width:100%;">`);
            
            
        }
        else{
        console.log("Product not found:", response.message);
        }
        
    },
    error:function(xhr,error){
        console.debug(xhr);
        console.debug(error);
        console.log("Error in single product");
    }
    
});
$(document).ready(function(){
    $("#increase").on("click", function () {
        let num = parseInt($("#quaintity-input").val()) || 0;
        let nextNum = num + 1;
        $("#quaintity-input").val(nextNum);
    });
    
    $("#decrease").on("click", function () {
        let num = parseInt($("#quaintity-input").val()) || 0;
        let nextNum = num > 0 ? num - 1 : 0;
        $("#quaintity-input").val(nextNum);
    });
});
