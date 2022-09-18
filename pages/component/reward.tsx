import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { Box, Grid, Button, IconButton, Dialog, TextField, DialogContentText, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const Reward = (props: any) => {
    const [point, setPoint] = useState(0);
    const [token, setToken] = useState(0);
    const [token2, setToken2] = useState(0);
    const [open, setOpen] = useState(false);

    const [passportBasic, setpassportBasic] = useState(false);
    const [passportRare, setpassportRare] = useState(false);
    const [visaBasic, setvisaBasic] = useState(false);
    const [visaRare, setvisaRare] = useState(false);

    const ColoredLine = ({ color }: any) => (
        <hr
            style={{
                marginTop: "3%",
                width: "100%",
                color: color,
                backgroundColor: color,
                height: 1,
            }}
        />
    );

    useEffect(() => {
        if (props.data != null && props.tokenIds != null) {
            var tmp = props.data;
            var tmp2 = props.tokenIds.map((id: any, idx: any) => {
                if (tmp.grade[tmp.tokenId.indexOf(parseInt(id))] == "basic") return id;
            });
            tmp2 = tmp2.filter(function (id: any) {
                return id != undefined;
            });
            setpassportBasic(tmp2.length);
            var basic = tmp2.length;

            tmp2 = props.tokenIds.map((id: any, idx: any) => {
                if (tmp.grade[tmp.tokenId.indexOf(parseInt(id))] == "rare") return id;
            });
            tmp2 = tmp2.filter(function (id: any) {
                return id != undefined;
            });
            setpassportRare(tmp2.length);
            var rare = tmp2.length;

            tmp2 = props.staking;
            if (typeof tmp2 == "object") {
                tmp2 = tmp2.map((data: any, idx: any) => {
                    if (tmp.grade[tmp.tokenId.indexOf(parseInt(data.tokenId))] == "basic") return data.tokenId;
                });
                tmp2 = tmp2.filter(function (id: any) {
                    return id != undefined;
                });
                setpassportBasic(basic + tmp2.length);

                tmp2 = props.staking;
                tmp2 = tmp2.map((data: any, idx: any) => {
                    if (tmp.grade[tmp.tokenId.indexOf(parseInt(data.tokenId))] == "rare") return data.tokenId;
                });
                tmp2 = tmp2.filter(function (id: any) {
                    return id != undefined;
                });
                setpassportRare(rare + tmp2.length);
            }
        }
    }, [props.account, props.data, props.tokenIds, props.point]);

    return (
        <div className={styles.container} style={{ backgroundColor: "black" }}>
            <h1>$MAL Token Swap</h1>
            <Box sx={{ flexGrow: 1, paddingBottom: "5%" }}>
                <Grid item xs={7.95} container>
                    <h3>MAL Point</h3>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={7.95} container>
                        <Box sx={{ border: 2, borderRadius: 2, width: "100%", textAlign: "center" }}>
                            {typeof props.point == "number" ? props.point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "loading"}
                        </Box>
                        <h3>MAL Token</h3>
                    </Grid>
                    <Grid item xs={4} container>
                        <Box sx={{ width: "100%", height: "100%" }}>
                            <Button
                                onClick={() => setOpen(true)}
                                sx={{ marginLeft: "20%", marginTop: "4%", border: 2, borderRadious: 2, width: "30%", height: "60%", textAlign: "center" }}
                            >
                                SWAP
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={7.95} container>
                    <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>{token || "loading"}</Box>
                </Grid>

                <ColoredLine color="black" />
                {
                    <Grid container spacing={1} mb={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} container>
                                <h3>MAL Basic PASSPORT (보유수)</h3>
                                <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>{passportBasic || 0}</Box>
                            </Grid>
                            <Grid item xs={4} container>
                                <h3>MAL Rare PASSPORT (보유수)</h3>
                                <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>{passportRare || 0}</Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={4} container>
                                <h3>MAL Basic VISA (보유수)</h3>
                                <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>{visaBasic || 0}</Box>
                            </Grid>
                            <Grid item xs={4} container>
                                <h3>MAL Rare VISA (보유수)</h3>
                                <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>{visaRare || 0}</Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={4} container>
                                <h3>MAL STATE (보유수)</h3>
                                <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>0</Box>
                            </Grid>
                            <Grid item xs={4} container>
                                <h3>MAL AIRPORT (보유수)</h3>
                                <Box sx={{ border: 2, borderRadius: 2, width: "150%", textAlign: "center" }}>0</Box>
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </Box>

            <Dialog open={open} fullWidth>
                <DialogTitle>
                    <Grid container item display="flex" direction="column" alignItems="flex-end">
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <DialogContent sx={{ marginBottom: "5%", marginTop: "-5%" }}>
                    <DialogContentText sx={{ fontSize: "1.17em", fontWeight: "bold" }}>$MAL Point Swap</DialogContentText>
                    <Grid container sx={{ width: "100%" }}>
                        <Grid xs={5} container item style={{ height: "10%" }}>
                            <TextField
                                size="small"
                                placeholder="0"
                                type="number"
                                value={point}
                                onChange={(e: any) => {
                                    if (typeof props.point == "number") setPoint(e.target.value > props.point ? props.point : e.target.value);
                                }}
                                sx={{
                                    "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    input: { textAlign: "center" },
                                    marginRight: "3%",
                                }}
                            />
                            <ArrowRightAltIcon />
                        </Grid>
                        <Grid item style={{ height: "10%", marginRight: "3%" }}>
                            <TextField size="small" disabled value={point * 2} sx={{ input: { textAlign: "center" } }} />
                        </Grid>
                        <Grid item style={{ height: "10%" }}>
                            <Button variant="outlined" sx={{ textAlign: "center" }}>
                                Swap
                            </Button>
                        </Grid>
                    </Grid>
                    <ColoredLine color="black" />
                    <DialogContentText sx={{ fontSize: "1.17em", fontWeight: "bold" }}>$MAL Token Swap</DialogContentText>
                    <Grid container sx={{ width: "100%" }}>
                        <Grid xs={5} container item style={{ height: "10%" }}>
                            <TextField
                                size="small"
                                placeholder="0"
                                type="number"
                                value={token}
                                onChange={(e: any) => {
                                    if (token > 0) setToken2(e.target.value > token ? token : e.target.value);
                                }}
                                sx={{
                                    "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    input: { textAlign: "center" },
                                    marginRight: "3%",
                                }}
                            />
                            <ArrowRightAltIcon />
                        </Grid>
                        <Grid item style={{ height: "10%", marginRight: "3%" }}>
                            <TextField size="small" disabled value={token2 * 2} sx={{ input: { textAlign: "center" } }} />
                        </Grid>
                        <Grid item style={{ height: "10%" }}>
                            <Button variant="outlined" sx={{ textAlign: "center" }}>
                                Swap
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Reward;
