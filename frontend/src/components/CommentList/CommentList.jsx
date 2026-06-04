import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dateFormatter from "../../helpers/dateFormatter";
import deleteComment from "../../services/deleteComment";
import getComments from "../../services/getComments";
import toggleCommentLike from "../../services/toggleCommentLike";
import CommentAuthor from "./CommentAuthor";

function CommentList({ triggerUpdate, updateComments }) {
  const [comments, setComments] = useState([]);
  const { headers, isAuth, loggedUser } = useAuth();
  const { slug } = useParams();

  useEffect(() => {
    getComments({ slug, headers }).then(setComments).catch(console.error);
  }, [slug, triggerUpdate, headers]);

  const handleClick = (commentId) => {
    if (!isAuth) alert("You need to login first");

    const confirmation = window.confirm("Want to delete the comment?");
    if (!confirmation) return;

    deleteComment({ commentId, headers, slug })
      .then(updateComments)
      .catch(console.error);
  };

  const handleLike = (comment) => {
    if (!isAuth) return alert("You need to login first");

    const { id: commentId, liked, likeCount } = comment;

    // Optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked: !liked,
              likeCount: liked ? likeCount - 1 : likeCount + 1,
            }
          : c,
      ),
    );

    toggleCommentLike({ commentId, liked, slug, headers }).catch((error) => {
      console.error(error);
      // Revert on failure
      getComments({ slug, headers }).then(setComments).catch(console.error);
    });
  };

  return comments?.length > 0 ? (
    comments.map((comment) => {
      const { author, author: { username }, body, createdAt, id, liked, likeCount } = comment;
      return (
        <div className="card" key={id}>
          <div className="card-block">
            <p className="card-text">{body}</p>
          </div>
          <div className="card-footer">
            <CommentAuthor {...author} />
            <span className="date-posted">{dateFormatter(createdAt)}</span>
            {isAuth && (
              <button
                className={`btn btn-sm ${liked ? "btn-outline-primary active" : "btn-outline-primary"} pull-xs-right`}
                onClick={() => handleLike(comment)}
              >
                <i className="ion-heart"></i> <span className="counter">({likeCount})</span>
              </button>
            )}
            {isAuth && loggedUser.username === username && (
              <button
                className="btn btn-sm btn-outline-secondary pull-xs-right"
                onClick={() => handleClick(id)}
              >
                <i className="ion-trash-a"></i>
              </button>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div>There are no comments yet...</div>
  );
}

export default CommentList;
