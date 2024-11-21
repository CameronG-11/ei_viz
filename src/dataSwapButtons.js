import Button from '@mui/material/Button';


export default function DataSwapButtons({
    demographics,
    candidates,
    setDemographic,
    setCandidate
}) {



    function handleDemographicClick(event, demographic) {
        //console.log(event)
        setDemographic(demographic)
    }

    function handleCandidateClick(event, candidate) {
        //console.log(event)
        setCandidate(candidate)
    }


    return (
        <div>

            {
            demographics.map((demographic) =>
                <Button key={demographic} variant={"contained"} size="small" sx={{
                    width: 180,
                    height: 15,
                    fontSize: '12px',
                    textTransform: 'none'
                }}
                    onClick={(event) => {
                        handleDemographicClick(event, demographic)
                    }}
                >
                    {demographic}
                </Button>
            )
            }
            <br></br>
            {
            candidates.map((candidate) =>
                <Button key={candidate} variant={"contained"} size="small" sx={{
                    width: 180,
                    height: 15,
                    fontSize: '12px',
                    textTransform: 'none'
                }}
                    onClick={(event) => {
                        handleCandidateClick(event, candidate)
                    }}
                >
                    {candidate}
                </Button>
            )
            }


        </div>
    );
}

