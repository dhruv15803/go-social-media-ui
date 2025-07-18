import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType, PostWithUserAndImages } from "@/types";
import { ImageIcon, Loader, UserIcon, XCircle } from "lucide-react";
import { useContext, useEffect, useState, type SetStateAction } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { uploadFile } from "@/utils";
import { toast } from "react-toastify";
import { Label } from "./ui/label";
import axios from "axios";
import { API_URL } from "@/App";

type Props = {
  parentPostId?: number;
  setRefetchPostsFlag: React.Dispatch<SetStateAction<boolean>>;
  onCreateComment?: () => void;
};

const CreatePost = ({
  parentPostId,
  setRefetchPostsFlag,
  onCreateComment,
}: Props) => {
  const isChildPost = parentPostId !== undefined;
  const localPostImageUrls = !isChildPost
    ? JSON.parse(
        localStorage.getItem("create_post_image_urls") !== null
          ? localStorage.getItem("create_post_image_urls")!
          : `[]`
      )
    : JSON.parse(
        localStorage.getItem(`create_comment_image_urls_${parentPostId}`) !==
          null
          ? localStorage.getItem(`create_comment_image_urls_${parentPostId}`)!
          : `[]`
      );
  const { loggedInUser, isLoggedInUserLoading, setIsLoginModalOpen } =
    useContext(AuthContext) as AuthContextType;
  const [postContent, setPostContent] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false);
  const [postImageUrls, setPostImageUrls] =
    useState<string[]>(localPostImageUrls);
  const [isPostSubmitting, setIsPostSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (imageFiles === null) return;

    const uploadImageFilesToServer = async () => {
      try {
        setIsUploadingFiles(true);

        const imageFilesArr = Array.from(imageFiles);

        const uploadedUrlPromises = imageFilesArr.map(async (file) => {
          let retryCount = 0;
          let uploadedUrl: string | undefined = undefined;

          while (retryCount < 3) {
            try {
              uploadedUrl = await uploadFile(file);
              break;
            } catch (error) {
              retryCount++;
            }
          }

          if (retryCount === 3 || uploadedUrl === undefined) {
            throw new Error("failed to upload file to server");
          }

          return uploadedUrl;
        });

        const uploadedUrls = await Promise.all(uploadedUrlPromises);
        setPostImageUrls((prev) => [...prev, ...uploadedUrls]);
        setImageFiles(null);
      } catch (error: any) {
        toast(error.response.data.message);
      } finally {
        setIsUploadingFiles(false);
      }
    };

    uploadImageFilesToServer();
  }, [imageFiles]);

  useEffect(() => {
    if (isChildPost) {
      localStorage.setItem(
        `create_comment_image_urls_${parentPostId}`,
        JSON.stringify(postImageUrls)
      );
    } else {
      localStorage.setItem(
        "create_post_image_urls",
        JSON.stringify(postImageUrls)
      );
    }
  }, [postImageUrls]);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedInUser) {
      setIsLoginModalOpen(true);
      return;
    }

    const isPostWithImages = postImageUrls.length !== 0;

    try {
      setIsPostSubmitting(true);

      const reqUrl: string = isChildPost
        ? `${API_URL}/api/post/${parentPostId}`
        : `${API_URL}/api/post`;
      const createPostBody = isPostWithImages
        ? {
            post_content: postContent.trim(),
            post_image_urls: postImageUrls,
          }
        : {
            post_content: postContent.trim(),
          };

      const response = await axios.post<{
        success: boolean;
        message: string;
        post: PostWithUserAndImages;
      }>(reqUrl, createPostBody, {
        withCredentials: true,
      });

      console.log(response);
      setPostContent("");
      setPostImageUrls([]);
      setRefetchPostsFlag((prev) => !prev);

      if (isChildPost && onCreateComment) {
        onCreateComment();
      }
    } catch (error) {
      toast("failed to create post");
    } finally {
      setIsPostSubmitting(false);
    }
  };

  const handleRemovePostImageUrl = (idx: number) => {
    const newPostImageUrls = postImageUrls.filter((_, index) => index !== idx);
    setPostImageUrls(newPostImageUrls);
  };

  if (isLoggedInUserLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="border-2 rounded-lg p-4 flex flex-col">
        <div className="flex items-center gap-2">
          {loggedInUser !== null &&
          loggedInUser?.image_url !== null &&
          loggedInUser?.image_url !== "" ? (
            <img
              src={loggedInUser?.image_url}
              className="rounded-full w-12 h-12"
            />
          ) : (
            <UserIcon />
          )}
          <span className="font-semibold">
            @{loggedInUser?.username ? loggedInUser.username : "guest123"}
          </span>
        </div>

        {isUploadingFiles ? (
          <>
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full overflow-x-auto gap-2 mt-4">
              {postImageUrls.length !== 0 &&
                postImageUrls.map((imageUrl, idx) => {
                  return (
                    <div
                      key={idx}
                      className="w-1/4 min-w-32 h-fit flex flex-col"
                    >
                      <div className="flex items-center justify-end relative left-4 top-2">
                        <button
                          onClick={() => handleRemovePostImageUrl(idx)}
                          className=""
                        >
                          <XCircle className="text-teal-500" />
                        </button>
                      </div>
                      <img
                        src={imageUrl}
                        className="w-full aspect-auto rounded-lg"
                      />
                    </div>
                  );
                })}
            </div>
          </>
        )}

        <form
          onSubmit={(e) => handleCreatePost(e)}
          className="flex flex-col gap-2 my-2"
        >
          <div className="flex flex-col gap-1">
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={isChildPost ? "Write Comment" : "Write Post"}
            />
            <input
              hidden
              multiple
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={(e) => setImageFiles(e.target.files)}
              name="imageFile"
              id="imageFile"
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="imageFile">
                <ImageIcon />
              </Label>
            </div>
          </div>
          <Button
            disabled={isPostSubmitting || postContent.trim() === ""}
            className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
            variant="default"
          >
            Create
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
