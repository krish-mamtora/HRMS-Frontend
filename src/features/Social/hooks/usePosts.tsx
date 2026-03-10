import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../auth/api/axios';

export interface PostInteractionDisplayDto {
  postId: number;
  likeCount: number;
  celebrateCount: number;
  loveCount: number;
  insightfulCount: number;
  commentCount: number;
  lastUpdatedAt: string;
}

export interface PostsDisplayDto {
  id: number;
  title: string;
  description: string;
  isSystemGenerated: boolean;
  authorName: string;
  imageUrls: string[];
  tagNames: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
   interactions: PostInteractionDisplayDto | null;
}
const fetchPostsFeed = async ({ pageParam = 1 }): Promise<PostsDisplayDto[]> => {
  
  console.log('fetching page: ',pageParam);
  const response = await api.get<PostsDisplayDto[]>(`/Posts/feed`, {
    params: {
      pageNumber: pageParam,
      pageSize: 10,
    },
  });
  const posts = response.data;

 const postsWithCommentCounts = await Promise.all(
    posts.map(async (post) => {
      try {
        const countRes = await api.get<number>(`/Comment/commentcount/${post.id}`);
        
        return {
          ...post,
          commentCount: countRes.data 
        };
      } catch (error) {
        console.error(`Failed to fetch count for post ${post.id}`, error);
        return { ...post, commentCount: 0 }; 
      }
    })
  );

  return postsWithCommentCounts;
};

// export const usePosts = () => {
//   return useInfiniteQuery<PostsDisplayDto[], Error>({
//     queryKey: ['posts-feed'],
//     queryFn: fetchPostsFeed,
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, allPages) => {
//       return lastPage.length === 10 ? allPages.length + 1 : undefined;
//     },
//   });
// };
export const usePosts = (filters: any) => {
  return useInfiniteQuery<PostsDisplayDto[], Error>({
    queryKey: ['posts-feed', filters],

    initialPageParam: 1,

    queryFn: ({ pageParam = 1 }) =>
      api.get('/Posts/feed', {
        params: {
          pageNumber: pageParam,
          pageSize: 10,
          search: filters.searchQuery,
          tag: filters.selectedTag,
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      }).then(res => res.data),

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    }
  });
};
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/Posts/upsert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts-feed'] });
    },
  });
};
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/Posts/upsert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts-feed'] });
    },
    onError: (error: any) => {
        const serverMessage = error.response?.data?.message || "Submission failed.";
        alert(serverMessage);
    }
  });
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      await api.delete(`/Posts/my-post/${postId}`);
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts-feed'] });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || "Submission failed.";
      alert(serverMessage);
    }
  });
};
export const useRestorePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const res = await api.put(`/Posts/restore/${postId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts-feed'] });
    },
  });
};
// export default usePosts;