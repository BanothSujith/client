import axios from "axios";
import store from "../reduxstore/Store";
import Message from "./Message";
import { setVideos } from "../reduxstore/slices";

async function searchBlogs(search="") {
 try {
    
     const response = await axios.get(
       `${import.meta.env.VITE_APP_BACKEND_URI}/blogs?q=${search}`,
       {withCredentials:true}
     );
   
     if (response.data.blogs.length == 0) {
        Message("No blogs Found","warning")
      }
      else{
        store.dispatch(setVideos(response.data?.blogs))
      Message("blogs searched seccusfully...!","OK")
      }

return response.data;
 } catch (error) {
    console.error("search error", error);
    Message("can't search blogs", "error");
    return[];
 }
}
export default searchBlogs;
