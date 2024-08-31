import { useSearchParams } from "react-router-dom";
import { SUBCRIPTION_DETAILS } from "../constants/Actions";
import ModalPopover from "./ModalPopover";
import { useCallback } from "react";
import { useGetSubscribersAndSubscriptionDetailsQuery } from "../redux/UserAPI";
import useShowLoader from "../hooks/useShowLoader";
import "../styles/SubscriptionPopover.scss";
import Subscription from "../components/Subscription";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    background: "#555555",
    borderRadius: "0.7rem",
    padding: "4rem",
    position: "absolute",
    right: "auto",
    bottom: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    opacity: 0.95,
    width: "max-content",
    maxHeight: "90%",
    overflowY: "auto",
  },
};
interface sub{
    avatar:string;
    fullName:string;
    username:string;
    _id:string;
}

function SubscriptionPopover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isFetching } =
    useGetSubscribersAndSubscriptionDetailsQuery(undefined);
  useShowLoader(isFetching);
  const onClose = useCallback(() => {
    searchParams.delete("popover");
    setSearchParams(searchParams);
  }, [searchParams]);

  const isCurrentUserSubscribed=(channelID:string)=>{
        const subbed= data?.subscribedTo.filter((sub:sub)=>sub._id===channelID);
        return subbed.length===0 ? false :true;
  }
  return (
    <ModalPopover
      isOpen={searchParams.get("popover") === SUBCRIPTION_DETAILS}
      onClose={onClose}
      style={customStyles}
    >
        {
            data?.subscribers.length==0 && <h5>No one has Subscribed to your channel.</h5>
        }
      <div className="flexCol subsList">
        {data?.subscribers.map((subscriber:sub) => (
          <div className="flex subs" key={subscriber?._id}>
            <img className="avatar" alt="avatar" src={subscriber.avatar} loading="lazy"  referrerPolicy="no-referrer"/>
            <div>
              <h4>{subscriber.fullName}</h4>
              <h6>{subscriber.username}</h6>
            </div>
            { <Subscription channelID={subscriber?._id} isSubscribedTo={isCurrentUserSubscribed(subscriber?._id)}/>}
          </div>
        ))}
      </div>
    </ModalPopover>
  );
}

export default SubscriptionPopover;
