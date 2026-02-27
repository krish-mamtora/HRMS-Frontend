import React, { useState } from 'react';
import usePosts, { type PostsDisplayDto } from './hooks/usePosts'
import { useNavigate } from 'react-router-dom';
import api from '../auth/api/axios';
import CommentModal from './CommentModal';

const Social = () => {
  const navigate = useNavigate();
  const addPost = () =>{
      navigate('create');
  }
  const MyPosts = ()=>{
    navigate('myposts');
  }
  const { data: posts, isLoading, isError, error , refetch  } = usePosts();
  console.log(posts);
  const [selectedPost, setSelectedPost] = useState<PostsDisplayDto | null>(null);
  const [postToDelete, setPostToDelete] = useState<PostsDisplayDto | null>(null);
  const currentUser = localStorage.getItem('role');
  const [deletionReason, setDeletionReason] = useState('');
  const isHR = (currentUser  === 'HR');

    const handleDeletePost = async () => {
        if (!postToDelete || !deletionReason.trim()) return;

        const currentUserId = parseInt(localStorage.getItem('id') || '0', 10);

        try {
            const response = await api.delete(`/Posts/${postToDelete.id}`, {
            params: { 
                userId: currentUserId,
                reason: deletionReason 
            }
            });
            alert("Post Deleted and User Notified");
            console.log("Delete response:", response.data);
            setPostToDelete(null);
            setDeletionReason('');
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Failed to delete post.");
        }
  };
    const handleReaction = async (postId: number, reactionType: string) => {
    try {
      
      await api.post('/Posts/react', {
        postId: postId,
        reactionType: reactionType,
        isActive: true 
      });
        refetch(); 
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10 font-semibold">Loading feed...</div>;
  if (isError) return <div className="text-red-500 text-center p-10">Error: {error.message}</div>;
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <button onClick={()=>addPost()} className="mt-2 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">Create Post</button>
       <button onClick={()=>MyPosts() } className="mt-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">My Posts</button>
      <div className="max-w-xl mx-auto space-y-6">

        {posts?.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center p-4">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {post.authorName[0]?.toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-900">{post.authorName}</p>
                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
             {isHR && (
                <button
                  onClick={() => setPostToDelete(post)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  title="Delete Post (HR Action)"
                >
                  Delete
                </button>
              )}
            <div className="px-4 pb-2">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-gray-700 text-sm mt-1">{post.description}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {post.tagNames.map((tag, idx) => (
                  <span key={idx} className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {post.imageUrls.length > 0 && (
              <div className={`grid gap-0.5 border-y border-gray-100 bg-black ${post.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {post.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    //   src={`http://localhost:5000/uploads/${url}`}
                    alt="Post media"
                    className="w-full aspect-square object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            )}


            <div className="flex items-center gap-4 p-3 px-4 border-t border-gray-50">
                 <button 
                        onClick={() => handleReaction(post.id, "Like")}
                        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors group"
                    >
                        <span className="text-xl mr-1.5 group-hover:scale-110 transition-transform">👍</span>
                        <span className="text-sm font-semibold">{post.postInteraction?.likeCount || 0}</span>
                    </button>

                 <button 
                    onClick={() => handleReaction(post.id, "Celebrate")}
                        className="flex items-center text-gray-500 hover:text-yellow-500 transition-colors group"
                    >
                        <span className="text-xl mr-1.5 group-hover:scale-110 transition-transform">👏</span>
                        <span className="text-sm font-semibold">{post.postInteraction?.celebrateCount || 0}</span>
                    </button>
                 <button 
                        onClick={() => handleReaction(post.id, "Love")}
                        className="flex items-center text-gray-500 hover:text-red-500 transition-colors group"
                    >
                        <span className="text-xl mr-1.5 group-hover:scale-110 transition-transform">❤️</span>
                        <span className="text-sm font-semibold">{post.postInteraction?.loveCount || 0}</span>
                    </button>
                   <button 
                        onClick={() => handleReaction(post.id, "Insightful")}
                        className="flex items-center text-gray-500 hover:text-purple-600 transition-colors group"
                    >
                        <span className="text-xl mr-1.5 group-hover:scale-110 transition-transform">💡</span>
                        <span className="text-sm font-semibold">{post.postInteraction?.insightfulCount || 0}</span>
                    </button>
               <button 
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center text-gray-500 hover:text-green-600 transition-colors ml-auto group"
                >
                    <span className="text-xl mr-1.5 group-hover:scale-110 transition-transform">💬</span>
                    <span className="text-sm font-semibold">{post.postInteraction?.commentCount || 0}</span>
                </button>
            </div>

          </div>
        ))}
        {posts?.length === 0 && (
          <div className="text-center text-gray-500">No posts visible yet.</div>
        )}
      </div>
      
        {selectedPost && (
        <CommentModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-xl mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete the post titled "{postToDelete.title}"? Enter reason</p>
              <textarea
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                placeholder="Enter reason for deletion (e.g., policy violation)"
                className="w-full p-2 border rounded-md focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
              <button
                onClick={() => { setPostToDelete(null); setDeletionReason(''); }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={!deletionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Social;