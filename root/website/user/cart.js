$(document).ready(function(){
    let tableBody=$("#tableBody");
    
    $.ajax({
        url:_BASE_URL,
        data:{
            function_name:"getCartData",
            userId:getStoredId
        },
        method:"post",
        success:function(response){
            let data=JSON.parse(response);
            if(data.status==1){
                // alert(data.message);
                let final_data=data.data;
                $.each(final_data,function(index,user){
                    let row=`<tr>   
                                    
                                    <td class="product-remove">
                                        <input type="hidden" value="${user.id}"></a>
                                        <a href="" class="remove-wishlist"><i class="fa-solid fa-xmark"></i>
                                        
                                    </td>
                                    <td class="product-thumbnail">
                                        <a href="">
                                            <img src="../uploadedImages/${user.productImage}" alt="">
                                        </a>
                                    </td>
                                    <td class="product-title">
                                        <a href="">
                                            ${user.productName}
                                        </a>
                                    </td>
                                    <td class="product-price">
                                        ${"$"+user.discountedPrice+".00"}
                                    </td>
                                    <td class="product-quantity">
                                        <input type="hidden" value="${user.id}"></a>
                                        <div class="pro-qty">
                                            <span class="dec qty-button">-</span>
                                            <input type="number" class="quaintity-input" value="${user.productQuantity}">
                                            <span class="inc qty-button">+</span>
                                        </div>
                                    </td>
                                    <td class="product-subtotal">${"$"+user.discountedPrice*user.productQuantity+".00"}</td>
                                </tr>`; 
                        tableBody.append(row);
                });
                 // Check if cart is empty after data is loaded
                 if (tableBody.children("tr").length === 0) {
                    $(".blank-cart").addClass("show-cart");
                    $(".responsive").addClass("hide");
                } else {
                    $(".blank-cart").removeClass("show-cart");
                    $(".blank-cart").addClass("hide");
                    $(".responsive").removeClass("hide");
                    $(".responsive").addClass("show-cart");
                }
                calculateTotalAmount();
                
            }
        },
        error:function(xhr,error){
            console.debug(xhr);
            console.debug(error);
            console.log("Error");
        }
    });

    
});
function calculateTotalAmount(){
    let total=0;
    $(".product-subtotal").each(function(){
        let subtotal = parseFloat($(this).text().replace("$", "")) || 0;
        total += subtotal;
        
    });
    $(".total").text("$"+total.toFixed(2));
}



$(document).on("click",".dec",function(){
    let selectedItem=$(this).closest(".product-quantity").find("input[type='hidden']").val();
    // alert(selectedItem);
    let input=$(this).siblings(".quaintity-input");
    let currentValue=parseInt(input.val()) || 0;
    if(currentValue>1){
        $.ajax({
            url:_BASE_URL,
            data:{
                function_name:"decrease",
                value:currentValue,
                selectedItem:selectedItem
            },
            method:"post",
            success:function(response){
                let data=JSON.parse(response);
                if(data.status==1){
                    // alert(data.message);
                    $(input).val(currentValue-1);
                    calculateTotalAmount();
                }
            },
            error:function(xhr,error){
                console.debug(xhr);
                console.debug(error);
                console.log("Error");
            }
        });
    }
});
$(document).on("click",".inc",function(){
    let selectedItem=$(this).closest(".product-quantity").find("input[type='hidden']").val();
    // alert(selectedItem);
    let input=$(this).siblings(".quaintity-input");
    let currentValue=parseInt(input.val()) || 0;
    if(currentValue<10){
        $.ajax({
            url:_BASE_URL,
            data:{
                function_name:"increase",
                value:currentValue,
                selectedItem:selectedItem
            },
            method:"post",
            success:function(response){
                let data=JSON.parse(response);
                if(data.status==1){
                    // alert(data.message);
                    $(input).val(currentValue+1);
                    calculateTotalAmount();
                }
            },
            error:function(xhr,error){
                console.debug(xhr);
                console.debug(error);
                console.log("Error");
            }
        });
    }
});

// Subtotal change
$(document).on("click", ".inc", function () {
    let row = $(this).closest("tr");
    let price = parseFloat(row.find(".product-price").text().replace("$", "")); // Extract price
    let quantity = parseInt(row.find(".quaintity-input").val()) || 1;
    if(quantity<10){
        let now=quantity+1;
        let subtotal = price * now;
        // Update the subtotal in the DOM
        row.find(".product-subtotal").text("$" + subtotal.toFixed(2));
        
    }

    

});
// Subtotal change
$(document).on("click", ".dec", function () {
    let row = $(this).closest("tr");
    let price = parseFloat(row.find(".product-price").text().replace("$", "")); // Extract price
    let quantity = parseInt(row.find(".quaintity-input").val()) || 1;
    if(quantity>1){
        let now=quantity-1;
        let subtotal = price * now;
        // Update the subtotal in the DOM
        row.find(".product-subtotal").text("$" + subtotal.toFixed(2));
        
    }
    

});


$(document).on("click",".remove-wishlist",function(){
    // event.preventDefault();
    let row = $(this).closest("tr");
    row.remove(); // Remove the row from the DOM
    calculateTotalAmount();
    let deletedItem=$(this).closest(".product-remove").find("input[type='hidden']").val();
    $.ajax({
        url:_BASE_URL,
        data:{
            function_name:"deleteItem",
            id:deletedItem
        },
        method:"post",
        success:function(response){
            let data=JSON.parse(response);
            if(data.status==1){
                // alert(data.message);
            }
        },
        error:function(xhr,error){
            console.debug(xhr);
            console.debug(error);
            console.log("Error");
        }
    });
});

// Clear full cart
$(document).on("click",".clear-cart",function(){
    $.ajax({
        url:_BASE_URL,
        data:{
            function_name:"clearCart",
            userId:getStoredId
        },
        method:"post",
        success:function(response){
            data=JSON.parse(response);
            if(data.status==1){
                // alert(data.message);
            }
        },
        error:function(xhr,error){
            console.debug(xhr);
            console.debug(error);
            console.log("Error");
        }
    });
});