import React, { useState } from 'react';
import Papa from 'papaparse';
import Grid from '@mui/material/Grid2';
import DataSwapButtons from './dataSwapButtons.js';
import DensityPlot from "./densityPlot.js";
import ChoroplethMap from "./choroplethMap.js"


function App() {

  const [EIData, setEIData] = useState('');  // EI data has the PPM(Post Posterior Mean, AKA estimated average) of each group and candidate
  const [mapData, setMapData] = useState('');
  const [candidates, setCandidates] = useState('');
  const [demographics, setDemographics] = useState('');
  const [precincts, setPrecincts] = useState('');
  const [candidate, setCandidate] = useState('');
  const [demographic, setDemographic] = useState('');
  const [precinct, setPrecinct] = useState(null); 
  const [specificPrecinctData, setSpecificPrecinctData] = useState('') 
  // const [abstain, setAbstain] = useState('');

  const handleSPDFileChange = async (mode, event) => {
    const file = event.target.files[0]

    console.log("omega file:")
    console.log(file)

    const fileContent = await file.text()
    
    const fileHeader = Papa.parse(fileContent, {
      preview: 1
    }).data


    console.log("omega file header:", fileHeader)
    console.log(fileHeader)

    let holder = []
    for (let i = 0; i < fileHeader.length; i++) {
      holder.push(fileHeader[0][i])
    }

    const fileData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    }).data

    console.log("omega file data:")
    console.log(fileData)
    setSpecificPrecinctData(fileData)
    
  }

  const handleDataFileChange = async (mode, event) => {
    const file = event.target.files[0]

    const fileContent = await file.text()

    const fileHeader = Papa.parse(fileContent, {
      preview: 1
    }).data


    console.log(fileHeader[0])
    console.log("file header:", fileHeader[0])
    let holder = []
    for (let i = 0; i < fileHeader[0].length; i++) {
      holder.push(fileHeader[0][i])
    }

    const fileData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    }).data

    console.log("EI data")
    console.log(fileData)
    setEIData(fileData)
  }

  const handleMapFileChange = async (mode, event) => {
    const file = event.target.files[0]

    const reader = new FileReader();

    reader.onload = function (e) {
      const geojson = JSON.parse(e.target.result);
      setMapData(geojson)
      console.log(geojson)
    }

    // will call above onload function
    reader.readAsText(file); // Reads the file as text

  }

  const handleHelperFileChange = async (mode, event) => {
    const file = event.target.files[0]

    const fileContent = await file.text()

    const fileHeader = Papa.parse(fileContent, {
      preview: 1
    }).data

    console.log(fileHeader[0])
    console.log("file header:", fileHeader[0])
    let holder = []
    for (let i = 0; i < fileHeader[0].length; i++) {
      holder.push(fileHeader[0][i])
    }

    const fileData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    }).data

    console.log(fileData)

    let dem_holder = []
    for (let i = 0; i < fileData.length; i++) {
      let dem = fileData[i]['Demographics']

      if (dem == null)
        break
      else
        dem_holder.push(dem)
    }

    console.log(dem_holder)
    setDemographics(dem_holder)
    setDemographic(dem_holder[0])

    let can_holder = []
    for (let i = 0; i < fileData.length; i++) {
      let can = fileData[i]['Candidates']

      if (can == null)
        break
      else
        can_holder.push(can)
    }

    console.log(can_holder.length)
    console.log(can_holder)
    setCandidates(can_holder)
    setCandidate(can_holder[0])


    let pre_holder = []
    for (let i = 0; i < fileData.length; i++) {
      let pre = fileData[i]['Precincts']

      if (pre == null)
        break
      else
        pre_holder.push(pre)
    }

    console.log("Precincts:")
    console.log(pre_holder)
    setPrecincts(pre_holder)

    // setAbstain(fileData[0]['Abstain'])
  }

  // if not all data is uploaded yet
  if (EIData === '' || candidates === '' || demographics === '' || specificPrecinctData === '') { 
    return (
      <div>
        <label htmlFor="EIData">EI Data </label>
        <input type="file" onChange={(event) => handleDataFileChange(0, event)} style={{ marginLeft: '74px' }} id={"EIData"} />
        <br></br>
        <label htmlFor="map">Map File </label>
        <input type="file" onChange={(event) => handleMapFileChange(0, event)} style={{ marginLeft: '52px' }} id={"map"} />
        <br></br>
        <label htmlFor="data">Helper File </label>
        <input type="file" onChange={(event) => handleHelperFileChange(0, event)} style={{ marginLeft: '48px' }} id={"helper"} />
        <br></br>
        <label htmlFor="data">Specific Precinct Data File </label>
        <input type="file" onChange={(event) => handleSPDFileChange(0, event)} style={{ marginLeft: '12px' }} id={"spd"} />
        <br></br>
      </div>
    );
  }
  // once all data is uploaded
  else {

    return (
      <Grid container spacing={2} sx={{ flexGrow: 1, textAlign: 'center' }}>

        <Grid item="true" size={12}>
          <DataSwapButtons
            demographics={demographics}
            candidates={candidates}
            setDemographic={setDemographic}
            setCandidate={setCandidate}
          />
        </Grid>


        <Grid item="true" size={{ xs: 12, md: 6, lg: 6 }}  >
          <DensityPlot
            data={EIData}
            precinct={precinct}
            precincts={precincts}
            demographic={demographic}
            candidate={candidate}
            specificPrecinctData={specificPrecinctData}
          />
        </Grid>

        <Grid item="true" size={{ xs: 12, md: 6, lg: 6 }}  >
          <ChoroplethMap
            data={mapData}
            demographic={demographic}
            candidate={candidate}
            setPrecinct={setPrecinct}
          />
        </Grid>


      </Grid>
    );


  }


}


export default App;