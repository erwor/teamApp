<?php
    $dir = "news";
    $return_array = array();
    if(is_dir($dir)){
        if($dh = opendir($dir)){
            while(($file = readdir($dh)) != false){
                if($file == "." or $file == ".."){
                } else {
                    $return_array[] = $file;
                }
            }
        }
        $num = count($return_array) + 1;
    }
    $filename = 'news/noticia' . $num . '.txt';
    echo $filename;
    $data = file_get_contents("php://input");
    echo $data;
    $myfile = fopen($filename, "w");
    fwrite($myfile, $data);
    fclose($myfile);
?>