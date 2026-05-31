import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export interface UrlItem {
  _id: string;
  originalUrl: string;
  shortCode: string;
  owner: string;
  isProtected: boolean;
  authorizedEmails: string[];
  clicks: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Fetch all URLs for the current user
export const useUrls = () => {
  return useQuery<UrlItem[]>({
    queryKey: ["urls"],
    queryFn: async () => {
      const response = await api.get("/api/url/my-urls");
      return response.data?.data || [];
    },
  });
};

// Create a new short URL
export const useCreateUrl = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UrlItem,
    Error,
    { originalUrl: string; isProtected: boolean; authorizedEmails?: string[] }
  >({
    mutationFn: async (data) => {
      const response = await api.post("/api/url/create", data);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
};

// Update an existing URL
export const useUpdateUrl = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UrlItem,
    Error,
    { id: string; originalUrl: string; isProtected: boolean; authorizedEmails?: string[] }
  >({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/api/url/${id}`, data);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
};

// Delete a short URL (with Optimistic Deletion)
export const useDeleteUrl = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string, { previousUrls: UrlItem[] | undefined }>({
    mutationFn: async (id) => {
      await api.delete(`/api/url/${id}`);
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["urls"] });

      // Snapshot the previous value
      const previousUrls = queryClient.getQueryData<UrlItem[]>(["urls"]);

      // Optimistically update the cache to remove the item
      if (previousUrls) {
        queryClient.setQueryData<UrlItem[]>(
          ["urls"],
          previousUrls.filter((url) => url._id !== deletedId)
        );
      }

      // Return a context object with the snapshotted value
      return { previousUrls };
    },
    onError: (_err, _deletedId, context) => {
      // Rollback to previous state on error
      if (context?.previousUrls) {
        queryClient.setQueryData(["urls"], context.previousUrls);
      }
    },
    onSettled: () => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
};
