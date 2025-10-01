import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiMessageCircle, FiEye, FiThumbsUp, FiUpload, FiBookmark, FiX } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import MainNavbar from '../navbar/mainNavbar';



const categories = [
  { name: 'All Posts', count: 234, color: 'bg-blue-500' },
  { name: 'Teaching Tips', count: 67, color: 'bg-cyan-500' },
  { name: 'Learning Partners', count: 43, color: 'bg-green-500' },
  { name: 'Resources', count: 89, color: 'bg-purple-500' },
  { name: 'Success Stories', count: 35, color: 'bg-yellow-500' },
];

const topContributors = [
  { id: 1, name: 'Sarah Chen', contributions: 156, avatar: 'https://i.pravatar.cc/150?u=sarah', roles: ['Community Leader'] },
  { id: 2, name: 'Marcus Johnson', contributions: 134, avatar: 'https://i.pravatar.cc/150?u=marcus', roles: ['Helpful Helper'] },
  { id: 3, name: 'Dr. Emily Wang', contributions: 112, avatar: 'https://i.pravatar.cc/150?u=emily', roles: ['Knowledge Expert'] },
];

const trendingTopics = [
    { name: 'React Hooks', count: 23 },
    { name: 'Python Basics', count: 18 },
    { name: 'Online Teaching', count: 15 },
    { name: 'Career Change', count: 12 },
    { name: 'JavaScript ES6', count: 11 },
];


// --- SUB-COMPONENTS ---

const PostCard = ({ post, handleDeletePost, currentUserId }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start space-x-4">
      <img src={post.avatar} alt={post.author} className="w-11 h-11 rounded-full object-cover" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <div>
                <span className="font-semibold text-gray-900">{post.author}</span>
                <span className="text-sm text-gray-500 ml-2">· {new Date(post.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              {post.isHot && (
                  <div className="flex items-center space-x-1 text-orange-500">
                      <FaFire />
                      <span className="text-sm font-semibold">Hot</span>
                  </div>
              )}
              {post.userId === currentUserId && (
                <button onClick={() => handleDeletePost(post._id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <FiX size={18} />
                </button>
              )}
            </div>
        </div>
        <div className="text-sm text-gray-500 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.authorRole === 'Expert Teacher' ? 'bg-cyan-100 text-cyan-800' : post.authorRole === 'Community Star' ? 'bg-blue-100 text-blue-800' : post.authorRole === 'New Contributor' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{post.authorRole}</span>
            <span className='mx-1'>in</span>
            <a href="#" className="font-medium text-gray-700 hover:text-indigo-600">{post.category}</a>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mt-1 cursor-pointer hover:text-indigo-700">{post.title}</h3>
        <p className="text-gray-600 mt-1 text-sm">{post.excerpt}</p>
        
        <div className="mt-4 flex items-center space-x-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-gray-500">
            <div className="flex items-center space-x-5">
                <span className="flex items-center space-x-1.5 cursor-pointer hover:text-indigo-600">
                    <FiMessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.stats.comments}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                    <FiEye className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.stats.views}</span>
                </span>
            </div>
            <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1.5 hover:text-indigo-600 cursor-pointer">
                    <FiThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.stats.likes}</span>
                </button>
                <button className="hover:text-indigo-600 cursor-pointer"><FiUpload className="w-4 h-4" /></button>
                <button className="hover:text-indigo-600 cursor-pointer"><FiBookmark className="w-4 h-4" /></button>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const SidebarCard = ({ title, children }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-bold text-gray-800 text-md mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
)

const NewPostModal = ({ onAddPost, onClose, currentUser }) => {
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !excerpt.trim()) {
            alert("Please fill in both title and content.");
            return;
        }

        const newPost = {
            author: currentUser.name,
            avatar: currentUser.avatar,
            title,
            excerpt,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            authorRole: 'New Contributor', // This could be dynamic based on user roles
            category: 'General Discussion', // This could be a dropdown in the form
            userId: currentUser.id,
        };

        onAddPost(newPost);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Create a New Post</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="What's on your mind?"
                            />
                        </div>
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                id="excerpt"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Elaborate on your topic..."
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input
                                type="text"
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add tags, separated by commas (e.g., react, tailwind, webdev)"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-5 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm cursor-pointer">
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('Recent');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabs = ['Recent', 'Popular', 'Trending', 'Unanswered'];

  // TODO: Replace this with your actual authentication context or state management
  const currentUser = {
    id: 'some-hardcoded-user-id',
    name: 'Shubham Upadhyay',
    avatar: 'https://i.pravatar.cc/150?u=shubham',
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (newPostData) => {
      try {
        const response = await fetch('http://localhost:5000/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPostData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchPosts(); // Refetch posts to include the new one
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to add post:", error);
        alert("Failed to add post. Please try again.");
      }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchPosts(); // Refetch posts to update the list
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="bg-gray-50 min-h-screen font-sans pt-24">
        <div className="container mx-auto px-4 py-8">
          
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600 mt-1">Connect, share knowledge, and grow together with the SkillSwap community</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="relative w-full sm:w-auto flex-grow">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search discussions, topics, or users..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button className="flex items-center justify-center w-1/2 sm:w-auto space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer">
                    <FiFilter className="text-gray-600" />
                    <span className="text-gray-700 font-medium">Filter</span>
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-1/2 sm:w-auto space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm cursor-pointer">
                    <FiPlus />
                    <span className="font-medium">New Post</span>
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6">
                  {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-1 text-sm font-semibold transition-colors duration-200 cursor-pointer ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-4">
                {posts.map(post => <PostCard key={post._id} post={post} handleDeletePost={handleDeletePost} currentUserId={currentUser.id} />)}
              </div>
            </main>

            <aside className="space-y-6">
              <SidebarCard title="Categories">
                {categories.map(cat => (
                  <a href="#" key={cat.name} className="flex justify-between items-center text-sm text-gray-600 hover:text-indigo-600 group cursor-pointer">
                    <div className="flex items-center"><span className={`w-2 h-2 rounded-full mr-3 ${cat.color}`}></span><span className="group-hover:font-semibold">{cat.name}</span></div>
                    <span className="bg-gray-100 group-hover:bg-indigo-100 text-gray-600 group-hover:text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">{cat.count}</span>
                  </a>
                ))}
              </SidebarCard>
              
              <SidebarCard title="Top Contributors">
                  {topContributors.map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-3">
                          <span className="font-bold text-lg text-gray-400 w-4">{index + 1}</span>
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                          <div>
                              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.contributions} contributions</p>
                          </div>
                      </div>
                  ))}
              </SidebarCard>

              <SidebarCard title="Trending Topics">
                  {trendingTopics.map(topic => (
                      <a href="#" key={topic.name} className="flex justify-between items-center text-sm text-gray-600 hover:text-indigo-600 group cursor-pointer">
                          <span className="group-hover:font-semibold">{topic.name}</span>
                          <span className="bg-gray-100 group-hover:bg-indigo-100 text-gray-600 group-hover:text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">{topic.count}</span>
                      </a>
                  ))}
              </SidebarCard>
            </aside>
          </div>
        </div>
      </div>
      
      {isModalOpen && <NewPostModal onAddPost={handleAddPost} onClose={() => setIsModalOpen(false)} currentUser={currentUser} />}
    </>
  );
};

export default CommunityPage;
