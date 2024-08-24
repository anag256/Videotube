const USERNAME_REGEX = /^[a-z0-9_.]{5,}$/;
const PASSWORD_REGEX =
  /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z\d])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HOME_PAGE_URL_REGEX = /^\/$/;
const MY_CONTENT_PAGE_URL_REGEX = /^\/channel\/[^\/]+\/?$/;
const LIKED_VIDEOS_POPOVER_PAGE_REGEX = /[\?&]popover=liked-videos(&|$)/;
const WATCH_HISTORY_POPOVER_PAGE_REGEX = /[\?&]popover=watch-history(&|$)/;
const SUBCRIPTION_DETAILS_POPOVER_PAGE_REGEX =
  /[\?&]popover=subscription-details(&|$)/;

export {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  HOME_PAGE_URL_REGEX,
  MY_CONTENT_PAGE_URL_REGEX,
  LIKED_VIDEOS_POPOVER_PAGE_REGEX,
  WATCH_HISTORY_POPOVER_PAGE_REGEX,
  SUBCRIPTION_DETAILS_POPOVER_PAGE_REGEX,
};
