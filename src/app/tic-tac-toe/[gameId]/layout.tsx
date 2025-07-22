import { BaseLayout } from "../../../components/base-layout/base-layout";
import { ReactNode } from "react";

export type TicTacToeLayoutProps = {
    /**
     * The children to render inside of this layout
     */
    children: ReactNode;
};

export default function TicTacToePageLayout({ children }: TicTacToeLayoutProps) {
    return <BaseLayout>{children}</BaseLayout>;
}
