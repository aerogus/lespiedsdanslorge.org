#!/usr/bin/env php
<?php
/**
 * génération d'un panneau AD'HOC
 */

define('BG_IMAGE',    './assets/background.jpg');
define('BADGE_IMAGE', './assets/badge.png');
define('DATA_FILE',   './assets/data.json');
define('OUTPUT_FILE', './export/%%ID%%.jpg');

// A4 300dpi
/*
define('OUTPUT_WIDTH',  3508);
define('OUTPUT_HEIGHT', 2480);
*/

// Full HD
define('OUTPUT_WIDTH',  1920);
define('OUTPUT_HEIGHT', 1080);

if ($argc < 2) die("Usage: ./gen.php id\n");
$id = $argv[1];

$jsonStr = file_get_contents(DATA_FILE);
$json = json_decode($jsonStr);
$data = array_filter($json, function ($item) {
    global $id;
    if ($item->id === $id) return true;
});
if (!count($data)) {
    die('clé introuvable');
}
$data = array_pop($data);

$bg = imagecreatefromjpeg(BG_IMAGE);
$bg_width = imagesx($bg);
$bg_height = imagesy($bg);

// page blanche
$dest = imagecreatetruecolor(OUTPUT_WIDTH, OUTPUT_HEIGHT);

// Chargement infos du json

// Fond
imagecopymerge($dest, $bg, 0, 0, 0, 0, $bg_width, $bg_height, 100);

// Bandeau supérieur
$text = "#LesPiedsDansLOrge";
$size = 24;
$font = './assets/dk-longreach.ttf';
$color = imagecolorallocate($dest, 22, 22, 36);
imagettftext($dest, $size, 0, 40, 40, $color, $font, $text);

// Badge Festival
$badge = imagecreatefrompng(BADGE_IMAGE);
$badge_width = imagesx($badge);
$badge_height = imagesy($badge);
imagecopyresampled($dest, $badge, 1600, 20, 0, 0, 300, 300, $badge_width, $badge_height);

// Photo Artiste
$photo = imagecreatefromjpeg('../assets/img/artistes/' . $id . '.jpg');
$photo_width = imagesx($photo);
$photo_height = imagesy($photo);
imagecopyresampled($dest, $photo, 20, 20, 0, 0, 480, 240, $photo_width, $photo_height);

// Nom Artiste

// Style Artiste

// Présentation Artiste

// Bandeau réseaux sociaux

// Écriture fichier destination
imagejpeg($dest, str_replace('%%ID%%', $id, OUTPUT_FILE));
