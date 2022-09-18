import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Box, AppBar, Toolbar, IconButton, Container, Avatar, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Caver from "caver-js";
import axios from "axios";

import Desc from "./component/desc";
import Reward from "./component/reward";
import Partners from "./component/partners";
import Staking from "./component/staking";

declare global {
    interface Window {
        klaytn: any;
    }
}

const useStyles = makeStyles({
    button: {
        "&:disabled": {
            color: "white",
        },
    },
});

const Components = ["ABOUT META-PASS", "$MAL POINT", "NFT STAKING", "MAL AIRLINE", "Airland"];

const Home: NextPage = () => {
    const [account, setAccount] = useState("0x");
    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState<any>(null);
    const [tokenIds, setTokenIds] = useState(null);
    const [login, setLogin] = useState(false);
    const [nav, setNav] = useState("ABOUT META-PASS");
    const classes = useStyles();
    const caver: any | null = typeof window != "undefined" ? new Caver(window.klaytn) : null;

    useEffect(() => {
        if (typeof window != "undefined" && !login) {
            try {
                if (window.klaytn != undefined && window.klaytn.selectedAddress != undefined) {
                    getAccount(window.klaytn.selectedAddress);
                    setLogin(true);

                    if (userData == null && data == null && token == null) {
                        axios.post("/api/jwt", { addr: window.klaytn.selectedAddress }).then((res: any) => {
                            setToken(res.data.token);
                        });
                        axios.get("/api/metadata").then((res: any) => {
                            setData(res.data);
                        });
                        axios.post("/api/user", { command: "login", addr: window.klaytn.selectedAddress }).then((res: any) => {
                            setUserData(res.data);
                        });
                    }

                    var cont_staking: any = new caver.contract(JSON.parse(process.env.NEXT_PUBLIC_ABI!), process.env.NEXT_PUBLIC_STAKING);
                    cont_staking.methods
                        .getInformation(window.klaytn.selectedAddress)
                        .call()
                        .then((res: any) => {
                            setTokenIds(res[1]);
                        });
                }
            } catch (e) {
                throw e;
            }
        }
    }, [login, account, tokenIds]);

    const getAccount = (addr: any) => {
        setAccount(addr);
    };
    return (
        <div style={{ backgroundColor: "black", color: "white", width: "100vw", height: "100vh" }}>
            <AppBar position="fixed" sx={{ bgcolor: "black" }}>
                <Container maxWidth={false}>
                    <Toolbar disableGutters>
                        <Image src="/logo.png" width="200" height="40" />

                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ ml: 20.5, flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {Components.map(page => (
                                <Button
                                    key={page}
                                    onClick={() => {
                                        setNav(page);
                                    }}
                                    sx={page == nav ? { mr: 2, my: 2, display: "black", color: "gray" } : { mr: 2, my: 2, display: "black", color: "white" }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ width: 260, textAlign: "right" }}>
                            <IconButton
                                className={classes.button}
                                sx={{ color: "white", "icon-button-root:disabled": { color: "white" } }}
                                onClick={async () => {
                                    if (!login && typeof window != "undefined") {
                                        try {
                                            var accounts: any = await window.klaytn.enable();

                                            getAccount(accounts[0]);
                                            setLogin(true);
                                            if (userData == null && data == null) {
                                                axios.post("/api/jwt", { addr: accounts[0] }).then((res: any) => {
                                                    setToken(res.data.token);
                                                });
                                                axios.get("/api/metadata").then((res: any) => {
                                                    setData(res.data);
                                                });
                                                axios.post("/api/user", { command: "login", addr: accounts[0] }).then((res: any) => {
                                                    setUserData(res.data);
                                                });
                                            }

                                            var cont_staking: any = new caver.contract(
                                                JSON.parse(process.env.NEXT_PUBLIC_ABI!),
                                                process.env.NEXT_PUBLIC_STAKING
                                            );

                                            cont_staking.methods
                                                .getInformation(accounts[0])
                                                .call()
                                                .then((res: any) => {
                                                    setTokenIds(res[1]);
                                                });
                                        } catch (e) {
                                            console.log(e);
                                            alert("카이카스가 없습니다.");
                                        }
                                    }
                                }}
                                disabled={login ? true : false}
                            >
                                <Avatar src="/kaikas.svg" />
                                {login ? "Connected" : "Connect Wallet"}
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <img src="/depart.gif" style={{ width: "100%", height: "20%", marginTop: "3%" }} />
            {nav == "ABOUT META-PASS" && (
                <div style={{ backgroundColor: "black" }}>
                    <Desc></Desc>
                    <Partners></Partners>
                </div>
            )}
            {nav == "$MAL POINT" && (
                <div style={{ backgroundColor: "black" }}>
                    <Reward
                        account={account}
                        data={data}
                        tokenIds={tokenIds}
                        point={userData ? userData.point : false}
                        staking={userData ? userData.stake : false}
                    ></Reward>
                </div>
            )}
            {nav == "NFT STAKING" && (
                <div style={{ backgroundColor: "black" }}>
                    <Staking account={account} token={token} data={data} tokenIds={tokenIds} staking={userData ? userData.stake : false}></Staking>
                </div>
            )}
        </div>
    );
};

export default Home;
