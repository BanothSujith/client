import axios from "axios";
import store from "../reduxstore/Store";
import Message from "./Message";
import { setGalleryVideos, setVideos } from "../reduxstore/slices";

async function searchBlogs(search = "", path) {
  console.log(path)
  try {
    const endpoint = path === "/" ? "blogs" : "gallery";
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND_URI}/${endpoint}?q=${search}`,
      { withCredentials: true }
    );
    console.log("search response", response.data);
    if (response.data.blogs?.length == 0) {
      Message("No blogs Found", "warning");
    } else {
      store.dispatch(
        (endpoint === "blogs" ? setVideos : setGalleryVideos)(
          response.data?.blogs || response.data?.galleryBlogs
        )
      );
      Message("blogs searched seccusfully...!", "OK");
    }

    return response.data;
  } catch (error) {
    console.error("search error", error);
    Message("can't search blogs", "error");
    return [];
  }
}
export default searchBlogs;
