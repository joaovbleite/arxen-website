import React from 'react';
import { useParams } from 'react-router-dom';

const BlogCategory = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Blog Posts: {categoryName}</h1>
      <p className="text-center text-lg text-gray-700">
        This page will list all blog posts belonging to the {categoryName} category.
        (Dynamic content loading required)
      </p>
      {/* Add list of blog posts */}
    </div>
  );
};

export default BlogCategory; 