import axios from "axios";
import web from "../config/config.json"
import { googleOAuthConfig, siteConfig } from "@/config/site";
//const config = require("../config/config.json")
//import web from '../config/config.json';

export default function googleAuth(){
    //const config = require("../config/config.json")
    const {web} = googleOAuthConfig;
    const url = `https://accounts.google.com/o/oauth2/auth
    client_id=${web.client_id}&
    redirect_url=${web.javascript_origins[0]}&
    access_type=offline&
    response_type=code&
    scope=https://www.googleapis.com/auth/photoslibrary.readonly&
    state=new_access_token&
    include_granted_scopes=true&`
    
    return axios.get(url)
}

//https://www.googleapis.com/auth/photoslibrary.readonly