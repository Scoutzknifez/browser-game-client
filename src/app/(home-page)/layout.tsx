import { BaseLayout } from "../../components/base-layout/base-layout";
import { ReactNode } from "react";

export type HomePageLayoutProps = {
    /**
     * The children to render inside of this layout
     */
    children: ReactNode;
};

export default function HomePageLayout({ children }: HomePageLayoutProps) {
    return <BaseLayout>{children}</BaseLayout>;
}
