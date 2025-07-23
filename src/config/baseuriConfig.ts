const baseuriConfig = {
    CHECK_LIST : 'webapp/wiki/check-list',
    webapp_SERVICE: 'webapp/wiki/webapp-service',
    DISTRIBUTION_LIST : 'webapp/wiki/get-distributor-list',
    SLA : 'webapp/wiki/sla',
    RAISEINCIDENT:'webapp/wiki/raise-incident',
    FILEUPLOAD:'webapp/file-upload',
    FILEUPLOADCHUNK:'webapp/file-upload-chunks',
    MONITORING_DROPDOWN_DATA :'webapp/fetch-division-retailer-channel-info',
    MONITORING_SCREEN_DATA: 'webapp/monitoring-screen-data',
    RAISEAnINCIDENT:'webapp/operations/raise-an-incident',
    RetailerOnboard:'webapp/operations/new-retailer-onboard',
    ModifyExistingReatiler:'webapp/operations/modify-existing-retailer',
    LOGOUT:'logout',
    FIEL_VERSION_INFO:'webapp/file-version-info',
};

const helperConfig = {
    IDENTITY :'info/identity',
    PROXYBFF :'forward?url=https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
}

export {baseuriConfig, helperConfig};