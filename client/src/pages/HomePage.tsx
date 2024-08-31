import Video, { video } from "../components/Video";
import "../styles/HomePage.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetPaginatedVideosQuery } from "../redux/VideoAPI";
import useShowLoader from "../hooks/useShowLoader";
import withNavSideBar from "../hoc/withNavSideBar";

function HomePage() {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const { data, isLoading ,isFetching} = useGetPaginatedVideosQuery({ page, limit: 4 });

  const observer = useRef<IntersectionObserver | null>(null);
  useShowLoader(isLoading);
  const lastVideoElementRef = useCallback(
    (node: any) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },{threshold:1});
      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching]
  );

  useEffect(() => {
    if (data && !isFetching) {
      setHasMore(data?.totalVideos> data?.currentPage*data?.limit)
      setVideos((prev) => [...prev, ...data?.videos] as any);

    }
  }, [isFetching, data]);


  return (
    <>
        <div className="videos">
          {videos?.map((video: video,index:number) => {
            return (
              <Video
                key={video._id}
                title={video.title}
                description={video.description}
                owner={video.owner}
                views={video.views}
                createdAt={video.createdAt}
                _id={video._id}
                thumbnail={video.thumbnail}
                {...(videos.length-1===index && { ref: lastVideoElementRef })}
              />
            );
          })}
        </div>
    </>
  );
}

export default withNavSideBar(HomePage,{className:'home'});
