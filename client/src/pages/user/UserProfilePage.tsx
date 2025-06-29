import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  UserPlus,
  UserCheck,
  Settings,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserData } from "@/hooks/useUserData";

interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  profileBanner?: string;
  linkedInHandle?: string;
  twitterHandle?: string;
  githubHandle?: string;
  createdAt: string;
  posts: Post[];
  followingRelations: any[];
  postLikes: any[];
  postComments: any[];
}

interface Post {
  id: string;
  postTitle: string;
  postDescription: string;
  postBannerImage?: string;
  postTags: string[];
  published: boolean;
  createdAt: string;
  postLikes: any[];
  postComments: any[];
}

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { data: currentUserData } = useUserData();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) {
        setError("Username not provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user profile data based on username
        const mockProfiles: Record<string, UserProfile> = {
          "sarahdev": {
            id: "user123",
            name: "Sarah Johnson",
            userName: "sarahdev",
            email: "sarah@example.com",
            bio: "Full-stack developer passionate about creating amazing user experiences. Love to write about tech, design, and productivity. Always learning something new! 🚀",
            location: "San Francisco, CA",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
            profileBanner: "https://images.pexels.com/photos/557804/pexels-photo-557804.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop",
            linkedInHandle: "https://www.linkedin.com/in/sarahdev",
            twitterHandle: "https://x.com/sarahdev",
            githubHandle: "https://github.com/sarahdev",
            createdAt: "2023-01-15T10:30:00Z",
            posts: [
              {
                id: "1",
                postTitle: "Building Modern React Applications with TypeScript",
                postDescription: "Learn how to create scalable and maintainable React applications using TypeScript. This comprehensive guide covers best practices, advanced patterns, and real-world examples.",
                postBannerImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
                postTags: ["React", "TypeScript", "Frontend"],
                published: true,
                createdAt: "2024-01-15T10:30:00Z",
                postLikes: Array.from({ length: 42 }, (_, i) => ({ id: `like-${i}` })),
                postComments: Array.from({ length: 8 }, (_, i) => ({ id: `comment-${i}` }))
              },
              {
                id: "2",
                postTitle: "The Future of Web Development: Trends to Watch",
                postDescription: "Explore the latest trends and technologies shaping the future of web development. From AI integration to new frameworks, discover what's coming next.",
                postBannerImage: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
                postTags: ["Web Development", "AI", "Future Tech"],
                published: true,
                createdAt: "2024-01-12T14:20:00Z",
                postLikes: Array.from({ length: 67 }, (_, i) => ({ id: `like-${i}` })),
                postComments: Array.from({ length: 15 }, (_, i) => ({ id: `comment-${i}` }))
              }
            ],
            followingRelations: Array.from({ length: 156 }, (_, i) => ({ id: `following-${i}` })),
            postLikes: Array.from({ length: 89 }, (_, i) => ({ id: `like-${i}` })),
            postComments: Array.from({ length: 234 }, (_, i) => ({ id: `comment-${i}` }))
          },
          "alexdev": {
            id: "user456",
            name: "Alex Chen",
            userName: "alexdev",
            email: "alex@example.com",
            bio: "Frontend engineer specializing in React and Vue.js. Open source contributor and tech blogger. Building the future of web development one component at a time.",
            location: "New York, NY",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
            profileBanner: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop",
            linkedInHandle: "https://www.linkedin.com/in/alexdev",
            twitterHandle: "https://x.com/alexdev",
            githubHandle: "https://github.com/alexdev",
            createdAt: "2022-08-20T14:15:00Z",
            posts: [
              {
                id: "3",
                postTitle: "Vue.js vs React: A Comprehensive Comparison",
                postDescription: "An in-depth analysis of Vue.js and React, comparing their strengths, weaknesses, and use cases to help you choose the right framework.",
                postBannerImage: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
                postTags: ["Vue.js", "React", "JavaScript", "Frontend"],
                published: true,
                createdAt: "2024-01-08T16:45:00Z",
                postLikes: Array.from({ length: 73 }, (_, i) => ({ id: `like-${i}` })),
                postComments: Array.from({ length: 12 }, (_, i) => ({ id: `comment-${i}` }))
              }
            ],
            followingRelations: Array.from({ length: 89 }, (_, i) => ({ id: `following-${i}` })),
            postLikes: Array.from({ length: 156 }, (_, i) => ({ id: `like-${i}` })),
            postComments: Array.from({ length: 78 }, (_, i) => ({ id: `comment-${i}` }))
          },
          "mariacode": {
            id: "user789",
            name: "Maria Rodriguez",
            userName: "mariacode",
            email: "maria@example.com",
            bio: "Backend developer with expertise in Node.js, Python, and cloud architecture. Passionate about scalable systems and clean code. Coffee enthusiast ☕",
            location: "Barcelona, Spain",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
            profileBanner: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop",
            linkedInHandle: "https://www.linkedin.com/in/mariacode",
            twitterHandle: "https://x.com/mariacode",
            githubHandle: "https://github.com/mariacode",
            createdAt: "2023-03-10T09:20:00Z",
            posts: [],
            followingRelations: Array.from({ length: 234 }, (_, i) => ({ id: `following-${i}` })),
            postLikes: Array.from({ length: 445 }, (_, i) => ({ id: `like-${i}` })),
            postComments: Array.from({ length: 167 }, (_, i) => ({ id: `comment-${i}` }))
          }
        };

        const profile = mockProfiles[username];
        
        if (!profile) {
          setError("User not found");
          setUserProfile(null);
        } else {
          setUserProfile(profile);
        }
      } catch (err) {
        setError("Failed to load user profile");
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/${postId}`);
  };

  const isOwnProfile = currentUserData?.data?.userName === username;

  const tabs = [
    { id: "Posts", label: "Posts", count: userProfile?.posts.length || 0 },
    { id: "About", label: "About", count: null }
  ];

  const ProfileSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="flex items-center space-x-4">
        <Skeleton className="size-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );

  const PostCard = ({ post }: { post: Post }) => (
    <Card 
      className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 py-0 cursor-pointer group"
      onClick={() => handlePostClick(post.id)}
    >
      <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
        <div className={`${
          post.postBannerImage
            ? "md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]"
            : "md:flex flex-col md:w-[625px] lg:w-2xl xl:w-[715px]"
        }`}>
          <div className={`${post.postBannerImage ? "h-full md:w-md xl:w-[500px] mb-2" : "mb-2"}`}>
            <h2 className="md:text-xl text-base font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer group-hover:text-primary transition-colors duration-200">
              {post.postTitle}
            </h2>
            <p className="text-muted-foreground line-clamp-2 mb-2">{post.postDescription}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.postTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                  {tag}
                </Badge>
              ))}
              {post.postTags.length > 3 && (
                <Badge variant="outline" className="text-xs rounded-full">
                  +{post.postTags.length - 3}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          {post.postBannerImage && (
            <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl overflow-hidden">
              <img
                src={post.postBannerImage}
                alt="post-image"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex items-center h-6 justify-between mt-3">
          <div className="flex gap-4 mx-1">
            <div className="flex gap-1 items-center">
              <Heart className="size-5 text-muted-foreground transition-colors duration-200 hover:text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {post.postLikes.length}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle className="size-5 text-muted-foreground transition-colors duration-200 hover:text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {post.postComments.length}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="size-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl" style={{ minWidth: "320px" }}>
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl" style={{ minWidth: "320px" }}>
        <div className="max-[768px]:w-full md:w-2xl lg:w-3xl text-center py-16">
          <h2 className="text-2xl font-bold mb-4">
            {error === "User not found" ? "User not found" : "Something went wrong"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error === "User not found" 
              ? `The user @${username} doesn't exist or may have changed their username.`
              : "We couldn't load this user's profile. Please try again later."
            }
          </p>
          <Button onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl" style={{ minWidth: "320px" }}>
      <div className="max-[768px]:w-full md:w-2xl lg:w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 rounded-xl hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border overflow-hidden">
            {/* Banner */}
            {userProfile.profileBanner && (
              <div className="h-32 sm:h-48 bg-muted overflow-hidden">
                <img
                  src={userProfile.profileBanner}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="flex justify-center sm:justify-start">
                  <Avatar className={`size-20 sm:size-24 border-4 border-background ${userProfile.profileBanner ? '-mt-12 sm:-mt-16' : ''}`}>
                    <AvatarImage src={userProfile.avatar} alt="Profile picture" />
                    <AvatarFallback className="text-lg font-bold">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold">{userProfile.name}</h1>
                      <p className="text-muted-foreground">@{userProfile.userName}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center sm:justify-end">
                      {isOwnProfile ? (
                        <Button
                          variant="outline"
                          onClick={() => navigate('/settings')}
                          className="rounded-xl"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant={isFollowing ? "outline" : "default"}
                            onClick={handleFollowToggle}
                            className="rounded-xl"
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-xl">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {userProfile.bio && (
                    <p className="text-sm sm:text-base mt-3 leading-relaxed">{userProfile.bio}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground justify-center sm:justify-start">
                    {userProfile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(userProfile.createdAt)}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 mt-3 justify-center sm:justify-start">
                    {userProfile.githubHandle && (
                      <a
                        href={userProfile.githubHandle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {userProfile.linkedInHandle && (
                      <a
                        href={userProfile.linkedInHandle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {userProfile.twitterHandle && (
                      <a
                        href={userProfile.twitterHandle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mx-4 sm:mx-0 lg:mx-0">
            <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg sm:text-xl font-bold">{userProfile.posts.length}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Posts</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg sm:text-xl font-bold">{userProfile.followingRelations.length}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Following</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg sm:text-xl font-bold">{userProfile.postLikes.length}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Likes</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mx-4 sm:mx-0 lg:mx-0">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center rounded-xl space-x-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#EFF6FFCC] text-blue-600 hover:bg-[#EFF6FFCC] dark:bg-accent dark:text-primary dark:hover:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-sm">{tab.label}</span>
                {tab.count !== null && (
                  <Badge variant="secondary" className="text-xs">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "Posts" && (
              <>
                {userProfile.posts.length === 0 ? (
                  <div className="text-center py-16 mx-4 sm:mx-0 lg:mx-0">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "Start writing your first post!" : `${userProfile.name} hasn't posted anything yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button 
                        onClick={() => navigate('/create')} 
                        className="mt-4 rounded-xl"
                      >
                        Create Post
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userProfile.posts.map((post) => (
                      <div key={post.id} className="mx-4 sm:mx-0 lg:mx-0">
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "About" && (
              <Card className="mx-4 sm:mx-0 lg:mx-0 bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-0 lg:hover:border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About {userProfile.name}</h3>
                  <div className="space-y-4">
                    {userProfile.bio && (
                      <div>
                        <h4 className="font-medium mb-2">Bio</h4>
                        <p className="text-muted-foreground leading-relaxed">{userProfile.bio}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Activity</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>{userProfile.posts.length} posts published</p>
                          <p>{userProfile.postLikes.length} likes given</p>
                          <p>{userProfile.postComments.length} comments made</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Joined</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(userProfile.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;