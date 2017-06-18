<?php
if(isset($_POST['pass']) && $_POST['pass'] == "osagrad2017") {
    $a = 1;
    include("admin.php");
}
else
{
   ?>
        <form method="POST" action="enter.php">
        Pass <input type="password" name="pass"></input><br/>
        <input type="submit" name="submit" value="Go"></input>
        </form>
    <?php 
}
?>