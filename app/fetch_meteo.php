#!/usr/bin/env php
<?php

define('METEO_FROM', 'http://www.prevision-meteo.ch/uploads/widget/Epinay-sur-orge_0.png');
define('METEO_TO',   '/var/www/derfest.eu/public/img/meteo-epinay-sur-orge.png');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, METEO_FROM);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($ch);
curl_close($ch);

file_put_contents(METEO_TO, $res);

