import { Typography } from "@mui/material";

const Headers = ({ 
    name1,
    name2,
    code,
    status
}) => {
    return (
        <>
            <Typography variant="h4">
                {name1} ({code})
            </Typography>
            <Typography variant="overline" gutterBottom style={{ textTransform: 'capitalize' }}>
                {status}
            </Typography>
            <br />
            <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                Evaluador: {name2}
            </Typography>
            {(name1 === name2) &&
                <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    &nbsp;(AUTOEVALUACIÓN)
                </Typography>
            }
        </>
    )
}

export default Headers;
