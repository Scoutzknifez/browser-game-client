import { TIC_TAC_TOE_PATH } from "../../utils/urls/paths";
import Link from "next/link";

import styles from "./home-page.module.scss";

export default function HomePage() {
    console.log("GET /");

    return (
        <div className={styles.root}>
            <h2>Game Selection Menu</h2>
            <Link href={TIC_TAC_TOE_PATH}>Play Tic Tac Toe</Link>
        </div>
    );
}
