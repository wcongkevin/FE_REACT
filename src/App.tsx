import AppRoutes from "./routes/AppRoutes"
import React, { useEffect, useState } from 'react';
import { FRONT_STATIC_URL } from "./helpers/constants";
import { helperConfig } from "./config/baseuriConfig";
import { REACT_APP_API_URL } from "./helpers/constants";
import axios from 'axios';

const App: React.FC = () => {
  const [user, setUser] = useState(sessionStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      axios.get(REACT_APP_API_URL + helperConfig.IDENTITY, {}).then(
        function(res) {
          let userdata = res.data;
          sessionStorage.setItem("user", userdata || "");
          sessionStorage.setItem("name", userdata.identity || "");
          sessionStorage.setItem("user_email", userdata.identity || "");
          loadUserProfile(userdata);
        }
      ).catch(
        function(err) {
          console.error("error when init:" + err)
        }
      );
    } else {
      console.log("login user is:" + user)
    }
  }, []);

  const loadUserProfile = async (userdata) => {
    try {
      const response = await axios.get(REACT_APP_API_URL + helperConfig.PROXYBFF, {});
      userdata['picture'] = response.data.picture
      setUser(userdata)
      localStorage.setItem("profile", response.data.picture || "");
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  return (
    <div>
      {user ? (
        <AppRoutes />
      ) : (
        <div className="row p-5">
          <div className="col-lg-12 d-flex justify-content-around p-5 mt-5">
            <img src={`${FRONT_STATIC_URL}Logo.png`} className="img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;