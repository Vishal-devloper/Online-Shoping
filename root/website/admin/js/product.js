$(document).ready(function () {
    let tableBody = $("#tableBody");

    function escapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Function to populate the table
    function populateTable(users) {
        tableBody.empty();
        let count = 1;
        $.each(users, function (index, user) {
            let row = `
                <tr data-id="${user.id}">
                    <td><input type="hidden" value="${escapeHTML(user.id)}">${count}</td>
                    <td  data-field="productName">${escapeHTML(user.productName)}</td>
                    <td  data-field="discountedPrice">${escapeHTML(user.discountedPrice)}</td>
                    <td  data-field="brandId" >${escapeHTML(user.brandId)}</td>
                    <td  data-field="categoryId">${escapeHTML(user.categoryId)}</td>
                    <td  data-field="createdOn">${escapeHTML(user.createdOn)}</td>
                    <td  data-field="updatedOn">${escapeHTML(user.updatedOn)}</td>
                    <td  data-field="createdBy">${escapeHTML(user.createdBy)}</td>
                    <td>
                        <button class="btn btn-primary edit-btn">Edit</button>
                        <button class="btn btn-danger del-btn">Delete</button>
                        <button class="btn btn-success save-btn" style="display:none;">Save</button>
                        <button class="btn btn-secondary cancel-btn" style="display:none;">Cancel</button>
                    </td>
                </tr>`;
            count++;
            tableBody.append(row);
        });
    }

    // Fetch and populate the table
    let currentPage = 1;
    let globalData={};
    function fetchProducts(page = 1) {
        $.ajax({
            url: _BASE_URL,
            method: "POST",
            data: {
                function_name: "product_data",
                page: page
            },
            success: function (response) {
                let data = JSON.parse(response);
                if (data.status === 1) {
                    populateTable(data.data);
                    globalData=data.data;
                    console.log(globalData);
                    setupPagination(data.totalPages, data.currentPage);
                } else {
                    tableBody.html(`<tr><td colspan="6">${escapeHTML(data.message)}</td></tr>`);
                }
            },
            error: function () {
                tableBody.html(`<tr><td colspan="6">Error fetching data</td></tr>`);
            }
        });
    }
    
    // Function to create pagination buttons
    function setupPagination(totalPages, currentPage) {
        let pagination = $("#pagination");
        pagination.empty();
        for (let i = 1; i <= totalPages; i++) {
            let activeClass = currentPage === i ? "active" : "";
            pagination.append(`
            <li class="page-item ${activeClass}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
        }

        // Page click handler
        $(".page-link").on("click", function (e) {
            e.preventDefault();
            let page = $(this).data("page");
            fetchProducts(page);
        });
    }

    // Initial fetch
    fetchProducts();
    
    let globalBrand = [];
    let globalCategory = [];
    // brand and category dropdown
    $.ajax({
        url: _BASE_URL,
        data: {
            function_name: "dropdown"
        },
        method: "post",
        success: function (response) {
            let data = JSON.parse(response);
            if (data.status == 1) {
                globalBrand = data.brand; // Save brand data globally
                globalCategory = data.category; // Save brand data globally
                // console.log("Brands loaded", globalBrands1);
            }
        },
        error: function (xhr, error) {
            console.debug(xhr);
            console.debug(error);
            console.log("Error");
        }
    });
    
    let selectedProduct="";
    // Edit button functionality
    tableBody.on("click", ".edit-btn", function () {

        let row = $(this).closest("tr");
        selectedProduct=row.data("id");
        $(".editMore").show();
        $(".table-responsive").hide();
        $(".addMoreProduct").hide();
        let editId=$("#editId");
        let editProductName=$("#editProductName");
        let editCategoryDropdown=$("#editCategoryDropdown");
        let editBrandDropdown=$("#editBrandDropdown");
        let editProductPrice=$("#editProductPrice");
        let imgPreview=$("#img-preview"); 
        let editDiscountedPrice=$("#editDiscountedPrice");
        let editProductDiscription=$("#editProductDiscription");
        let filteredData=globalData.filter(item=>item.id==selectedProduct );
        editId.val(filteredData[0].id);
        editProductName.val(filteredData[0].productName);
        editProductPrice.val(filteredData[0].productPrice);
        editDiscountedPrice.val(filteredData[0].discountedPrice);
        editProductDiscription.val(filteredData[0].productDiscription);
        imgPreview.html(`<h5 class="p-2 text-center text-muted">Current Image</h5><img src="../uploadedImages/${filteredData[0].productImage}" class="img-fluid" style="width:300px;" alt="">`)
        let brandSelected=filteredData[0].brandId;
        let categorySelected=filteredData[0].categoryId;
        // brand select
        let brand_opt = editBrandDropdown;
        brand_opt.empty(); // Clear existing options
        let options = globalBrand.map(function (brand) {
            let safeBrandName = escapeHTML(brand.brandName);
            let isSelected = (brandSelected === safeBrandName) ? 'selected' : '';
            return `<option value='${brand.id}' ${isSelected}>${safeBrandName}</option>`;
        });
        brand_opt.append(options.join('')); // Append all options at once

        // category select
        let category_opt = editCategoryDropdown;
        category_opt.empty(); // Clear existing options
        let options1 = globalCategory.map(function (category) {
            let safeCategoryName = escapeHTML(category.categoryName);
            let isSelected = (categorySelected === safeCategoryName) ? 'selected' : '';
            return `<option value='${category.id}' ${isSelected}>${safeCategoryName}</option>`;
        });
        category_opt.append(options1.join('')); // Append all options at once
        console.log(filteredData[0]);
        
    });
    
    
        
        

 
    
    // Delete button
    tableBody.on("click", ".del-btn", function () {
        let row = $(this).closest("tr");
        let delId = row.data("id");
        if (confirm("Are you really wants to delete")) {
            $.ajax({
                url: _BASE_URL,
                data: {
                    function_name: "delete_product",
                    id: delId
                },
                method: "post",
                success: function (response) {
                    // console.log(response);
                    let data = JSON.parse(response);
                    if (data.status === 1) {
                        location.reload();
                    }
                },
                error: function (xhr, error) {
                    console.debug(xhr);
                    console.debug(error);
                    console.log("Error");
                }
            });
        }

    });
    // Save button functionality
    $(document).on("click", ".editProductSave", function () {
        // Collect form data
        let id=$("#editId").val();
        let productName=$("#editProductName").val();
        let categoryDropdown=$("#editCategoryDropdown").val();
        let brandDropdown=$("#editBrandDropdown").val();
        let productPrice=$("#editProductPrice").val();
        let discountedPrice=$("#editDiscountedPrice").val();
        let productDiscription=$("#editProductDiscription").val();
        let productImage = $("#editProductImage")[0].files[0]; // Get file input

        // Check if file is selected
        


        // Create FormData object
        let formData = new FormData();
        formData.append("function_name", "update_product");
        formData.append("id", id);
        formData.append("productName", productName);
        formData.append("categoryDropdown", categoryDropdown);
        formData.append("brandDropdown", brandDropdown);
        formData.append("productPrice", productPrice);
        formData.append("discountedPrice", discountedPrice);
        formData.append("productDiscription", productDiscription);
        if (productImage) {
            formData.append("productImage", productImage);
        } 
       
        

        // AJAX request for file upload
        $.ajax({
            url: _BASE_URL,
            type: "POST",
            data: formData,
            processData: false, // Prevent jQuery from processing data
            contentType: false, // Prevent jQuery from setting content type
            success: function (response) {
                let data = JSON.parse(response);
                if (data.status == 1) {
                    alert(data.message);
                    location.reload();
                    $(".table-responsive").show();
                    $(".editMore").hide();
                    
                } else {
                    alert("Error: " + data.message);
                }
            },
            error: function (xhr, error) {
                console.debug(xhr);
                console.debug(error);
                console.log("Error");
            }
        });
    });
    // Cancel button
    $(document).on("click", ".editProductCancel", function () {
        $(".editMore").hide();
        $(".table-responsive").show();
    });

    // Utility function to escape HTML for security
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function (match) {
            const escape = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
            return escape[match];
        });
    }

    // Add button
    $(document).on("click", ".addMoreProduct", function () {
        $(".addMore").show();
        $(".addMoreProduct").hide();
        $(".table-responsive").hide();
        $.ajax({
            url: _BASE_URL,
            data: {
                function_name: "dropdown_select"
            },
            method: "post",
            success: function (response) {
                let data = JSON.parse(response);
                if (data.status == 1) {
                    console.log(data);
                    let brandDropdown = $("#brandDropdown");
                    brandDropdown.empty();
                    let categoryDropdown = $("#categoryDropdown");
                    categoryDropdown.empty();
                    let brand_data = data.brand_data;
                    let category_data = data.category_data;
                    $.each(brand_data, function (index, brand) {
                        let row = `<option value="${brand.id}">${brand.brandName}</option>`;
                        brandDropdown.append(row);
                    });
                    $.each(category_data, function (index, category) {
                        let category_row = `<option value="${category.id}">${category.categoryName}</option>`;
                        categoryDropdown.append(category_row);
                    })
                }
            },
            error: function (xhr, error) {
                console.debug(xhr);
                console.debug(error);
                console.log("Error");
            }
        });
    });
    $(".productCancel").on("click", function () {
        $(".table-responsive").show();
        $(".addMore").hide();
        $(".addMoreProduct").show();
    });

    $(document).on("click", ".productSave", function () {
        // Collect form data
        let productName = $("#productName").val();
        let categoryDropdown = $("#categoryDropdown").val();
        let brandDropdown = $("#brandDropdown").val();
        let productPrice = $("#productPrice").val();
        let discountedPrice = $("#discountedPrice").val();
        let productDiscription = $("#productDiscription").val();
        let productImage = $("#productImage")[0].files[0]; // Get file input

        // Check if file is selected
        if (!productImage) {
            alert("Please select a product image.");
            return;
        }

        // Create FormData object
        let formData = new FormData();
        formData.append("function_name", "addNewProduct");
        formData.append("productName", productName);
        formData.append("categoryDropdown", categoryDropdown);
        formData.append("brandDropdown", brandDropdown);
        formData.append("productPrice", productPrice);
        formData.append("discountedPrice", discountedPrice);
        formData.append("productDiscription", productDiscription);
        formData.append("productImage", productImage); // File input
        formData.append("createdBy", adminId);

        // AJAX request for file upload
        if(!productName && !productPrice && !discountedPrice && !productDiscription){
            alert("All fields are required");
            return false;
        }
        else{
            $.ajax({
                url: _BASE_URL,
                type: "POST",
                data: formData,
                processData: false, // Prevent jQuery from processing data
                contentType: false, // Prevent jQuery from setting content type
                success: function (response) {
                    let data = JSON.parse(response);
                    if (data.status == 1) {
                        alert(data.message);
                        $(".table-responsive").show();
                        $(".addMore").hide();
                        $(".addMoreProduct").show();
                    } else {
                        alert("Error: " + data.message);
                    }
                },
                error: function (xhr, error) {
                    console.debug(xhr);
                    console.debug(error);
                    console.log("Error");
                }
            });
        }
        
    });

});
