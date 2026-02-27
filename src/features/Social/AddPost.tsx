import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import api from '../auth/api/axios';

type Props = {}

type PostsCreateUpdateDto = {
  id?: number;
  title: string;
  description: string;
  isVisible: boolean;
  isSystemGenerated: boolean;
  images: FileList | null; 
  tagIds: string;
};

const AddPost = (props: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PostsCreateUpdateDto>({
    defaultValues: {
      isVisible: true,
      isSystemGenerated: false,
      title: '',
      description: '',
      tagIds: ''
    }
  });
   const onSubmit:  SubmitHandler<PostsCreateUpdateDto> = async(data) => {
    const formData = new FormData();

    if (data.id) formData.append('Id', data.id.toString());
     if (data.id) formData.append('Id', data.id.toString());
    formData.append('Title', data.title);
    formData.append('Description', data.description);

    const tagIdsArray = data.tagIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    tagIdsArray.forEach(id => formData.append('TagIds', id.toString()));


    if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
            formData.append('Images', data.images[i]);
        }
    }
    
    console.log('Submitting Form Data:', Object.fromEntries(formData));
    try {
        const token = localStorage.getItem('accessToken'); 

        const response = await api.post(
            '/Posts/upsert/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        
        alert('Post Created');

    } catch (error) {
        console.error('Submission Error:', error);
    }
  };
  return (
     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register('title', { required: 'Title is required', maxLength: 50 })}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Enter title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
             <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { maxLength: 150 })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Enter description"
          />
        </div>

         <div>
          <label className="block text-sm font-medium text-gray-700">Tag IDs (comma separated)</label>
          <input
            {...register('tagIds')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="1, 5, 10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            {...register('images')}
            type="file"
            multiple
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Post
        </button>
      </form>
    </div>
  )
}
export default AddPost;