import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType, User } from "@/types";
import { uploadFile } from "@/utils";
import axios from "axios";
import { ArrowLeft, Loader, UserIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const { loggedInUser, isLoggedInUserLoading, setLoggedInUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const [newUsername, setNewUsername] = useState<string>(
    loggedInUser?.username ? loggedInUser.username : ""
  );
  const [newImageUrl, setNewImageUrl] = useState<string>(
    loggedInUser?.image_url ? loggedInUser?.image_url : ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmittingImage, setIsSubmittingImage] = useState<boolean>(false);
  const [newBio, setNewBio] = useState<string | null>(
    loggedInUser?.bio ? loggedInUser.bio : null
  );
  const [newLocation, setNewLocation] = useState<string | null>(
    loggedInUser?.location ? loggedInUser.location : null
  );
  const [isPublicAccount, setIsPublicAccount] = useState<boolean>(
    loggedInUser?.is_public !== undefined ? loggedInUser.is_public : false
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (imageFile === null) return;

    const uploadSingleFileToServer = async () => {
      try {
        setIsSubmittingImage(true);
        const uploadedUrl = await uploadFile(imageFile);
        setNewImageUrl(uploadedUrl);
      } catch (error) {
        toast("failed to upload image");
      } finally {
        setIsSubmittingImage(false);
      }
    };

    uploadSingleFileToServer();
  }, [imageFile]);

  const handleEditUserProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const userNewUsername = newUsername.trim();
      const userNewBio = newBio ? newBio.trim() : null;
      const userNewLocation = newLocation ? newLocation.trim() : null;
      const userIsPublicAccount = isPublicAccount;

      const response = await axios.put<{
        success: boolean;
        message: string;
        updated_user: User;
      }>(
        `${API_URL}/api/user`,
        {
          username: userNewUsername,
          image_url: newImageUrl,
          bio: userNewBio,
          location: userNewLocation,
          is_public: userIsPublicAccount,
        },
        {
          withCredentials: true,
        }
      );
      setLoggedInUser(response.data.updated_user);
      toast("successfully edited profile");
    } catch (error) {
      toast("failed to edit user");
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center justify-start">
        <Link
          to={`/user/${loggedInUser?.id}/profile`}
          className="m-2 text-teal-500 font-bold flex items-center gap-2"
        >
          <ArrowLeft />
          <span>Back to profile</span>
        </Link>
      </div>
      <div className="flex flex-col border-2 rounded-lg p-4 mt-4 mx-2">
        <h1 className="font-semibold text-xl text-teal-500 mb-2">
          Edit Profile
        </h1>
        <Separator />
        <form
          onSubmit={(e) => handleEditUserProfile(e)}
          className="flex flex-col gap-4 my-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="imageUrl"
                className=" bg-teal-500 text-white p-3 rounded-lg"
              >
                Profile Image
              </Label>
              <input
                hidden
                accept=".png,.jpg,.jpeg"
                type="file"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
                id="imageUrl"
                name="imageUrl"
              />
            </div>
            {newImageUrl ? (
              <img className="rounded-full p-2 w-32 h-auto" src={newImageUrl} />
            ) : (
              <UserIcon />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              value={newUsername}
              name="username"
              id="username"
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              type="text"
              value={newBio ? newBio : ""}
              onChange={(e) => setNewBio(e.target.value)}
              name="bio"
              id="bio"
              placeholder="Enter bio"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              value={newLocation ? newLocation : ""}
              onChange={(e) => setNewLocation(e.target.value)}
              id="location"
              name="location"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic">public account</Label>
            <Checkbox
              id="isPublic"
              name="isPublic"
              checked={isPublicAccount}
              onCheckedChange={() => setIsPublicAccount((prev) => !prev)}
            />
          </div>

          <Button
            disabled={
              isSubmitting || isSubmittingImage || newUsername.trim() === ""
            }
            variant="default"
            className="bg-teal-500 text-white"
          >
            Edit
          </Button>
        </form>
      </div>
    </>
  );
};

export default EditProfilePage;
