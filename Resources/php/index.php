<?php
    include_once 'simple_html_dom.php';
    $html = new simple_html_dom();
    $html->load_file("http://www.livescores.com/");
    $scoresTableRows = $html->find("/html/body/table/tbody/tr[4]/td/table/tbody/tr/td[5]/table/tbody/tr");
    $countriesTableRows = $html->find("/html/body/table/tbody/tr[4]/td/table/tbody/tr/td[1]/table/tbody/tr");
    $scores = array();
    $countries = array();
    foreach ($scoresTableRows as $row) {
        if (strlen($row->plaintext)!= 0) {
            if ($row->find("td.title") != null) {
                $titleRow = $row->find("td.title");
                $sectionTitle = str_replace("&nbsp;", "", $titleRow[0]->plaintext);
                //var_dump($sectionTitle);
                array_push($scores, array(
                    "type" => "section",
                    "sectiontitle" => $sectionTitle
                ));
            } elseif ($row->find("td.match-light") != null) {
                $matchDayArray = $row->find("td.match-light");
                $time = str_replace("&nbsp;", "", $matchDayArray[0]->plaintext);
                //var_dump($time);
                $date = str_replace("&nbsp;", "", $matchDayArray[1]->plaintext);
                //var_dump($date);
                array_push($scores, array(
                    "type" => "matchday",
                    "time" => $time,
                    "date" => $date
                ));
            } else {
                $matchArray = $row->find("td");
                $matchTime = str_replace("&nbsp;", "", $matchArray[0]->plaintext);
                //var_dump($matchTime);
                $firstTeam = $matchArray[1]->plaintext;
                //var_dump($firstTeam);
                $secondTeam = $matchArray[3]->plaintext;
                //var_dump($secondTeam);
                $score = explode("-", $matchArray[2]->plaintext);
                $scoreFirstTeam = str_replace(" ", "", $score[0]);
                //var_dump($scoreFirstTeam);
                $scoreSecondTeam = str_replace(" ", "", $score[1]);
                //var_dump($scoreSecondTeam);
                if ($matchArray[2]->find("a") != null) {
                    $scoreLink = $matchArray[2]->find("a");
                    $scoreLink = $scoreLink[0]->href;
                } else {
                    $scoreLink = "";
                }
                //var_dump($scoreLink);
                array_push($scores, array(
                    "type" => "match",
                    "matchtime" => $matchTime,
                    "firstteam" => $firstTeam,
                    "secondteam" => $secondTeam,
                    "scorefirstteam" => $scoreFirstTeam,
                    "scoresecondteam" => $scoreSecondTeam,
                    "scorelink" => $scoreLink
                ));
            }
        }
    }
    foreach ($countriesTableRows as $row) {
        if (strlen($row->plaintext) != 0 && trim($row->plaintext)!= 'Home' && trim($row->plaintext)!= 'All Live' && trim($row->plaintext)!= 'All Soccer' && trim($row->plaintext)!= 'Contact Us') {
            //var_dump(trim($row->plaintext));
            $scoreUrl = $row->find('a');
            //var_dump($scoreUrl[0]->href);
            array_push($countries, array(
                trim($row->plaintext) => $scoreUrl[0]->href
            ));
        }
    }
    //var_dump($countries);
    echo json_encode(array('scores' => $scores, 'countries' => $countries));
?>