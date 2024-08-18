import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Video, { video } from "../components/Video";
import "../styles/HomePage.scss";
import { RootState } from "../redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetPaginatedVideosQuery } from "../redux/VideoAPI";
import useShowLoader from "../hooks/useShowLoader";

function HomePage() {
  const { showSidebar } = useSelector((state: RootState) => state.appState);
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
          console.log("visible");
          setPage((prev) => prev + 1);
        }
      },{threshold:1});
      if (node) observer.current.observe(node);
      console.log("node", node);
    },
    [hasMore, isFetching]
  );

  useEffect(() => {
    if (data && !isFetching) {
      setHasMore(data?.totalVideos> data?.currentPage*data?.limit)
      console.log("data.videos.length",data?.totalVideos,videos.length)
      setVideos((prev) => [...prev, ...data?.videos] as any);

    }
    console.log("data.videos.length",data?.videos?.length);
  }, [isFetching, data]);

  // useEffect(()=>{
  //   setHasMore(data?.totalVideos>videos.length)
  // },[videos])

  return (
    <>
      <NavBar />
      <div className={`container home  ${showSidebar ? "overlay" : ""}`}>
        <div className="videos">
          {videos?.map((video: video,index:number) => {
            {console.log("index",index,data?.totalVideos-1)}
            {console.log("test",data?.totalVideos-1===index)}
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
        <SideBar />
      </div>
    </>
  );
}

export default HomePage;
