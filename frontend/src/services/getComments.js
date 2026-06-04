import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getComments({ slug, headers }) {
  try {
    const { data } = await axios({ url: `api/articles/${slug}/comments`, headers });

    return data.comments;
  } catch (error) {
    errorHandler(error);
  }
}

export default getComments;
