const throttle = (fn: Function, wait: number = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

function formatPublishedDate(publishedAt: string) {
  const currentDate = new Date();
  const publishedDate = new Date(publishedAt);
  const timeDiffInMilliSeconds =
    currentDate.getTime() - publishedDate.getTime();
  const secondsDiff = timeDiffInMilliSeconds / 1000;
  const minuteDiff = secondsDiff / 60;
  const hoursDiff = minuteDiff / 60;
  const daysDiff = hoursDiff / 24;
  const monthsDiff = daysDiff / 30;
  const yearsDiff = daysDiff / 365;
  if (daysDiff < 1) {
    //minutes /seconds/hours
    if (hoursDiff < 1) {
      if (minuteDiff >= 1) {
        const minutes = Math.round(minuteDiff);
        return `${minutes} minutes ago`;
      } else {
        const seconds = Math.round(secondsDiff);
        return `${seconds} seconds ago`;
      }
    } else {
      const hours = Math.round(hoursDiff);
      return `${hours} hours ago`;
    }
  } else if (daysDiff > 365) {
    //years
    const years = Math.round(yearsDiff);
    return `${years} years ago`;
  } else if(daysDiff<30){
    const days = Math.round(daysDiff);
    return `${days} days ago`;
  }
  else {
    //months
    const months = Math.round(monthsDiff);
    return `${months} months ago`;
  }
}

export { throttle, formatPublishedDate };
