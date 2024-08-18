import ModalPopover from "./ModalPopover";
import { useState } from "react";
import { Field } from "../commonTypes";
import { preventDefaultEvent } from "../utils/utils";
import { useUploadVideoMutation } from "../redux/VideoAPI";
import useShowLoader from "../hooks/useShowLoader";
import { useDispatch } from "react-redux";
import { setToastData, toggleVideoUploadpopup } from "../redux/appState";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "../styles/videoUploadForm.scss";

interface VideoData {
  title: string;
  description: string;
  thumbnail: File | null;
  videoPath: string;
  isPublished: boolean;
}
const initialVideoFormData = {
  title: "",
  description: "",
  thumbnail: null,
  videoPath: "",
  isPublished: true,
};

const YT_EMBED_URL = "https://www.youtube.com/embed/";

function VideoUploadForm() {
  const [videoFormData, setVideoFormData] =
    useState<VideoData>(initialVideoFormData);
  const { showVideoUploadPopup } = useSelector(
    (state: RootState) => state.appState
  );

  const [uploadVid, { isLoading, isError, error, isSuccess }] =
    useUploadVideoMutation();
  const dispatch = useDispatch();
  useShowLoader(isLoading);
  const videoUploadFormFields: Field[] = [
    {
      type: "text",
      name: "title",
      placeholder: "Title*",
      value: videoFormData.title,
      isRequired: true,
    },
    {
      type: "textarea",
      name: "description",
      placeholder: "Description*",
      value: videoFormData.description,
      isRequired: true,
    },
    {
      type: "file",
      name: "thumbnail",
      placeholder: "Thumbnail*",
      file: videoFormData.thumbnail,
      isRequired: true,
    },
    {
      type: "text",
      name: "videoPath",
      placeholder: "Paste the Youtube Video Path here",
      value: videoFormData.videoPath,
      isRequired: true,
    },
  ];

  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    let { value, name, type, files } = e.target as HTMLInputElement;
    console.log("value", type !== "file" ? value : (files as FileList)[0]);
    console.log("name", name);
    if (name === "videoPath" && value && value !== "") {
      value = value.includes("embed")
        ? value
        : [YT_EMBED_URL, value.split("&")[0].split("=")[1]].join("");
    }
    setVideoFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type !== "file" ? value : (files as FileList)[0],
    }));
  };

  const SwitchInputTypes = (field: Field) => {
    const { type, name, placeholder, value, isRequired } = field;
    switch (type) {
      case "file":
        return (
          <div>
            <label htmlFor="file-upload" className="custom-file-upload">
              {(videoFormData[name as keyof VideoData] as File)?.name
                ? (videoFormData[name as keyof VideoData] as File)?.name
                : placeholder}
              <input
                type="file"
                className="file_upload"
                name={name}
                onChange={onChange}
                accept="image/*"
              />
            </label>
          </div>
        );
      case "textarea":
        return (
          <textarea
            rows={8}
            cols={50}
            name={name}
            value={value}
            required={isRequired}
            placeholder={placeholder}
            onChange={onChange}
          />
        );
      default:
        return (
          <div>
            <input
              type={type}
              name={name}
              value={value}
              required={isRequired}
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>
        );
    }
  };

  const resetFields = () => {
    setVideoFormData(initialVideoFormData);
  };

  const onUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    preventDefaultEvent(e);
    const result: any = await uploadVid(videoFormData);
    console.log("isError", isError, error);
    console.log("isSuccess", isSuccess);
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
    resetFields();
    dispatch(toggleVideoUploadpopup());
  };

  if (!showVideoUploadPopup) return;
  return (
    <ModalPopover isOpen onClose={() => dispatch(toggleVideoUploadpopup())}>
      <form className="video-upload">
        {videoUploadFormFields.map((field: Field, index: number) => (
          <div key={index}>{SwitchInputTypes(field)}</div>
        ))}
        <button
          type="submit"
          className="btn bluebg"
          onClick={onUpload}
          disabled={Object.values(videoFormData).some(
            (item) => item === "" || !item
          )}
        >
          Upload Video
        </button>
      </form>
    </ModalPopover>
  );
}

export default VideoUploadForm;
