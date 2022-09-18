import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";

const Desc = () => {
    const [alignment, setAlignment] = useState("Accretion");

    const handleAlignment = (event: any, newAlignment: any) => {
        setAlignment(newAlignment);
    };

    return (
        <div className={styles.container} style={{ backgroundColor: "black" }}>
            <h1>MAL POINT Accretion/Work</h1>
            <Box px={5} mb={10}>
                <ToggleButtonGroup sx={{ bgcolor: "white" }} fullWidth value={alignment} exclusive onChange={handleAlignment}>
                    <ToggleButton value="Accretion">Accretion</ToggleButton>
                    <ToggleButton value="Work">Work</ToggleButton>
                </ToggleButtonGroup>
                <h3>
                    {alignment == "Accretion"
                        ? "META-AIRLINE NFT holders can earn the MAL Point when staking the META-AIRLINE NFT"
                        : "MAL POINT can change the $MAL token, We will announce the schedule to open."}
                </h3>
            </Box>

            <h1>MAL POINT</h1>

            {alignment == "Accretion" ? (
                <Box px={5}>
                    <h3>MAL POINT can earn when META-AIRLINE holders stake their META-AIRLINE NFTs.</h3>
                    <h3>MAL POINT get earn every hour.</h3>
                    <h3>
                        The point you earn, you can check the{" "}
                        <a style={{ color: "gray" }} href="https://meta-airline.gitbook.io/welcome-to-gitbook/token-economic/pre-mining">
                            DOCS
                        </a>
                    </h3>
                </Box>
            ) : (
                <Box px={5}>
                    <h3>MAL POINT can earn many mainnet platform</h3>
                    <h3>MAL POINT can switch the $MAL Token</h3>
                    <h3>MAL POINT can use when upgrade the META-AIRLINE users levels</h3>
                </Box>
            )}
        </div>
    );
};

export default Desc;
