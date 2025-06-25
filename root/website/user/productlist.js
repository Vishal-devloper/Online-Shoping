
const url=window.location.href;
const urlParams= new URLSearchParams(window.location.search);
const id=urlParams.get('categoryId');
// ajax for all products listing


$(document).ready(function(){
    
    
    $.ajax({
        url: _BASE_URL,
        data: {
            function_name: "productAll",
            categoryId:id
        },
        method: "post",
        success: function (response) {
            // console.log(response);
            let data = JSON.parse(response);
            // console.log(data);
            let list = $("#row");
            
            list.empty();
            if (data.status == 1) {
                // alert(data.message);
                let final_data = data.data;
                $.each(final_data, function (index, user) {
                    let modelId=`model_${user.id}`;
                    let row = `
                        
                        <div class="col-xl-3 col-lg-4 col-sm-6 col-12" id="go">
                        
                            <div class="product-list" >
                                <div class="product-image product-list-item">
                                    <input type="hidden" value="${user.id}">
                                    
                                        <img src="../uploadedImages/${user.productImage}" alt="" class="img-fluid">
                                    
                                    <div class="sale">
                                        <span>SALE</span>
                                    </div>
                                    <div class="product-over">
                                        <ul>
                                            <li><a href="" aria-label="Add to Wishlist"><i class="fa-regular fa-heart"></i></a></li>
                                            <li class="cart "><h6 class="addToCart">Add to Cart</h6></li>
                                            <li><a href="" data-toggle="modal" data-target="#${modelId}" aria-label="View Details"><i class="fa-regular fa-eye"></i></a></li>
    
                                        </ul>
    
                                    </div>
                                    
                                        <!-- The Modal -->
                                        <div class="modal fade " id="${modelId}">
                                            <div class="modal-dialog modal-xl">
                                                <div class="modal-content">
                                                
                                                    <!-- Modal Header -->
                                                    <div class="modal-header">
                                                    
                                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                    </div>
                                                    
                                                    <!-- Modal body -->
                                                    <div class="modal-body">
                                                        <div class="product-page-modal">
                                                            <div class="container">
                                                                <div class="space-modal">
                                                                    <div class="row">
                                                                        <div class="col-lg-6 product-img-modal product-list-item" >
                                                                            <input type="hidden" value="${user.id}">
                                                                            <img src="../uploadedImages/${user.productImage}" alt="" class="img-fluid">
                                                                        </div>
                                                                        <div class="col-lg-6">
                                                                            <div class="single-product-modal">
                                                                                <div class="inner-modal">
                                                                                    <h2 class="product-title-modal" >${user.productName}</h2>
                                                                                    <span class="cut-price-product-modal" >${"$ "+user.productPrice}</span>
                                                                                    <span class="product-price-modal" >${"$ "+user.discountedPrice}</span>
                                                                                    <ul>
                                                                                        <li>${user.productDiscription}</li>
                                                                                    </ul>
                                                                                    <div class="quaintity-modal">
                                                                                        <h6></h6>
                                                                                        <span class="decrease">-</span>
                                                                                        <input type="number" value="1" inputmode="numeric" min="1" max="10" class="quaintity-input">
                                                                                        <span class="increase">+</span>
                                                                                        <div class="product-action-modal">
                                                                                        <ul>
                                                                                            <li class="add-to-cart-modal"><a href="" class="go buyNow"><i class="fa-solid fa-bag-shopping"></i> Buy Now</a></li>
                                                                                            <li class="add-to-cart-modal"><a href=""  class="add addToCart"><i class="fa-solid fa-cart-plus"></i> Add to Cart</a></li>
                                                                                        </ul>
                                                                                    </div>
                                                                                    </div>
                                                                                    
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
    
                                                    
                                                    <!-- Modal footer -->
                                                    <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    
                                </div>
                            
                                <div class="product-content">
                                    <div class="inner">
                                    <a href="product.html?id=${encodeURIComponent(user.id)}">    
                                    <h5 class="title-2">${user.productName}</h5></a>
                                        <div class="product-price">
                                            <span class="cut-price">${"$" + user.productPrice}</span>
                                            <span class="set-price">${"$" + user.discountedPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                            
                        </div>
                    `;
                    list.append(row);
                     
                                                    
                });
    
            }
            else {
                console.log("Product not found:", response.message);
            }
    
        },
        error: function (xhr, error) {
            console.debug(xhr);
            console.debug(error);
            console.log("Error in single product");
        }
    });
    
    
});
// Event Delegation for Quantity Buttons
$(document).on("click", ".increase", function () {
    let input = $(this).siblings(".quaintity-input");
    let currentValue = parseInt(input.val()) || 0;
    if(currentValue<10){
        input.val(currentValue +1);
    }
   
});

$(document).on("click", ".decrease", function () {
    let input = $(this).siblings(".quaintity-input");
    let currentValue = parseInt(input.val()) || 0;
    if (currentValue > 1) {
        input.val(currentValue - 1);
    }
});

// Event Delegation for "Add to Cart" button
$(document).on("click", ".addToCart", function () {
    event.preventDefault();
    // Get the product ID from the sibling input field
    let productId = $(this).closest(".product-list-item").find("input[type='hidden']").val();
    let productQuantity =$(this).closest(".product-list").find(".quaintity-input").val();
    if(productQuantity < 1 || productQuantity == ""){
        productQuantity=1;
    };

    if($(this).text()!="Go To Cart"){
        $(this).closest(".addToCart").text("Go To Cart");
    
    $(this).closest(".add").text('Go To Cart');
    


    let getStoredId=localStorage.getItem("userId");
    $.ajax({
        url:_BASE_URL,
        data:{
            function_name:"addToCart",
            productId:productId,
            userId:getStoredId,
            productQuantity:productQuantity
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
    }
    
    $(this).off("click").on("click",function(){
        window.location.href="cart.html";
    });
});

$(document).on("click",".buyNow",function(){
    event.preventDefault();
    // Get the product ID from the sibling input field
    let productId = $(this).closest(".product-list-item").find("input[type='hidden']").val();
    let productQuantity =$(this).closest(".product-list").find(".quaintity-input").val();
    if(productQuantity < 1 || productQuantity == ""){
        productQuantity=1;
    };

    

    let getStoredId=localStorage.getItem("userId");
    $.ajax({
        url:_BASE_URL,
        data:{
            function_name:"addToCart",
            productId:productId,
            userId:getStoredId,
            productQuantity:productQuantity
        },
        method:"post",
        success:function(response){
            let data=JSON.parse(response);
            if(data.status==1){
                // alert(data.message);
                window.location.href="cart.html";
            }
        },
        error:function(xhr,error){
            console.debug(xhr);
            console.debug(error);
            console.log("Error");
        }

    });
    
    
    
        
});