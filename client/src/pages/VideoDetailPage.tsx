import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import "../styles/VideoDetailPage.scss";
import Comment, { comment } from "../components/Comment";
import { AiTwotoneLike, AiTwotoneDislike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  useGetRecommendedVideosQuery,
  useGetVideoDetailsQuery,
  useGetVideoReactionsQuery,
  useToggleDislikesMutation,
  useToggleLikesMutation,
} from "../redux/VideoAPI";
import { useNavigate, useParams } from "react-router-dom";
import useShowLoader from "../hooks/useShowLoader";
import { video } from "../components/Video";
import { formatPublishedDate, handleShowToast } from "../utils/utils";
import CommentInput from "../components/CommentInput";
import {
  useAddCommentMutation,
  useGetCommentsQuery,
} from "../redux/commentAPI";
import { useGetSubscriptionDetailsQuery, useSubscribeMutation, useUpdateWatchHistoryMutation } from "../redux/UserAPI";
import { skip } from "node:test";
import { SUBSCRIBE, UNSUBSCRIBE } from "../constants/Actions";
import Subscription from "../components/Subscription";

export interface commentInput{
  value:string;
  isVisible:boolean;
}
const initialComment:commentInput = {
  value: "",
  isVisible: false,
};

const VideoListItem = ({
  title,
  thumbnail,
  owner,
  views,
  createdAt,
  _id,
}: video) => {
  const navigate = useNavigate();
  return (
    <div
      className="videoListItem"
      key={_id}
      onClick={() => navigate(`/video/${_id}`)}
    >
      <img src={thumbnail} />

      <div>
        <h4>{title}</h4>
        <h5>{owner?.username}</h5>
        <div>
          <h6>{views} views</h6>
          <h6>{formatPublishedDate(createdAt)}</h6>
        </div>
      </div>
    </div>
  );
};

interface commentContainerProps {
  videoId: string;
}

function CommentContainer({ videoId }: commentContainerProps) {
  const { data: comments, isFetching } = useGetCommentsQuery(videoId);
  const [addComment] = useAddCommentMutation();
  const [comment, setComment] = useState(initialComment);

  const { user } = useSelector((state: RootState) => state.appState);
  useShowLoader(isFetching);
  const onCancel = (defaultComment:commentInput) => setComment(defaultComment);
  const onAddComment = async (
    commentText: string,
    parentComment: string | null
  ) => {
    const result = await addComment({
      comment: commentText,
      commentedBy: user.userId,
      videoId: videoId,
      parentComment: parentComment,
    });
    setComment(initialComment);
  };
  return (
    <section className="comment_section">
      <CommentInput
        value={comment?.value}
        avatar={user?.avatar}
        onInputChange={(e) =>
          setComment((prev) => ({
            ...prev,
            value: e.target.value,
          }))
        }
        onAddComment={() => onAddComment(comment.value, null)}
        onCancel={()=>onCancel(initialComment)}
      />

      <hr />
      {comments &&
        comments.map((comment: comment) => (
          <Comment commentData={comment} onAddComment={onAddComment}/>
        ))}
    </section>
  );
}

function VideoDetailPage() {
  const { videoID } = useParams();
  const { showSidebar,user } = useSelector((state: RootState) => state.appState);
  const { data, isFetching } = useGetVideoDetailsQuery(videoID);
  const { data: recommendedVideos, isFetching: isRecommendedVidFetchig } =
    useGetRecommendedVideosQuery(videoID);
    const {data:reactions}=useGetVideoReactionsQuery(videoID);
   const [toggleLikes] = useToggleLikesMutation();
   const [toggleDislikes]=useToggleDislikesMutation();
  const [updateWatchHistory] = useUpdateWatchHistoryMutation();
  const {data:subscriptionData,isFetching:isSubsFetching}=useGetSubscriptionDetailsQuery(data?.owner?._id,{skip:!data});
  const navigate=useNavigate();
  useShowLoader(isRecommendedVidFetchig || isFetching || isSubsFetching);
  const toggleDislike = async () => {
   await toggleDislikes(videoID);
  };
  const toggleLike = async () => {
     await toggleLikes(videoID);
  };

  useEffect(() => {
    async function watchHistoryUpdate() {
      await updateWatchHistory(videoID);
    }
    watchHistoryUpdate();
  }, [videoID]);

  return (
    <>
      <NavBar />
      <div
        className={`videoDetail container  ${showSidebar ? " overlay " : ""}`}
      >
        {/* Video Section */}
        <div>
          <div className="vidSection">
            <iframe
              width="100%"
              height="350px"
              src={data?.videoFile}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              frameBorder="0"
            ></iframe>
            <section className="videoDetails">
              <div className="video_title_reactions">
                <h4>{data?.title}</h4>
                <div className="reactions">
                  <div className="likes">
                    <span>{reactions?.totalLikes}</span>
                    <AiTwotoneLike
                      size="1.5rem"
                      onClick={toggleLike}
                      className={`reaction_icon ${reactions?.isLiked ? "liked" : ""}`}
                    />
                  </div>

                  <div className="dislikes">
                    <span>{reactions?.totalDislikes}</span>
                    <AiTwotoneDislike
                      size="1.5rem"
                      onClick={toggleDislike}
                      className={`reaction_icon ${reactions?.isDisliked ? "disliked" : ""}`}
                    />
                  </div>
                </div>
              </div>

              <div className="flx">
                <h6>{data?.views} Views </h6>
                <h6>{formatPublishedDate(data?.createdAt)}</h6>
              </div>
              <section className="channel_detail_section">
                <div>
                  <div>
                    <img src={data?.owner?.avatar} onClick={()=>navigate(`/channel/${data?.owner?.username}`)}/>
                    <div className="channel_detail">
                      <h5>{data?.owner?.username}</h5>
                      <h6>{subscriptionData?.SubscribersCount} Subscribers</h6>
                    </div>
                  </div>

                {data?.owner._id!==user.userId &&  <Subscription channelID={data?.owner?._id} isSubscribedTo={subscriptionData?.isSubscribedTo}/>}
                </div>
                <hr />
                <p>{data?.description}</p>
              </section>
            </section>

            <CommentContainer videoId={videoID || ""} />
          </div>

          {/* Video recommendatations */}
          <section className="video_recommendations">
            {recommendedVideos?.data?.map((video: video) => (
              <VideoListItem
                thumbnail={video?.thumbnail}
                title={video?.title}
                owner={video?.owner}
                views={video?.views}
                createdAt={video?.createdAt}
                key={video._id}
                _id={video._id}
                description={video.description}
              />
            ))}
          </section>
        </div>
        <SideBar />
      </div>
    </>
  );
}

export default VideoDetailPage;
