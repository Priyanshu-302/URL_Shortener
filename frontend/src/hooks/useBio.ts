import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { type UrlItem } from "./useUrls";

export interface BioProfileData {
  _id: string;
  owner: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: "minimal" | "midnight" | "sunset" | "neon";
  links: string[] | UrlItem[];
  socials: {
    instagram: string;
    twitter: string;
    github: string;
    linkedin: string;
    youtube: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useBioProfile = () => {
  return useQuery<BioProfileData>({
    queryKey: ["bio-profile"],
    queryFn: async () => {
      const response = await api.get("/api/bio/my-profile");
      return response.data?.data;
    },
  });
};

export const useUpdateBioProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<BioProfileData, Error, Partial<BioProfileData>>({
    mutationFn: async (data) => {
      const response = await api.put("/api/bio/update", data);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio-profile"] });
    },
  });
};

export interface PublicBioData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: "minimal" | "midnight" | "sunset" | "neon";
  socials: {
    instagram: string;
    twitter: string;
    github: string;
    linkedin: string;
    youtube: string;
  };
  links: {
    _id: string;
    title: string;
    shortCode: string;
    isProtected: boolean;
    isPasswordProtected: boolean;
  }[];
}

export const usePublicBioProfile = (username: string) => {
  return useQuery<PublicBioData>({
    queryKey: ["public-bio-profile", username],
    queryFn: async () => {
      const response = await api.get(`/api/bio/public/${username}`);
      return response.data?.data;
    },
    enabled: !!username,
    retry: false,
  });
};
