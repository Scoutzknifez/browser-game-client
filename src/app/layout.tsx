import { ReactNode } from "react";

import "../styles/global.scss";

export type LayoutProps = {
    /**
     * The children to render inside of this layout
     */
    children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
    return <html lang="en">{children}</html>;
}
