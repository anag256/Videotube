import { Dispatch } from "@reduxjs/toolkit";
import { EMAIL, PASSWORD, USERNAME } from "../constants/LoginFormConstants";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from "../constants/Regex";
import {
  EMAIL_VALIDATION_ERROR,
  PASSWORD_VALIDATION_ERROR,
  USERNAME_VALIDATION_ERROR,
} from "../constants/ValidationErrors";
import { setToastData } from "../redux/appState";
import { AppDispatch } from "../redux/store";
import { createSearchParams } from "react-router-dom";

export type field = "username" | "password" | "email";
type popoverType = "liked-videos" | "watch-history" | "subscription-details" | "video-upload-form";

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

const preventDefaultEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  e.stopPropagation();
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
  } else if (daysDiff < 30) {
    const days = Math.round(daysDiff);
    return `${days} days ago`;
  } else {
    //months
    const months = Math.round(monthsDiff);
    return `${months} months ago`;
  }
}

function isFieldValid(value: string, regex: RegExp) {
  return regex.test(value);
}

function validateField(field: field, value: string) {
  switch (field) {
    case USERNAME:
      return isFieldValid(value, USERNAME_REGEX);
    case PASSWORD:
      return isFieldValid(value, PASSWORD_REGEX);
    case EMAIL:
      return isFieldValid(value, EMAIL_REGEX);
    default:
      return false;
  }
}

const validationErrorMessages = {
  username: USERNAME_VALIDATION_ERROR,
  password: PASSWORD_VALIDATION_ERROR,
  email: EMAIL_VALIDATION_ERROR,
};

function handleShowToast(dispatch: AppDispatch, result: any) {
  if (
    "error" in result &&
    "data" in result.error &&
    "message" in result.error.data
  ) {
    dispatch(
      setToastData({
        toast: {
          isVisible: true,
          status: "error",
          message: result?.error?.data?.message,
        },
      })
    );
  }

  if ("data" in result) {
    dispatch(
      setToastData({
        toast: {
          isVisible: true,
          status: "success",
          message: result?.data.message,
        },
      })
    );
  }
}
const popoverPath = (popoverType: popoverType) => ({
  pathname: location.pathname,
  search: createSearchParams({
    popover: popoverType,
  }).toString(),
});

export {
  throttle,
  formatPublishedDate,
  validateField,
  validationErrorMessages,
  preventDefaultEvent,
  handleShowToast,
  popoverPath,
};
