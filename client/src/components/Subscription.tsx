import { SUBSCRIBE, UNSUBSCRIBE } from "../constants/Actions";
import { useSubscribeMutation } from "../redux/UserAPI";
import { useDispatch } from "react-redux";
import { handleShowToast } from "../utils/utils";

interface SubscriptionProps {
  channelID: string;
  isSubscribedTo: boolean;
}
function Subscription({ channelID, isSubscribedTo }: SubscriptionProps) {
  const [toggleSubscribe] = useSubscribeMutation();
  const dispatch = useDispatch();
  const onToggleSubscribe = async () => {
    const result = await toggleSubscribe({
      channelID,
      action: isSubscribedTo ? UNSUBSCRIBE : SUBSCRIBE,
    });

 handleShowToast(dispatch,result);
  };
  return (
    <button
      className={`btn bluebg ${isSubscribedTo && "bgRed"}`}
      onClick={onToggleSubscribe}
    >
      {!isSubscribedTo ? SUBSCRIBE : UNSUBSCRIBE}
    </button>
  );
}

export default Subscription;
