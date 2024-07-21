import { useCallback, useEffect, useState } from "react";
import { throttle } from "../utils/utils";

type direction = "up" | "down";

const useScroll = () => {
  const [direction, setDirection] = useState<direction>("up");
  const onScroll = useCallback(() => {
    const dir = prevScrollY > window.scrollY ? "up" : "down";
    setDirection(dir);
    prevScrollY = window.scrollY;
  }, [window.scrollY]);
  const throttedOnScroll = throttle(onScroll, 500);
  let prevScrollY = 0;
  useEffect(() => {
    document.addEventListener("scroll", throttedOnScroll);
    return () => {
      document.removeEventListener("scroll", throttedOnScroll);
    };
  }, []);
  return { direction };
};

export default useScroll;
