"use client";

import { parsePacket } from "../../../utils/packets/parsePacket";
import { sendPacket } from "../../../utils/packets/sendPacket";
import {
    PacketType,
    TicTacToeCellData,
    TicTacToeJoinRejectedPacket,
    TicTacToeJoinRequestPacket,
    TicTacToeJoinSuccessPacket,
    TicTacToeTurnPacket,
    TicTacToeUpdatePacket,
} from "browser-game-shared";
import { useEffect, useRef, useState } from "react";

import styles from "./home-page-content.module.scss";
import classNames from "classnames";

type PlayableMove = TicTacToeCellData.X | TicTacToeCellData.O;

export type HomePageContent = {
    /**
     *
     */
    gameServerUrl: string;
};

export function HomePageContent({ gameServerUrl }: HomePageContent) {
    const webSocketRef = useRef<WebSocket | null>(null);

    const [board, setBoard] = useState<TicTacToeCellData[]>(Array(9).fill(TicTacToeCellData.X));
    const [playerTurn, setPlayerTurn] = useState<PlayableMove>(TicTacToeCellData.X);
    const [playerSymbol, setPlayerSymbol] = useState<PlayableMove>(TicTacToeCellData.X);

    useEffect(() => {
        const webSocket = new WebSocket(gameServerUrl);
        webSocketRef.current = webSocket;

        webSocket.addEventListener("open", () => {
            const ticTacToeJoinRequestPacket: TicTacToeJoinRequestPacket = {
                type: PacketType.TIC_TAC_TOE_JOIN_REQUEST,
            };
            sendPacket(webSocket, ticTacToeJoinRequestPacket);
        });

        webSocket.addEventListener("message", (event) => {
            const packet = parsePacket(event.data);
            console.log("Incoming packet: ", packet);

            if (packet.type === PacketType.TIC_TAC_TOE_JOIN_REJECTED) {
                const ticTacToeJoinRejectedPacket = packet as TicTacToeJoinRejectedPacket;
                throw new Error(ticTacToeJoinRejectedPacket.reason);
            }

            if (packet.type === PacketType.TIC_TAC_TOE_JOIN_SUCCESS) {
                const ticTacToeJoinSuccessPacket = packet as TicTacToeJoinSuccessPacket;
                const { board, turn, symbol } = ticTacToeJoinSuccessPacket;

                setBoard(board);
                setPlayerTurn(turn as PlayableMove);
                setPlayerSymbol(symbol as PlayableMove);
                return;
            }

            if (packet.type === PacketType.TIC_TAC_TOE_UPDATE) {
                const ticTacToeUpdatePacket = packet as TicTacToeUpdatePacket;
                const { board, turn } = ticTacToeUpdatePacket;

                setBoard(board);
                setPlayerTurn(turn as PlayableMove);
            }
        });

        webSocket.addEventListener("close", () => {
            console.log("Server closed!");
        });

        webSocket.addEventListener("error", (event) => {
            console.log("WebSocket ERROR!");
            console.log(event);
        });

        return () => {
            webSocket.close();
        };
    }, [gameServerUrl]);

    function onCellClick(index: number) {
        if (playerTurn !== playerSymbol) {
            alert("Not your turn!");
            return;
        }

        if (board[index] !== TicTacToeCellData.BLANK) {
            return;
        }

        const webSocket = webSocketRef.current;
        if (!webSocket) {
            throw new Error(`WebSocket not set to send packets!`);
        }

        const ticTacToeTurnPacket: TicTacToeTurnPacket = {
            type: PacketType.TIC_TAC_TOE_TURN,
            index,
        };
        sendPacket(webSocket, ticTacToeTurnPacket);
    }

    function getTicTacToeBoard() {
        return (
            <div className={styles.ticTacToeBoard}>
                {board.map((cellData, index) => (
                    <div key={index} className={styles.cell} onClick={() => onCellClick(index)}>
                        {cellData}
                    </div>
                ))}
            </div>
        );
    }

    const classes = classNames(styles.root);

    return (
        <div className={classes}>
            <h1>Tic Tac Toe Board</h1>
            {getTicTacToeBoard()}
        </div>
    );
}
