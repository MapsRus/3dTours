<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and retrieve form data
    $locationName = isset($_POST['locationName']) ? htmlspecialchars($_POST['locationName']) : '';
    $description = isset($_POST['description']) ? htmlspecialchars($_POST['description']) : '';
    $latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : null;
    $longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : null;

    // Check if required data is present and validate coordinates
    if (!empty($locationName) && !empty($description) && is_numeric($latitude) && is_numeric($longitude)) {

        // Data array
        $data = array(
            'Location' => $locationName,
            'Description' => $description,
            'lat' => $latitude,
            'lon' => $longitude
        );

        /*// Path to the storage directory
        // $storagePath = 'C:/Users/HP/Documents/Projects/Mark/';

        // // Check or create directory if not exists
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0755, true);
            chmod($storagePath, 0755, true);
        }*/

        // File name and path
        //$fileName = $storagePath . 'locations.json';
		
		$fileName = __DIR__ . DIRECTORY_SEPARATOR . 'locations.json';

        // Obtain an exclusive lock on the file
        $file = fopen($fileName, 'c');
       // flock($file, LOCK_EX);

        // Read existing data from the file
        $currentData = json_decode(file_get_contents($fileName), true);

        // Add new data to the existing data
        $currentData[] = $data;

        // Write the updated data to the file
        file_put_contents($fileName, json_encode($currentData, JSON_PRETTY_PRINT));

        // Release the lock and close the file
        flock($file, LOCK_UN);
        fclose($file);

        // Respond to the client
        echo json_encode(['message' => 'Location saved successfully']);
        $host  = $_SERVER['HTTP_HOST'];
        $host_upper = strtoupper($host);
        $path   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
        $baseurl = "http://" . $host . $path . "/";
        redirect($baseurl);
    } else {
        redirect($baseurl);
    }

}

function redirect($url) {
    header('Location: '.$url . '3dTourPlanner.html');
    die();
}
?>
