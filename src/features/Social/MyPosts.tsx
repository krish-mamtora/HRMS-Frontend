import React, { useEffect, useState, useMemo } from 'react';
import api from '../auth/api/axios';

const MyPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetchMyPosts = async () => {
    try {
      const response = await api.get('/Posts/user/history');
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch error", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyPosts(); }, []);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'visible') return posts.filter(p => p.isVisible);
    if (activeFilter === 'hidden') return posts.filter(p => !p.isVisible);
    return posts;
  }, [posts, activeFilter]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Id', editingPost?.id?.toString() || '');
    formData.append('Title', editingPost?.title || '');
    formData.append('Description', editingPost?.description || '');
    selectedFiles.forEach(file => formData.append('Images', file));

    try {
      await api.post('/Posts/upsert', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setIsModalOpen(false);
      setSelectedFiles([]);
      fetchMyPosts();
    } catch (err) { alert("Update failed"); }
  };

  if (loading) return <div className="p-10 text-center ">Loading your history...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Posts</h1>
        <div className="flex bg-gray-100 p-1 rounded-xl border">
          {(['all', 'visible', 'hidden'] as const).map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-lg text-sm capitalize transition-all ${activeFilter === f ? 'bg-white shadow-md text-blue-600 ' : 'text-gray-500'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className={`p-6 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 ${!post.isVisible && 'border-red-100 bg-red-50/20'}`}>
            
            {post.imageUrls?.length > 0 && (
              <div className="w-full md:w-48 flex-shrink-0 grid grid-cols-2 gap-2">
                {post.imageUrls.slice(0, 4).map((url: string, idx: number) => (
                  <img key={idx} src={url} alt="post" className="w-full h-20 object-cover rounded-lg border border-gray-100" />
                ))}
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${post.isVisible ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                  <h3 className="text-xl  text-gray-900">{post.title}</h3>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-5 text-sm font-semibold text-gray-400">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">👍 {post.postInteraction?.likeCount || 0}</span>
                  <span className="flex items-center gap-1">💬 {post.postInteraction?.commentCount || 0}</span>
                </div>
                <div className="flex gap-2">
                  {!post.isVisible && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-black uppercase">Removed</span>}
                  <button onClick={() => { setEditingPost(post); setIsModalOpen(true); }} className="px-5 py-2 bg-blue-600 text-white rounded-xl  hover:bg-blue-700 transition-colors">Edit Post</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Edit Post</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs  uppercase text-gray-400 mb-1 ml-1">Title</label>
                <input className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs  uppercase text-gray-400 mb-1 ml-1">Description</label>
                <textarea className="w-full border-2 border-gray-100 rounded-xl p-3 h-32 focus:border-blue-500 outline-none transition-colors" value={editingPost.description || ''} onChange={e => setEditingPost({...editingPost, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs  uppercase text-gray-400 mb-1 ml-1">Update Images</label>
                <input type="file" multiple onChange={e => setSelectedFiles(Array.from(e.target.files || []))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl  shadow-lg shadow-blue-200">Save Changes</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-50 text-gray-500 py-3 rounded-xl ">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;