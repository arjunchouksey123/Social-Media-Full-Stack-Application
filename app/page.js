"use client";

import { useEffect, useState } from "react";
import GlobalApi from "./_utils/GlobalApi";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      createUserProfile();
    } else {
      router.push("/");
    }
  }, [user, isLoaded]);

  /**
   * Create a user profile when the user logs in.
   */
  const createUserProfile = async () => {
    if (localStorage.getItem("isLogin")) {
      router.push("/home");
      return;
    }

    try {
      setIsCreatingProfile(true);

      const data = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        image: user?.imageUrl,
      };

      const response = await GlobalApi.createUser(data);

      console.log("User profile created:", response.data);
      localStorage.setItem("isLogin", "true");

      router.push("/home");
    } catch (error) {
      console.error("Failed to create user profile:", error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  if (!isLoaded || isCreatingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Setting up your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.firstName || "User"}!
        </h1>

        <p className="text-gray-500">
          Your account is ready.
        </p>

        <UserButton />
      </div>
    </div>
  );
}