import { Outlet } from "react-router-dom";
import Navigation from "../navigation/Navigation";

const AppLayout = () => {
    return (
        <div>
            <Navigation/>
            <Outlet/>
        </div>
    );
};
export default AppLayout;