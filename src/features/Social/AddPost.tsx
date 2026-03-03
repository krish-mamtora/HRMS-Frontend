import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../auth/api/axios';

type TagsDisplayDto = {
  id: number;
  tagName: string;
};

type PostsCreateUpdateDto = {
  title: string;
  description: string;
  images: FileList | null;
  tagIds: number[]; 
};

const AddPost = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<TagsDisplayDto[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PostsCreateUpdateDto>();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get<TagsDisplayDto[]>('/Posts/tags');
        setTags(response.data);
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };
    fetchTags();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const onSubmit: SubmitHandler<PostsCreateUpdateDto> = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('Title', data.title);
    formData.append('Description', data.description);

    selectedTags.forEach(id => formData.append('TagIds', id.toString()));

    selectedImageFiles.forEach(file => {
      formData.append('Images', file);
    });

    try {
      await api.post('/Posts/upsert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Success! Your post is live.');
      navigate('/hr/social');
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Error creating post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-700 hover:text-black flex items-center text-sm font-bold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feed
          </button>
          <h2 className="text-xl font-extrabold text-gray-900">New Achievement</h2>
          <div className="w-20"></div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Post Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                placeholder="What's the big news?"
                className="w-full text-xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-400"
              />
              <div className="h-px bg-gray-300 mt-2"></div>
              {errors.title && <p className="text-red-600 text-xs mt-1 font-bold">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Description</label>
              <textarea
                {...register('description', { required: 'A description is helpful' })}
                rows={4}
                placeholder="Tell everyone about it..."
                className="w-full text-base font-medium text-gray-800 border-none focus:ring-0 p-0 placeholder-gray-400 resize-none"
              />
              <div className="h-px bg-gray-300 mt-2"></div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">Add Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'bg-blue-700 border-blue-700 text-white shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500 shadow-sm'
                    }`}
                  >
                    #{tag.tagName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">Upload Images</label>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img src={src} className="h-full w-full object-cover" alt="preview" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] mt-1 font-black uppercase">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-blue-800 disabled:bg-gray-400 transition-all transform active:scale-95"
              >
                {isSubmitting ? 'Publishing...' : 'Post Achievement'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;