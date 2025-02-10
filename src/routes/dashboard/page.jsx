import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";

const DashboardPage = () => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <Footer />
        </div>
    );
};

export default DashboardPage;
