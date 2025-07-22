import { ReactNode } from "react";

import styles from "./base-layout.module.scss";

export type BaseLayoutProps = {
    /**
     * The children to render inside of this layout
     */
    children: ReactNode;
};

export function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <body className={styles.root}>
            <header>
                <h1>Browser Games!</h1>
                <button>Home</button>
            </header>
            {children}
        </body>
    );
}
