import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
// const fetchPosts = async (): Promise<PostsDisplayDto[]> => {
//   const response = await api.get<PostsDisplayDto[]>('/Posts/all');
//   return response.data;
// };
const fetchPostsFeed = async ({ pageParam = 1 }): Promise<PostsDisplayDto[]> => {
  console.log('fetching page: ',pageParam);
  const response = await api.get<PostsDisplayDto[]>(`/Posts/feed`, {
    params: {
      pageNumber: pageParam,
      pageSize: 10,
    },
  });
  return response.data;
};
const usePosts = () => {
  return useInfiniteQuery<PostsDisplayDto[], Error>({
    queryKey: ['posts-feed'],
    queryFn: fetchPostsFeed,
   initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
  });
};

// const usePosts = () => { 
//   return useQuery<PostsDisplayDto[], Error>({
//     queryKey: ['posts'],
//     queryFn: fetchPosts,
//     staleTime: 1000 * 60 * 5, 
//     gcTime: 1000 * 60 * 10,  
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     retry: 2,
//   });
// };

export default usePosts;