## Ideas
The project aims to harvest tweets from Singapore and analyzes those tweets to determine trending phrases and attitude
of Singaporean people towards those phrases. Project is useful in the sense of business investment decision or survey 
in general without the need to actually perform the survey.

## Features
The scenario can be described as:

1. Users input any desired phrases

2. The system will return a big Singapore map with the following functionalities:
  - The overall attitude of Singaporean towards the phrases (positive, negative, neutral) in a pie chart and exact
  figures.
  - The suburbs that have attitude towards the the phrases (with exact measurements based on the location of harvested
  tweets) and exact figures.
  - The attitude of Singaporean in each available suburbs (positive, negative, neutral) in pie chart and exact figures.
  - The comparison between each suburb and general Singapore in pie chart and bar charts with exact figures.

## Design
Simplicity is the key of this project, therefore, all navigation is based on a big, gorgeous Google Map of Singapore.
The navigation is AJAX based to ensure smooth transition between pages. Each suburb is clickable and users can zoom 
in/out to navigate effortlessly.

In addition, various flat design colors are used to express different kind of attitudes, different charts and components
within the map.
