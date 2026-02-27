import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../auth/api/axios';

type Props = {}

interface PostInteraction {
  likeCount: number;
  commentCount: number;
}
interface PostsDisplayDto {
  id: number;
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
  isVisible: boolean; 
  postInteraction: PostInteraction;
  imageUrls: string[];
}
const MyPosts = (props: Props) => {
 const navigate = useNavigate();
  const [posts, setPosts] = useState<PostsDisplayDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await api.get<PostsDisplayDto[]>('/Posts/user/history');
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch post history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'visible') return p.isVisible === true;
    if (activeFilter === 'hidden') return p.isVisible === false;
    return true; 
  });

  if (loading) return <div className="p-10 text-center font-semibold">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Posts</h1>
    
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          {(['all', 'visible', 'hidden'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-1.5 rounded-md text-sm capitalize transition-all duration-200 ${
                activeFilter === f 
                  ? 'bg-white text-blue-600 shadow-sm font-bold' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div 
            key={post.id} 
            className={`p-5 border rounded-xl bg-white shadow-sm flex justify-between items-center transition-colors ${
                !post.isVisible ? 'border-red-100 bg-red-50/40' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span 
                    className={`w-2.5 h-2.5 rounded-full ${post.isVisible ? 'bg-green-500' : 'bg-red-500'}`} 
                    title={post.isVisible ? "Visible" : "Hidden"}
                />
                <h3 className="font-bold text-gray-900 leading-tight">{post.title}</h3>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-1 max-w-xl">{post.description}</p>
              
              <div className="mt-3 flex items-center gap-4 text-xs font-medium text-gray-400">
                <span> {new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">👍 {post.postInteraction?.likeCount || 0} Likes</span>
                <span className="flex items-center gap-1">💬 {post.postInteraction?.commentCount || 0} Comments</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <button 
                onClick={() => navigate(`/social/edit/${post.id}`)}
                className="px-4 py-2 text-sm bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Edit
              </button>
              
              {!post.isVisible && (
                <span className="px-3 py-1 text-[10px] bg-red-100 text-red-700 rounded-full font-black uppercase tracking-wider">
                  Removed
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No posts found for the "{activeFilter}" filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;