<?php

$typeInform = $_POST["typeInform"];


switch($typeInform){
    case "cars": echo(file_get_contents("data_cars.json"));break;
    case "attempts": echo(file_get_contents("data_attempts.json"));break;
}
