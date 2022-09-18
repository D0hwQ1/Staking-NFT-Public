import React from "react";
import styles from "../../styles/Home.module.css";
import { Box, Paper, Grid } from "@mui/material";

const list = ["MAL Lounge", "MAL scan"];
const Partners = () => {
    return (
        <div className={styles.container} style={{ paddingTop: "4%", backgroundColor: "black", paddingBottom: "5%" }}>
            <h1>META-AIRLINE Partners</h1>
            {list.map((name: any) => (
                <Grid container key={name}>
                    <Grid item xs={15} mb={2}>
                        <Paper
                            variant="outlined"
                            style={{ height: 50 }}
                            sx={{ bgcolor: "black", display: "flex", alignItems: "center", color: "white", borderColor: "white" }}
                        >
                            <h3 style={{ marginLeft: "1%" }}>{name}</h3>
                        </Paper>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
};

export default Partners;
