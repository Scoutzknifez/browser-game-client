import { ReactNode } from "react";

export type BaseLayoutProps = {
    /**
     * The children to render inside of this layout
     */
    children: ReactNode;
};

export function BaseLayout({ children }: BaseLayoutProps) {
    return <body>{children}</body>;
}
