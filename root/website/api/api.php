<?php
header("Access-Control-Allow-Origin: *");
include("connection.php");
$function_name = $_REQUEST['function_name'];
date_default_timezone_set('Asia/Kolkata');
$dateTime = new dateTime();
$current = $dateTime->format('Y-m-d H:i:s');

switch ($function_name) {
    case 'productSingle':
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
            $final_data = array();
            $sql = "select * from ourproducts where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $final_data["id"] = $row["id"];
                $final_data["productName"] = $row["productName"];
                $final_data["productPrice"] = $row["productPrice"];
                $final_data["discountedPrice"] = $row["discountedPrice"];
                $final_data["productDiscription"] = $row["productDiscription"];
                $final_data["productImage"] = $row["productImage"];
                echo json_encode(array("status" => 1, "message" => "Detail fatched successfully ", "data" => $final_data));
            }
        }
        break;

    case 'productAll':
        if (isset($_POST["categoryId"])) {
            $id = $_POST["categoryId"];
            if ($id == 0) {

                $final_data = array();
                $sql = "SELECT * FROM ourproducts";
                $result = mysqli_query($conn, $sql);

                if (mysqli_num_rows($result) > 0) {
                    $ctn = 0;
                    while ($row = mysqli_fetch_assoc($result)) {
                        $final_data[$ctn]["id"] = $row["id"];
                        $final_data[$ctn]["productName"] = $row["productName"];
                        $final_data[$ctn]["productPrice"] = $row["productPrice"];
                        $final_data[$ctn]["discountedPrice"] = $row["discountedPrice"];
                        $final_data[$ctn]["productDiscription"] = $row["productDiscription"];
                        $final_data[$ctn]["productImage"] = $row["productImage"];
                        $ctn++;
                    }

                    echo json_encode(array("status" => 1, "message" => "Details fetched successfully", "data" => $final_data));
                } else {
                    echo json_encode(array("status" => 0, "message" => "No data found"));

                }
            } else {

                $final_data = array();
                $sql = "SELECT * FROM ourproducts WHERE categoryId='" . $id . "'";
                $result = mysqli_query($conn, $sql);

                if (mysqli_num_rows($result) > 0) {
                    $ctn = 0;
                    while ($row = mysqli_fetch_assoc($result)) {
                        $final_data[$ctn]["id"] = $row["id"];
                        $final_data[$ctn]["productName"] = $row["productName"];
                        $final_data[$ctn]["productPrice"] = $row["productPrice"];
                        $final_data[$ctn]["discountedPrice"] = $row["discountedPrice"];
                        $final_data[$ctn]["productDiscription"] = $row["productDiscription"];
                        $final_data[$ctn]["productImage"] = $row["productImage"];
                        $ctn++;
                    }

                    echo json_encode(array("status" => 1, "message" => "Details fetched successfully", "data" => $final_data));
                } else {
                    echo json_encode(array("status" => 0, "message" => "No data found"));
                }
            }
        }

        break;

    case 'userRegister':
        if (isset($_POST["userName"]) && isset($_POST["userEmail"]) && isset($_POST["userPassword"])) {
            $userName = $_POST["userName"];
            $userEmail = $_POST["userEmail"];
            $userPassword = $_POST["userPassword"];
            $hashed_password = password_hash($userPassword, PASSWORD_DEFAULT);

            $sql = "insert into users(userName,Email,Password) values('" . $userName . "','" . $userEmail . "','" . $hashed_password . "')";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "User Registered Successfully"));

        }
        break;
    case 'userLogin':
        if (isset($_POST["loginEmail"]) && isset($_POST["loginPassword"])) {
            $loginEmail = $_POST["loginEmail"];
            $loginPassword = $_POST["loginPassword"];
            // $hashed_password=password_hash($loginPassword,PASSWORD_DEFAULT);

            $sql = "select * from users where Email='" . $loginEmail . "'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                if (password_verify($loginPassword, $row["Password"])) {
                    $final_data["id"] = $row["id"];
                    $final_data["userName"] = $row["userName"];
                    $final_data["Email"] = $row["Email"];
                    // $final_data["Password"]=$row["Password"];
                    echo json_encode(array("status" => 1, "message" => "User Login Successful", "data" => $final_data));
                } else {
                    echo json_encode(array("status" => 0, "message" => "Entered Password is Incorrect"));
                }
            } else {
                echo json_encode(array("status" => 0, "message" => "Email Not Registered Please SignUp first"));
            }
        }
        break;
    case 'addToCart':
        if (isset($_POST["productId"]) && isset($_POST["userId"]) && isset($_POST["productQuantity"])) {
            $userId = $_POST["userId"];
            $productId = $_POST["productId"];
            $productQuantity = $_POST["productQuantity"];
            $query = "select * from cart where productId='" . $productId . "' AND userId='" . $userId . "'";
            $query_result = mysqli_query($conn, $query);
            if (mysqli_num_rows($query_result) > 0) {
                $query_row = mysqli_fetch_assoc($query_result);
                $newQuantity = $productQuantity + $query_row["productQuantity"];
                $sql = "update cart set productQuantity='" . $newQuantity . "' where id='" . $query_row["id"] . "'";
                $result = mysqli_query($conn, $sql);
                echo json_encode(array("status" => 1, "message" => "Item Added to cart"));
            } else {
                $sql = "insert into cart (productId,productQuantity,userId) values('" . $productId . "','" . $productQuantity . "','" . $userId . "')";
                $result = mysqli_query($conn, $sql);
                echo json_encode(array("status" => 1, "message" => "Item Added to cart"));
            }

        }
        break;
    case 'getCartData':
        if (isset($_POST["userId"])) {
            $userId = $_POST["userId"];
            $final_data = array();
            $sql = "select cart.id,cart.productId,cart.productQuantity,ourproducts.productName,ourproducts.discountedPrice,ourproducts.productImage from cart join ourproducts on cart.productId=ourproducts.id where userId='" . $userId . "'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $ctn = 0;
                while ($row = mysqli_fetch_assoc($result)) {

                    $final_data[$ctn]["id"] = $row["id"];
                    $final_data[$ctn]["productQuantity"] = $row["productQuantity"];
                    $final_data[$ctn]["productName"] = $row["productName"];
                    $final_data[$ctn]["discountedPrice"] = $row["discountedPrice"];
                    $final_data[$ctn]["productImage"] = $row["productImage"];
                    $ctn++;
                }

                echo json_encode(array("status" => 1, "message" => "User cart Successful", "data" => $final_data));
            }
        }
        break;
    case 'deleteItem':
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
            $sql = "delete from cart where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "Item removed from cart"));
        }
        break;
    case 'decrease':
        if (isset($_POST["selectedItem"]) && isset($_POST["value"])) {
            $id = $_POST["selectedItem"];
            $value = $_POST["value"];
            $newValue = $value - 1;
            $sql = "update cart set productQuantity='" . $newValue . "' where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "Item Quantity changed from cart"));
        }
        break;
    case 'increase':
        if (isset($_POST["selectedItem"]) && isset($_POST["value"])) {
            $id = $_POST["selectedItem"];
            $value = $_POST["value"];
            $newValue = $value + 1;
            $sql = "update cart set productQuantity='" . $newValue . "' where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "Item Quantity changed from cart"));
        }
        break;
    case 'clearCart':
        if (isset($_POST["userId"])) {
            $id = $_POST["userId"];
            $sql = "delete from cart where userId='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "all Item removed from cart"));
        }
        break;


    // admin

    case 'adminSignup':
        if (isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["phone"]) && isset($_POST["password"])) {
            $name = $_POST["name"];
            $email = $_POST["email"];
            $phone = $_POST["phone"];
            $password = $_POST["password"];
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $query = "select * from admin where email='" . $email . "'";
            $query_result = mysqli_query($conn, $query);
            if (mysqli_num_rows($query_result) > 0) {
                echo json_encode(array("status" => 0, "message" => "Email already Exists Please Login"));
            } else {
                $sql = "insert into admin (name,email,phone,password) values('" . $name . "','" . $email . "','" . $phone . "','" . $hashed_password . "')";
                $result = mysqli_query($conn, $sql);
                echo json_encode(array("status" => 1, "message" => "User registered Successfully"));
            }
        }
        break;

    case 'adminLogin':
        if (isset($_POST["loginEmail"]) && isset($_POST["loginPassword"])) {
            $email = $_POST["loginEmail"];
            $password = $_POST["loginPassword"];
            $final_data = array();

            $sql = "select * from admin where email='" . $email . "'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                if (password_verify($password, $row["password"])) {
                    $final_data["id"] = $row["id"];
                    $final_data["name"] = $row["name"];
                    $final_data["email"] = $row["email"];
                    $final_data["phone"] = $row["phone"];
                    echo json_encode(array("status" => 1, "message" => "User login Successfully", "data" => $final_data));
                } else {
                    echo json_encode(array("status" => 0, "message" => "Wrong Password"));
                }
            } else {
                echo json_encode(array("status" => 0, "message" => "Email Not registered Please Signup"));
            }
        }
        break;

    //Brand data
    case 'brand_data':
        $sql = "select brand.id,brand.brandName,brand.createdOn,brand.updatedOn,admin.name from brand join admin on brand.createdBy=admin.id";
        $result = mysqli_query($conn, $sql);
        $final_data = array();
        if (mysqli_num_rows($result) > 0) {
            $ctn = 0;
            while ($row = mysqli_fetch_assoc($result)) {
                $final_data[$ctn]["id"] = $row["id"];
                $final_data[$ctn]["brandName"] = $row["brandName"];
                $final_data[$ctn]["createdOn"] = $row["createdOn"];
                $final_data[$ctn]["updatedOn"] = $row["updatedOn"];
                $final_data[$ctn]["createdBy"] = $row["name"];
                $ctn++;
            }
            echo json_encode(array("status" => 1, "message" => "Data fetched successfully", "data" => $final_data));
        } else
            echo json_encode(array("status" => 0, "message" => "No Data Found"));
        break;

    // Brand update
    case 'update_brand':
        if (isset($_POST["brandName"]) && isset($_POST["id"])) {
            $id = $_POST["id"];
            $brandName = $_POST["brandName"];
            $sql = "select * from brand where brandName='" . $brandName . "'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                echo json_encode(array("status" => 0, "message" => "Data already Exists"));
            } else {
                $query = "update brand set brandName='" . $brandName . "',updatedOn='" . $current . "'  where id='" . $id . "'";
                $query_result = mysqli_query($conn, $query);
                echo json_encode(array("status" => 1, "message" => "Data Updated Successfully"));
            }
        }
        break;

    // Brand Delete
    case 'delete_brand':
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
            $sql = "delete from brand where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "Item Deleted successfully"));
        }
        break;

    // add Brand
    case 'add_new_brand':
        if (isset($_POST["value"]) && isset($_POST["createdBy"])) {
            $value = $_POST["value"];
            $createdBy = $_POST["createdBy"];
            $query = "select * from brand where brandName='" . $value . "'";
            $query_result = mysqli_query($conn, $query);
            if (mysqli_num_rows($query_result) > 0) {
                echo json_encode(array("status" => 0, "message" => "Data Already Exists"));
            } else {
                $sql = "insert into brand(brandName,createdOn,updatedOn,createdBy) values('" . $value . "','" . $current . "','" . $current . "','" . $createdBy . "')";
                $result = mysqli_query($conn, $sql);
                echo json_encode(array("status" => 1, "message" => "Added Successfully", "data" => $result));
            }
        }
        break;
    //Category data
    case 'category_data':
        $sql = "select category.id,category.categoryName,category.createdOn,category.updatedOn,admin.name from category join admin on category.createdBy=admin.id";
        $result = mysqli_query($conn, $sql);
        $final_data = array();
        if (mysqli_num_rows($result) > 0) {
            $ctn = 0;
            while ($row = mysqli_fetch_assoc($result)) {
                $final_data[$ctn]["id"] = $row["id"];
                $final_data[$ctn]["categoryName"] = $row["categoryName"];
                $final_data[$ctn]["createdOn"] = $row["createdOn"];
                $final_data[$ctn]["updatedOn"] = $row["updatedOn"];
                $final_data[$ctn]["createdBy"] = $row["name"];
                $ctn++;
            }
            echo json_encode(array("status" => 1, "message" => "Data fetched successfully", "data" => $final_data));
        } else
            echo json_encode(array("status" => 0, "message" => "No Data Found"));
        break;

    // Category update
    case 'update_category':
        if (isset($_POST["categoryName"]) && isset($_POST["id"])) {
            $id = $_POST["id"];
            $categoryName = $_POST["categoryName"];
            $sql = "select * from category where categoryName='" . $categoryName . "'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                echo json_encode(array("status" => 0, "message" => "Data already Exists"));
            } else {
                $query = "update category set categoryName='" . $categoryName . "',updatedOn='" . $current . "'  where id='" . $id . "'";
                $query_result = mysqli_query($conn, $query);
                echo json_encode(array("status" => 1, "message" => "Data Updated Successfully"));
            }
        }
        break;
    // Category Delete
    case 'delete_category':
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
            $sql = "delete from category where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "Item Deleted successfully"));
        }
        break;

    // add Brand
    case 'add_new_Category':
        if (isset($_POST["value"]) && isset($_POST["createdBy"])) {
            $value = $_POST["value"];
            $createdBy = $_POST["createdBy"];
            $query = "select * from category where categoryName='" . $value . "'";
            $query_result = mysqli_query($conn, $query);
            if (mysqli_num_rows($query_result) > 0) {
                echo json_encode(array("status" => 0, "message" => "Data Already Exists", "data" => $query_result));
            } else {
                $sql = "insert into category(categoryName,createdOn,updatedOn,createdBy) values('" . $value . "','" . $current . "','" . $current . "','" . $createdBy . "')";
                $result = mysqli_query($conn, $sql);
                echo json_encode(array("status" => 1, "message" => "Added Successfully", "data" => $result));
            }
        }
        break;
    //product data
    case 'product_data':
        // Number of products per page
        $resultsPerPage = 10;

        // Get the current page number from the request; default is 1
        $page = isset($_POST['page']) && is_numeric($_POST['page']) ? intval($_POST['page']) : 1;
        $offset = ($page - 1) * $resultsPerPage; // Calculate the offset for SQL query

        // Modified SQL query with LIMIT and OFFSET
        $sql = "SELECT ourproducts.id, ourproducts.productName, ourproducts.productPrice, ourproducts.productDiscription, 
                    ourproducts.productImage, ourproducts.discountedPrice, category.categoryName, brand.brandName, 
                    ourproducts.createdOn, ourproducts.updatedOn, admin.name 
                FROM ourproducts 
                JOIN category ON ourproducts.categoryId = category.id 
                JOIN brand ON ourproducts.brandId = brand.id 
                JOIN admin ON ourproducts.createdBy = admin.id 
                ORDER BY ourproducts.id ASC 
                LIMIT $resultsPerPage OFFSET $offset";

        $result = mysqli_query($conn, $sql);
        if (!$result) {
            echo json_encode(array("status" => 0, "message" => "Result Not Exists"));
            exit;
        }

        $final_data = array();
        if (mysqli_num_rows($result) > 0) {
            $ctn = 0;
            while ($row = mysqli_fetch_assoc($result)) {
                $final_data[$ctn]["id"] = $row["id"];
                $final_data[$ctn]["productName"] = $row["productName"];
                $final_data[$ctn]["productPrice"] = $row["productPrice"];
                $final_data[$ctn]["productDiscription"] = $row["productDiscription"];
                $final_data[$ctn]["productImage"] = $row["productImage"];
                $final_data[$ctn]["discountedPrice"] = $row["discountedPrice"];
                $final_data[$ctn]["categoryId"] = $row["categoryName"];
                $final_data[$ctn]["brandId"] = $row["brandName"];
                $final_data[$ctn]["createdOn"] = $row["createdOn"];
                $final_data[$ctn]["updatedOn"] = $row["updatedOn"];
                $final_data[$ctn]["createdBy"] = $row["name"];
                $ctn++;
            }

            // Query to get total products count
            $count_query = "SELECT COUNT(*) AS total FROM ourproducts";
            $count_result = mysqli_query($conn, $count_query);
            $totalProducts = 0;
            if ($count_result) {
                $row = mysqli_fetch_assoc($count_result);
                $totalProducts = $row['total'];
            }

            // Total pages calculation
            $totalPages = ceil($totalProducts / $resultsPerPage);

            echo json_encode(array(
                "status" => 1,
                "message" => "Data fetched successfully",
                "data" => $final_data,
                "totalPages" => $totalPages,
                "currentPage" => $page
            ));
        } else {
            echo json_encode(array("status" => 0, "message" => "No Data Found"));
        }
        break;


    // product update
    case 'update_product':
        if (
            isset(
            $_POST["id"],
            $_POST["productName"],
            $_POST["categoryDropdown"],
            $_POST["brandDropdown"],
            $_POST["productPrice"],
            $_POST["discountedPrice"],
            $_POST["productDiscription"],
            
        ) && isset($_FILES['productImage'])
        ) {

            // Collect form data
            $productId = trim($_POST["id"]);
            $productName = trim($_POST["productName"]);
            $categoryId = trim($_POST["categoryDropdown"]);
            $brandId = trim($_POST["brandDropdown"]);
            $productPrice = trim($_POST["productPrice"]);
            $discountedPrice = trim($_POST["discountedPrice"]);
            $productDiscription = trim($_POST["productDiscription"]);
            

            // File upload variables
            $fileName = $_FILES['productImage']['name'];
            $tempName = $_FILES['productImage']['tmp_name'];
            $fileSize = $_FILES['productImage']['size'];
            $fileError = $_FILES['productImage']['error'];
            $uploadDir = '../uploadedImages/';
            $uploadFile = $uploadDir . basename($fileName);
            
            // check for data already exist
            $exist = "select * from ourproducts where id='" . $productId . "'";
            $result_exist = mysqli_query($conn, $exist);
            if (mysqli_num_rows($result_exist) > 0) {
                $row = mysqli_fetch_assoc($result_exist);
                if ($productName == $row["productName"] && $categoryId == $row["categoryId"] && $brandId == $row["brandId"] && $productPrice == $row["productPrice"] && $discountedPrice == $row["discountedPrice"] && $fileName == $row["productImage"]) {
                    echo json_encode(array("status" => 0, "message" => "Data already exits"));
                }
                else{
                    
                // Validate file
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                if ($fileError !== UPLOAD_ERR_OK) {
                    echo json_encode(array("status" => 0, "message" => "File upload error."));
                    break;
                }

                if (!in_array($fileExt, $allowedExtensions)) {
                    echo json_encode(array("status" => 0, "message" => "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."));
                    break;
                }

                if ($fileSize > 5 * 1024 * 1024) { // 5MB limit
                    echo json_encode(array("status" => 0, "message" => "File size exceeds 5MB."));
                    break;
                }

                // Insert data into database
                $sql = "UPDATE ourproducts SET productName = ?, productPrice = ?, productDiscription = ?, productImage = ?, discountedPrice = ?, categoryId = ?, brandId = ?, updatedOn = ? WHERE id ='".$productId."' ";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssssssss", $productName, $productPrice, $productDiscription, $fileName, $discountedPrice, $categoryId, $brandId, $current);

                if ($stmt->execute()) {
                    // Move uploaded file
                    if (move_uploaded_file($tempName, $uploadFile)) {
                        echo json_encode(array("status" => 1, "message" => "Data updated Successfully."));
                    } else {
                        echo json_encode(array("status" => 0, "message" => "Data saved, but file upload failed."));
                    }
                } else {
                    // Collect form data
                    $productId = trim($_POST["id"]);
                    $productName = trim($_POST["productName"]);
                    $categoryId = trim($_POST["categoryDropdown"]);
                    $brandId = trim($_POST["brandDropdown"]);
                    $productPrice = trim($_POST["productPrice"]);
                    $discountedPrice = trim($_POST["discountedPrice"]);
                    $productDiscription = trim($_POST["productDiscription"]);
                    echo json_encode(array("status" => 0, "message" => "Data upload failed."));
                }

                $stmt->close();
                }
            } else {
                echo json_encode(array("status"=>0,"message"=>"Id Not found" ));
            }

        } else if(isset(
            $_POST["id"],
            $_POST["productName"],
            $_POST["categoryDropdown"],
            $_POST["brandDropdown"],
            $_POST["productPrice"],
            $_POST["discountedPrice"],
            $_POST["productDiscription"])){
                // Collect form data
            $productId = trim($_POST["id"]);
            $productName = trim($_POST["productName"]);
            $categoryId = trim($_POST["categoryDropdown"]);
            $brandId = trim($_POST["brandDropdown"]);
            $productPrice = trim($_POST["productPrice"]);
            $discountedPrice = trim($_POST["discountedPrice"]);
            $productDiscription = trim($_POST["productDiscription"]);

            // check for data already exist
            $exist = "select * from ourproducts where id='" . $productId . "'";
            $result_exist = mysqli_query($conn, $exist);
            if (mysqli_num_rows($result_exist) > 0) {
                $row = mysqli_fetch_assoc($result_exist);
                if ($productName == $row["productName"] && $categoryId == $row["categoryId"] && $brandId == $row["brandId"] && $productPrice == $row["productPrice"] && $discountedPrice == $row["discountedPrice"]) {
                    echo json_encode(array("status" => 0, "message" => "Data already exits"));
                }
                else{
                    // Insert data into database
                $sql = "UPDATE ourproducts SET productName = ?, productPrice = ?, productDiscription = ?, discountedPrice = ?, categoryId = ?, brandId = ?, updatedOn = ? WHERE id ='".$productId."' ";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssssss", $productName, $productPrice, $productDiscription, $discountedPrice, $categoryId, $brandId, $current);
                
                    if ($stmt->execute()) {
                        echo json_encode(array("status" => 1, "message" => "Product updated successfully."));
                    } else {
                        echo json_encode(["status" => 0, "message" => "Failed to update product."]);
                    }
                
                $stmt->close();
                }
            }
            
        }
        else{
            echo json_encode(array("status"=>0,"message"=>"all fields are required"));
        }
        break;
    // Product Delete
    case 'delete_product':
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
            $sql = "delete from ourproducts where id='" . $id . "'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(array("status" => 1, "message" => "Item Deleted successfully"));
        }
        break;

    // brand and category dropdowns
    case 'dropdown':
        $brand_data = array();
        $category_data = array();
        // brand
        $sql = "select * from brand";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $ctn = 0;
            while ($row = mysqli_fetch_assoc($result)) {
                $brand_data[$ctn]["id"] = $row["id"];
                $brand_data[$ctn]["brandName"] = $row["brandName"];
                $ctn++;
            }
        }

        // category
        $query = "select * from category";
        $query_result = mysqli_query($conn, $query);
        if (mysqli_num_rows($query_result) > 0) {
            $ctn = 0;
            while ($query_row = mysqli_fetch_assoc($query_result)) {
                $category_data[$ctn]["id"] = $query_row["id"];
                $category_data[$ctn]["categoryName"] = $query_row["categoryName"];
                $ctn++;
            }
        }
        echo json_encode(array("status" => 1, "message" => "Data fetched Successfully", "brand" => $brand_data, "category" => $category_data));
        break;

    case 'dropdown_select':
        $brand_data = array();
        $category_data = array();

        $sql = "select * from brand";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $ctn = 0;
            while ($row = mysqli_fetch_assoc($result)) {

                $brand_data[$ctn]["id"] = $row["id"];
                $brand_data[$ctn]["brandName"] = $row["brandName"];
                $ctn++;
            }
        }
        $query = "select * from category";
        $query_result = mysqli_query($conn, $query);
        if (mysqli_num_rows($query_result) > 0) {
            $ctn = 0;
            while ($query_row = mysqli_fetch_assoc($query_result)) {

                $category_data[$ctn]["id"] = $query_row["id"];
                $category_data[$ctn]["categoryName"] = $query_row["categoryName"];
                $ctn++;
            }
        }
        echo json_encode(array("status" => 1, "message" => "Data fetched successfully", "brand_data" => $brand_data, "category_data" => $category_data));
        break;

    case 'addNewProduct':
        if (
            isset(
            $_POST["productName"],
            $_POST["categoryDropdown"],
            $_POST["brandDropdown"],
            $_POST["productPrice"],
            $_POST["discountedPrice"],
            $_POST["productDiscription"],
            $_POST["createdBy"]
        ) && isset($_FILES['productImage'])
        ) {

            // Collect form data
            $productName = trim($_POST["productName"]);
            $categoryId = trim($_POST["categoryDropdown"]);
            $brandId = trim($_POST["brandDropdown"]);
            $productPrice = trim($_POST["productPrice"]);
            $discountedPrice = trim($_POST["discountedPrice"]);
            $productDiscription = trim($_POST["productDiscription"]);
            $createdBy = trim($_POST["createdBy"]);

            // File upload variables
            $fileName = $_FILES['productImage']['name'];
            $tempName = $_FILES['productImage']['tmp_name'];
            $fileSize = $_FILES['productImage']['size'];
            $fileError = $_FILES['productImage']['error'];
            $uploadDir = '../uploadedImages/';
            $uploadFile = $uploadDir . basename($fileName);

            // Validate file
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if ($fileError !== UPLOAD_ERR_OK) {
                echo json_encode(array("status" => 0, "message" => "File upload error."));
                break;
            }

            if (!in_array($fileExt, $allowedExtensions)) {
                echo json_encode(array("status" => 0, "message" => "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."));
                break;
            }

            if ($fileSize > 5 * 1024 * 1024) { // 5MB limit
                echo json_encode(array("status" => 0, "message" => "File size exceeds 5MB."));
                break;
            }



            // Insert data into database
            $sql = "INSERT INTO ourproducts (productName, productPrice, productDiscription, productImage, discountedPrice, categoryId, brandId, createdOn, updatedOn, createdBy) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssssssss", $productName, $productPrice, $productDiscription, $fileName, $discountedPrice, $categoryId, $brandId, $current, $current, $createdBy);

            if ($stmt->execute()) {
                // Move uploaded file
                if (move_uploaded_file($tempName, $uploadFile)) {
                    echo json_encode(array("status" => 1, "message" => "File uploaded successfully and data saved!"));
                } else {
                    echo json_encode(array("status" => 0, "message" => "Data saved, but file upload failed."));
                }
            } else {
                echo json_encode(array("status" => 0, "message" => "Failed to save data. Error: " . $stmt->error));
            }

            $stmt->close();
        } else {
            echo json_encode(array("status" => 0, "message" => "All fields are required."));
        }
        break;


}

?>