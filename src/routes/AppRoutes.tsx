import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout.tsx'
import FileMonitor from '../pages/fileMonitor/FileMonitor.tsx'
import FileUpload from '../pages/fileUpload/FileUpload.tsx';
import Report from '../pages/report/Report.tsx';
import webappWiki from '../pages/help/webappWiki.tsx';
import ContactList from '../pages/help/ContactList.tsx';
import NewRetailerOnboarding from '../pages/operations/NewRetailerOnboarding.tsx';
import ModifyExistingRetailer from '../pages/operations/ModifyExistingRetailer.tsx';
import RaiseAnIncident from '../pages/operations/RaiseAnIncident.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';

const AppRoutes: React.FC = () => {
    return(
            <Router>
                <Routes>
                    <Route path="/" element={<AppLayout/>}>
                        <Route path="/" element={<FileMonitor/>}/>
                        <Route path="/file-upload" element={<FileUpload/>} />  
                        <Route path="/report" element={<Report/>} />
                        <Route path="/operations/new-retailer-onboarding" element={<NewRetailerOnboarding/>} />
                        <Route path="/operations/modify-existing-retailer" element={<ModifyExistingRetailer/>} />
                        <Route path="/operations/raise-an-incident" element={<RaiseAnIncident/>} />
                        <Route path="/help/webapp-wiki" element={<webappWiki/>} />
                        <Route path="/help/contact-list" element={<ContactList/>} />   
                        <Route path="*" element={<ErrorPage/>} />  
                    </Route>
                </Routes>
            </Router>          
    ); 
};
export default AppRoutes;