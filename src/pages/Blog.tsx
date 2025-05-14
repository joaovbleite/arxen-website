import React from 'react';

const Blog = () => {
  const posts = [
    {
      title: "The Importance of Regular Home Maintenance",
      description: "Learn why regular maintenance is crucial for your home's longevity.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
    },
    {
      title: "Top 5 Remodeling Trends of 2024",
      description: "Discover the latest trends in home remodeling for the upcoming year.",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80"
    },
    {
      title: "DIY Tips for a Successful Renovation",
      description: "Get practical tips for tackling your next DIY renovation project.",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Blog</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">{post.title}</h3>
              <p className="text-gray-700">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog; 