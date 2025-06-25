$(document).ready(function () {
    let tableBody = $("#tableBody");

    function escapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    let count=1;
    // Function to populate the table
    function populateTable(users) {
        tableBody.empty();
        $.each(users, function (index, user) {
            let row = `
                <tr data-id="${user.id}">
                    <td><input type="hidden" value="${escapeHTML(user.id)}">${count}</td>
                    <td class="editable" data-field="categoryName">${escapeHTML(user.categoryName)}</td>
                    <td  data-field="createdOn">${escapeHTML(user.createdOn)}</td>
                    <td  data-field="updatedOn">${escapeHTML(user.updatedOn)}</td>
                    <td  data-field="createdBy">${escapeHTML(user.createdBy)}</td>
                    <td>
                        <button class="btn btn-primary edit-btn">Edit</button>
                        <button class="btn btn-danger del-btn" disabled>Delete</button>
                        <button class="btn btn-success save-btn" style="display:none;">Save</button>
                        <button class="btn btn-secondary cancel-btn" style="display:none;">Cancel</button>
                    </td>
                </tr>`;
                count++;
            tableBody.append(row);
        });
    }

    // Fetch and populate the table
    $.ajax({
        url: _BASE_URL,
        data: { function_name: "category_data" },
        method: "POST",
        beforeSend: function () {
            tableBody.html(`<tr><td colspan="6">Loading...</td></tr>`);
        },
        success: function (response) {
            try {
                let data = JSON.parse(response);
                if (data.status === 1) {
                    populateTable(data.data);
                } else {
                    tableBody.html(`<tr><td colspan="6">${escapeHTML(data.message)}</td></tr>`);
                }
            } catch (error) {
                console.error("Parsing Error:", error);
                tableBody.html(`<tr><td colspan="6">Invalid server response</td></tr>`);
            }
        },
        error: function (xhr, error) {
            console.debug(xhr, error);
            tableBody.html(`<tr><td colspan="6">An error occurred while fetching data</td></tr>`);
        },
    });

    // Edit button functionality
    tableBody.on("click", ".edit-btn", function () {
        let row = $(this).closest("tr");
        row.find(".editable").each(function () {
            let field = $(this).data("field");
            let value = $(this).text();
            $(this).html(`<input type="text" class="form-control" name="${field}" value="${value}">`);
        });
        row.find(".edit-btn,.del-btn").hide();
        row.find(".save-btn, .cancel-btn").show();
    });
       // Delete button
       tableBody.on("click",".del-btn",function(){
        let row=$(this).closest("tr");
        let delId=row.data("id");
        if(confirm("Are you really wants to delete")){
            $.ajax({
                url:_BASE_URL,
                data:{
                    function_name:"delete_category",
                    id:delId
                },
                method:"post",
                success:function(response){
                    // console.log(response);
                    let data=JSON.parse(response);
                    if(data.status===1){
                        location.reload();
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
    // Save button functionality
    tableBody.on("click", ".save-btn", function () {
        let row = $(this).closest("tr");
        let rowData = {};
        row.find("input").each(function () {
            let field = $(this).attr("name");
            let value = $(this).val();
            rowData[field] = value;
        });
        rowData.id = row.data("id"); // Add row ID to the data
        
        let data=rowData;
        // alert(data);
        
        // Call an AJAX request to save the data
        $.ajax({
            url: _BASE_URL,
            method: "POST",
            data: {
                function_name: "update_category",
                categoryName:data.categoryName,
                id:data.id 

            },
            success: function (response) {
                let data = JSON.parse(response);
                if (data.status === 1) {
                    // Update row with saved data
                    row.find(".editable").each(function () {
                        let field = $(this).data("field");
                        $(this).html(escapeHTML(rowData[field]));
                    });
                    row.find(".save-btn, .cancel-btn").hide();
                    row.find(".edit-btn").show();
                    location.reload();
                } else {
                    alert(data.message);
                }
            },
            error: function (xhr, error) {
                console.debug(xhr, error);
                alert("Failed to save data.");
            },
        });
    });

    // Cancel button functionality
    tableBody.on("click", ".cancel-btn", function () {
        let row = $(this).closest("tr");
        // Restore original values
        row.find("input").each(function () {
            let value = $(this).attr("value"); // Original value in the input field
            let field = $(this).closest(".editable").data("field");
            $(this).parent().html(escapeHTML(value));
        });
        row.find(".save-btn, .cancel-btn").hide();
        row.find(".edit-btn,.del-btn").show();
    });

    // category Toggle
    $(document).on("click",".addMoreCategory",function(){
        $(".CategoryInput").show();
        $("#cancelCategory").show();
        $(this).text("Save");
        $(this).addClass("saveCategory").removeClass("addMoreCategory");
        
    });
    $(document).on("click","#cancelCategory",function(){
        $(".CategoryInput").hide();
        $("#cancelCategory").hide();
        $(".saveCategory").addClass("addMoreCategory");
        $(".saveCategory").removeClass("saveCategory");
        $(".addMoreCategory").html(`<i class="fa-solid fa-plus"></i>`);
    });

    // Add Category
    $(document).on("click",".saveCategory",function(){
        let newCategory=$(".CategoryInput").val();
        // alert(newCategory);
        if(newCategory!=""){
            $.ajax({
                url:_BASE_URL,
                data:{
                    function_name:"add_new_Category",
                    value:newCategory,
                    createdBy:adminId
                },
                method:"post",
                success:function(response){
                    let data=JSON.parse(response);
                    if(data.status==1){
                        location.reload();
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
            alert("Please enter value");
        }
    });
});
