"use client";

import { parsePacket } from "../../../utils/packets/parsePacket";
import { sendPacket } from "../../../utils/packets/sendPacket";
import {
    PacketType,
    TicTacToeCellData,
    TicTacToeGameEndPacket,
    TicTacToeGameEndReason,
    TicTacToeJoinRejectedPacket,
    TicTacToeJoinRequestPacket,
    TicTacToeJoinSuccessPacket,
    TicTacToeScore,
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
    const [myPlayerSymbol, setMyPlayerSymbol] = useState<PlayableMove>(TicTacToeCellData.X);
    const [gameScore, setGameScore] = useState<TicTacToeScore>({ o: 0, x: 0 });
    const [gameEndReason, setGameEndReason] = useState<TicTacToeGameEndReason>();
    const [gameWinner, setGameWinner] = useState<PlayableMove>();

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

            if (packet.type === PacketType.TIC_TAC_TOE_GAME_END) {
                const ticTacToeGameEndPacket = packet as TicTacToeGameEndPacket;
                const { score, reason, winner } = ticTacToeGameEndPacket;

                setGameScore(score);
                setGameEndReason(reason);

                if (reason === TicTacToeGameEndReason.WINNER && winner) {
                    setGameWinner(winner);
                }

                return;
            }

            if (packet.type === PacketType.TIC_TAC_TOE_JOIN_REJECTED) {
                const ticTacToeJoinRejectedPacket = packet as TicTacToeJoinRejectedPacket;
                throw new Error(ticTacToeJoinRejectedPacket.reason);
            }

            if (packet.type === PacketType.TIC_TAC_TOE_JOIN_SUCCESS) {
                const ticTacToeJoinSuccessPacket = packet as TicTacToeJoinSuccessPacket;
                const { score, board, turn, symbol } = ticTacToeJoinSuccessPacket;

                setGameScore(score);
                setBoard(board);
                setPlayerTurn(turn as PlayableMove);
                setMyPlayerSymbol(symbol as PlayableMove);
                return;
            }

            if (packet.type === PacketType.TIC_TAC_TOE_UPDATE) {
                const ticTacToeUpdatePacket = packet as TicTacToeUpdatePacket;
                const { score, board, turn } = ticTacToeUpdatePacket;

                setGameScore(score);
                setBoard(board);
                setPlayerTurn(turn as PlayableMove);
                setGameEndReason(undefined);
                setGameWinner(undefined);
                return;
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

    function getScore() {
        if (myPlayerSymbol === TicTacToeCellData.O) {
            return `${gameScore.o} - ${gameScore.x}`;
        }

        if (myPlayerSymbol === TicTacToeCellData.X) {
            return `${gameScore.x} - ${gameScore.o}`;
        }

        return "0 - 0";
    }

    function getPlayerSymbolAndScoreTrackers() {
        const isMyPlayerTurn = playerTurn === myPlayerSymbol;
        const opponentSymbol = myPlayerSymbol === TicTacToeCellData.X ? TicTacToeCellData.O : TicTacToeCellData.X;
        const isOpponentTurn = playerTurn === opponentSymbol;

        const myPlayerClasses = classNames(
            styles.playerSymbolTracker,
            myPlayerSymbol === TicTacToeCellData.O ? styles.o : styles.x,
            isMyPlayerTurn && styles.turn
        );
        const opponentClasses = classNames(
            styles.playerSymbolTracker,
            opponentSymbol === TicTacToeCellData.O ? styles.o : styles.x,
            isOpponentTurn && styles.turn
        );

        return (
            <div className={styles.playerSymbolAndScoreTrackersWrapper}>
                <div className={myPlayerClasses}>
                    <h3>You</h3>
                    <span>{myPlayerSymbol}</span>
                </div>
                <h3 className={styles.scoreTracker}>{getScore()}</h3>
                <div className={opponentClasses}>
                    <h3>Opponent</h3>
                    <span>{opponentSymbol}</span>
                </div>
            </div>
        );
    }

    function getGameEndText() {
        if (gameEndReason === TicTacToeGameEndReason.STALEMATE) {
            return "stalemate";
        }

        if (gameEndReason === TicTacToeGameEndReason.WINNER && gameWinner) {
            return `${gameWinner} won!`;
        }
    }

    function onCellClick(index: number) {
        if (playerTurn !== myPlayerSymbol) {
            alert("Not your turn!");
            return;
        }

        if (
            // If the cell is NOT empty
            board[index] !== TicTacToeCellData.BLANK ||
            // If the game is over for some reason
            gameEndReason !== undefined
        ) {
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

    function getCell(cellData: TicTacToeCellData, index: number) {
        const cellClasses = classNames(styles.cell, cellData === TicTacToeCellData.O ? styles.o : styles.x);

        return (
            <div key={index} className={cellClasses} onClick={() => onCellClick(index)}>
                {cellData}
            </div>
        );
    }

    function getCells() {
        return board.map(getCell);
    }

    function getTicTacToeBoard() {
        return <div className={styles.ticTacToeBoard}>{getCells()}</div>;
    }

    const classes = classNames(styles.root);

    return (
        <div className={classes}>
            <h1>Tic Tac Toe</h1>
            {getPlayerSymbolAndScoreTrackers()}
            <div className={styles.boardWrapper}>
                <h2 className={styles.winnerText}>{getGameEndText()}</h2>
                {getTicTacToeBoard()}
            </div>
        </div>
    );
}
