  
  import React, { useState, useEffect, useCallback } from 'react';
import api from '../auth/api/axios';

interface CommentModalProps {
  post: { id: number; title: string };
  onClose: () => void;
}
interface CommentsDisplayDto {
  id: number;
   comment: string;
  authorName: string;
  createdAt: string;
  replies: CommentsDisplayDto[];
}

const CommentModal = ({ post, onClose }: CommentModalProps) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<CommentsDisplayDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/Comment/post/${post.id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  }, [post.id]);
  
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
  if (!commentInput.trim()) return;
    setLoading(true);
    try {
      await api.post('/Comment', {
        postId: post.id,
        comment: commentInput, 
        parentCommentId: null 
      });
      setCommentInput(''); 
      fetchComments(); 
    } catch (err) {
      alert("Failed to post comment");
    }finally {
      setLoading(false);
    }
  };

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h2 className="font-bold text-lg truncate">Comments on "{post.title}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl px-2">&times;</button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-blue-700">{c.authorName}</span>
                  <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{c.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm py-10">No comments yet. Start the conversation!</p>
          )}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
               onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 border border-transparent rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
            />
            <button 
              onClick={handlePostComment}
               disabled={loading || !commentInput.trim()}
              className="bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
        </div>
  );
};

export default CommentModal;