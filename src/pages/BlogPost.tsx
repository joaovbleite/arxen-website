import React from 'react';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Blog Post: {postId}</h1>
      <article className="prose lg:prose-xl mx-auto">
        <p>
          This is the content area for the blog post with ID: {postId}.
          Full blog post content, images, etc., will be loaded here dynamically.
        </p>
        {/* Add full blog post content here */}
      </article>
    </div>
  );
};

export default BlogPost; 