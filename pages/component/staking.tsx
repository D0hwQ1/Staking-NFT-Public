import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import { Box, BoxProps, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Caver from "caver-js";
import axios from "axios";

var delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                mr: 1,
                ...sx,
            }}
            {...other}
        />
    );
}

const Staking = (props: any) => {
    const [rows, setRows] = useState<any[]>([]);
    const [rows2, setRows2] = useState<any[]>([]);
    const [load, setLoad] = useState(false);
    const caver: any | null = typeof window != "undefined" ? new Caver(window.klaytn) : null;
    var column: any = [];

    function createData(id: number, image: any, sort: string, grade: string) {
        return { id, image, sort, grade };
    }

    useEffect(() => {
        if (props.data != null && props.tokenIds != null) {
            var tmp = props.data;
            column = props.tokenIds.map((id: any, idx: any) => {
                return createData(
                    id,
                    tmp.image[tmp.tokenId.indexOf(parseInt(id))],
                    tmp.sort[tmp.tokenId.indexOf(parseInt(id))],
                    tmp.grade[tmp.tokenId.indexOf(parseInt(id))]
                );
            });
            setRows(column);

            var tmp2 = props.staking;
            if (tmp2) {
                column = tmp2.map((data: any, idx: any) => {
                    return createData(
                        data.tokenId,
                        tmp.image[tmp.tokenId.indexOf(parseInt(data.tokenId))],
                        tmp.sort[tmp.tokenId.indexOf(parseInt(data.tokenId))],
                        tmp.grade[tmp.tokenId.indexOf(parseInt(data.tokenId))]
                    );
                });
                setRows2(column);
            }
            setLoad(true);
        }
    }, [props.data, props.tokenIds, props.account, props.staking]);

    return (
        <div className={styles.container} style={{ color: "white", width: "100%", height: "100%", paddingBottom: "5%", backgroundColor: "black" }}>
            <div style={{ display: "flex", width: "100" }}>
                <h1>NFT STAKING</h1>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        p: 2,
                        m: 2,
                    }}
                >
                    {rows.length > 0 && (
                        <Item>
                            <Button
                                onClick={async () => {
                                    try {
                                        var cont_nft: any = new caver.klay.KIP17(process.env.NEXT_PUBLIC_NFT);
                                        var cont_staking: any = new caver.klay.Contract(
                                            JSON.parse(process.env.NEXT_PUBLIC_ABI!),
                                            process.env.NEXT_PUBLIC_STAKING
                                        );

                                        if (!(await cont_nft.isApprovedForAll(props.account, process.env.NEXT_PUBLIC_STAKING))) {
                                            await cont_nft.setApprovalForAll(process.env.NEXT_PUBLIC_STAKING, true, {
                                                from: props.account,
                                                gas: 300000,
                                            });
                                        }
                                        var cnt = 0;
                                        for (var i = 0; i < props.tokenIds.length; i++) {
                                            await cont_staking.methods.stake(props.tokenIds[i]).send({ from: props.account, gas: 500000 });
                                            await delay(200);
                                            await axios.post("/api/user", { command: "staking", addr: props.token, id: props.tokenIds[i] });
                                            await delay(200);
                                            cnt = cnt + 1;
                                            await alert(`현재 상황 ${cnt} / ${props.tokenIds.length}`);
                                        }

                                        alert("작업이 완료되었습니다.");
                                        location.reload();
                                    } catch (e: any) {
                                        console.log(e);
                                        if (e.toString().includes("User denied")) alert("서명을 거절하셨습니다.");
                                        else alert("새로고침 후, 다시 시도해주세요.");
                                        location.reload();
                                    }
                                }}
                                sx={{ color: "white", borderColor: "white", heigth: "100" }}
                                variant="outlined"
                            >
                                All Staking
                            </Button>
                        </Item>
                    )}
                    {props.staking && props.staking.length > 0 && (
                        <Item>
                            <Button
                                onClick={async () => {
                                    try {
                                        var cnt = 0;
                                        var cont_staking: any = new caver.klay.Contract(
                                            JSON.parse(process.env.NEXT_PUBLIC_ABI!),
                                            process.env.NEXT_PUBLIC_STAKING
                                        );
                                        for (var i = 0; i < props.staking.length; i++) {
                                            await cont_staking.methods.withdraw(props.staking[i].tokenId).send({ from: props.account, gas: 500000 });
                                            await delay(200);
                                            await axios.post("/api/user", { command: "unstaking", addr: props.token, id: props.staking[i].tokenId });
                                            await delay(200);
                                            cnt = cnt + 1;
                                            await alert(`현재 상황 ${cnt} / ${props.staking.length}`);
                                        }

                                        alert("모든 작업이 완료되었습니다.");
                                        location.reload();
                                    } catch (e: any) {
                                        console.log(e);
                                        if (e.toString().includes("User denied")) alert("서명을 거절하셨습니다.");
                                        else alert("새로고침 후, 다시 시도해주세요.");
                                        location.reload();
                                    }
                                }}
                                sx={{ color: "white", borderColor: "white" }}
                                variant="outlined"
                            >
                                All UnStaking
                            </Button>
                        </Item>
                    )}
                </Box>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, bgcolor: "black" }} size="small">
                    <TableHead>
                        {load && (
                            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 1 } }}>
                                <TableCell sx={{ color: "white" }} align="center">
                                    NFT ID
                                </TableCell>
                                <TableCell sx={{ color: "white" }} align="center">
                                    IMAGE
                                </TableCell>
                                <TableCell sx={{ color: "white" }} align="center">
                                    SORT
                                </TableCell>
                                <TableCell sx={{ color: "white" }} align="center">
                                    BASIC/RARE
                                </TableCell>
                                <TableCell sx={{ color: "white" }} align="center">
                                    STAKING
                                </TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {load &&
                            rows2 &&
                            rows2.map((row: any) => (
                                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, color: "white" }}>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        {row.id}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        <img src={`/image/${row.image}`} style={{ width: 100, height: 100 }} />
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        {row.sort}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        {row.grade}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    var cont_staking: any = new caver.klay.Contract(
                                                        JSON.parse(process.env.NEXT_PUBLIC_ABI!),
                                                        process.env.NEXT_PUBLIC_STAKING
                                                    );
                                                    await cont_staking.methods.withdraw(row.id).send({ from: props.account, gas: 500000 });
                                                    await axios.post("/api/user", { command: "unstaking", addr: props.token, id: row.id });

                                                    alert("작업이 완료되었습니다.");
                                                } catch (e: any) {
                                                    console.log(e);
                                                    if (e.toString().includes("User denied")) alert("서명을 거절하셨습니다.");
                                                    else alert("새로고침 후, 다시 시도해주세요.");
                                                }
                                            }}
                                            sx={{ color: "white", borderColor: "white" }}
                                            variant="outlined"
                                        >
                                            UnStaking
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {load &&
                            rows.map((row: any) => (
                                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, color: "white" }}>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        {row.id}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        <img src={`/image/${row.image}`} style={{ width: 100, height: 100 }} />
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        {row.sort}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        {row.grade}
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }} align="center">
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    var cont_nft: any = new caver.klay.KIP17(process.env.NEXT_PUBLIC_NFT);
                                                    var cont_staking: any = new caver.klay.Contract(
                                                        JSON.parse(process.env.NEXT_PUBLIC_ABI!),
                                                        process.env.NEXT_PUBLIC_STAKING
                                                    );

                                                    if (!(await cont_nft.isApprovedForAll(props.account, process.env.NEXT_PUBLIC_STAKING))) {
                                                        await cont_nft.setApprovalForAll(process.env.NEXT_PUBLIC_STAKING, true, {
                                                            from: props.account,
                                                            gas: 300000,
                                                        });
                                                    }
                                                    await cont_staking.methods.stake(row.id).send({ from: props.account, gas: 500000 });
                                                    await axios.post("/api/user", { command: "staking", addr: props.token, id: row.id });

                                                    alert("작업이 완료되었습니다.");
                                                } catch (e: any) {
                                                    console.log(e);
                                                    if (e.toString().includes("User denied")) alert("서명을 거절하셨습니다.");
                                                    else alert("새로고침 후, 다시 시도해주세요.");
                                                }
                                            }}
                                            sx={{ color: "white", borderColor: "white" }}
                                            variant="outlined"
                                        >
                                            Staking
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Staking;
