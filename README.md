# ei_viz

## Setup/Dependencies

In order to run the program locally:
  1) Make a new react program
  2) Place this repositories *src* and *data* into it.
  3) Download the required libraries: paparse, d3, and MUI (I'm sure you can remove the MUI instead if you want).
  ```
  npm install papaparse
  ```
  ```
  npm install d3
  ```
  ```
  npm install @mui/material @emotion/react @emotion/styled
  ```

## Data

The data is split into 4 different files. I'm sure it can be combined if you wish, but it's way simpler this way.

- ei_data.csv: EI data has the PPM(Post Posterior Mean, AKA estimated average) of each group and candidate. It is used to show the statewide density plot and the coloring of the choropleth map.

- specific_precinct_data.csv: Contains the weights for each precinct(precinct id), demographic, and candidate tuple. There are 4000 weights per tuple, with the weights being how the PPM is calculated.
  - The full data is extremely large, so a test *test_spd.csv* is included which includes only the first precinct's data. See *Notes on Full SPD* at the bottom of this readme.

- Ossoff_Perdue.geojson: An aligned geojson of the state. It also has data in it, but I just take it from ei_data.
  - If you want to combine the data into 1 file, here is probably the best way to do so.  

- helper.csv: Has a list of demographics, candidates (both to create the data swap buttons), and a list of all precinct names (used to get the order of each to align with specific_precinct_data.csv).

The program should be generic enough to work with any EI dataset, but generating said datasets is quite a pain.
(For info on the data and how it was generated, just contact me as it's complicated.)

## Functioning

After you enter the data, you'll see 2 rows of buttons, the density plot, and the choropleth map. 

Click any of the buttons on the top row to change which demographic is currently being displayed, and the bottom row buttons to change which candidate is being displayed. 

Clicking any of the precincts on the choropleth map will select that precinct (see below *Notes on Full SPD*), and turn the density plot to be specific to that precinct's weights.

Click on the "title" of the choropleth map, located above the color legend, to turn the density plot back to being statewide. (This is unintuitive and should probably be changed).

## Notes on Full SPD

The full specific_precinct_data is huge, so I included a smaller test csv. 

**The program is currently set up to work only with this test csv, but it should be fully compatible if you delete line 42 of densityPlot.js**. 

The CSV was so large it would crash my browser trying to load it all in at once, but this should not be an issue for the ARS. 

To get it to work locally, I'm sure there is some buffering or something that can fix the issue, or just fix up everything with the test csv and worry about the full data later.


