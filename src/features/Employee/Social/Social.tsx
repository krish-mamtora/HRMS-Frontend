import React, { useState } from 'react';
import usePosts, { type PostsDisplayDto } from './hooks/usePosts';
import { useNavigate } from 'react-router-dom';

const Social = () => {
  const navigate = useNavigate();
  const addPost = () =>{
      navigate('create');
  }
  const { data: posts, isLoading, isError, error } = usePosts();
  const [selectedPost, setSelectedPost] = useState<PostsDisplayDto | null>(null);

  if (isLoading) return <div className="flex justify-center p-10 font-semibold">Loading feed...</div>;
  if (isError) return <div className="text-red-500 text-center p-10">Error: {error.message}</div>;
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <button onClick={()=>addPost()}>Create Post</button>
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
                      src={`http://localhost:5000/uploads/${url}`}
                    alt="Post media"
                    className="w-full aspect-square object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            )}


            <div className="flex items-center gap-4 p-3 px-4 border-t border-gray-50">
              <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                <span className="text-xl mr-1">👍</span>
                <span className="text-sm font-semibold">{post.likeCount}</span>
              </button>
              
              <button 
                onClick={() => setSelectedPost(post)}
                className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
              >
                <span className="text-xl mr-1">💬</span>
                <span className="text-sm font-semibold">{post.commentCount}</span>
              </button>
            </div>

          </div>
        ))}
        {posts?.length === 0 && (
          <div className="text-center text-gray-500">No posts visible yet.</div>
        )}
      </div>
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">Comments on "{selectedPost.title}"</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-black text-2xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="p-6 h-64 overflow-y-auto bg-gray-50">
              <p className="text-center text-gray-400 text-sm">No comments yet. Be the first to join the discussion!</p>
            </div>
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button className="text-blue-600 font-bold px-2">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Social;