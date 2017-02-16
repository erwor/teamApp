<?php
$con = mysqli_connect("localhost", "root", "", "login");
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
$data = json_decode(file_get_contents("php://input"));
$username = mysqli_real_escape_string($con,$data->theusername);
$password = mysqli_real_escape_string($con,$data->thepassword);
 
$query =("SELECT id FROM login WHERE user= '$username' and pswd= '$password'");
$que = mysqli_query($con, $query);
$count = mysqli_num_rows($que);
 
if($count==1){
echo 'correct';}
else{
echo 'wrong';
}
?>