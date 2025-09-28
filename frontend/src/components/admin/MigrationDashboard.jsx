import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Upload, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { api } from '../../services/api';

const MigrationDashboard = () => {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [migratedPosts, setMigratedPosts] = useState([]);
  const [failedMappings, setFailedMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchMigrationStatus();
    fetchMigratedPosts();
    fetchFailedMappings();
  }, []);

  const fetchMigrationStatus = async () => {
    try {
      const response = await api.migration.getStatus();
      setMigrationStatus(response);
    } catch (error) {
      console.error('Error fetching migration status:', error);
    }
  };

  const fetchMigratedPosts = async () => {
    try {
      const response = await api.migration.getPreviewPosts();
      setMigratedPosts(response.posts || []);
    } catch (error) {
      console.error('Error fetching migrated posts:', error);
    }
  };

  const fetchFailedMappings = async () => {
    try {
      const response = await api.migration.getFailedMappings();
      setFailedMappings(response.failed_mappings || []);
    } catch (error) {
      console.error('Error fetching failed mappings:', error);
    }
  };

  const startMigration = async () => {
    setLoading(true);
    try {
      await api.migration.startMigration();
      // Poll for status updates
      const interval = setInterval(async () => {
        const status = await api.migration.getStatus();
        setMigrationStatus(status);
        if (status.status === 'completed') {
          clearInterval(interval);
          setLoading(false);
          fetchMigratedPosts();
          fetchFailedMappings();
        }
      }, 2000);
    } catch (error) {
      console.error('Error starting migration:', error);
      setLoading(false);
    }
  };

  const openReviewModal = (post) => {
    setSelectedPost(post);
    setEditData({
      title: post.title,
      excerpt: post.excerpt,
      rating: post.rating || 4.0,
      tags: post.tags || []
    });
    setReviewModalOpen(true);
  };

  const approveReview = async (approved) => {
    if (!selectedPost) return;

    try {
      await api.migration.approveReview({
        review_id: selectedPost.id,
        approved,
        movie_id: selectedPost.movie_id,
        title: editData.title,
        excerpt: editData.excerpt,
        rating: editData.rating,
        tags: editData.tags
      });

      // Refresh data
      fetchMigratedPosts();
      setReviewModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">WordPress Migration Dashboard</h1>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Migration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Migration Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {migrationStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{migrationStatus.total_posts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{migrationStatus.mapped_movies}</div>
                <div className="text-sm text-gray-600">Mapped to Movies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{migrationStatus.failed_mappings}</div>
                <div className="text-sm text-gray-600">Failed Mappings</div>
              </div>
              <div className="text-center">
                <Badge 
                  variant={migrationStatus.status === 'completed' ? 'default' : 'secondary'}
                  className="text-lg py-2 px-4"
                >
                  {migrationStatus.status}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Button onClick={startMigration} disabled={loading} size="lg">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Start WordPress Migration
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                This will import your WordPress reviews and match them with movies from TMDB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migrated Posts for Review */}
      {migratedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reviews Pending Approval</CardTitle>
            <p className="text-sm text-gray-600">
              Review and approve your migrated WordPress posts before they go live
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migratedPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        {post.movie_id && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Mapped to TMDB
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.published_at)}</span>
                        <span>•</span>
                        <span>{post.read_time}</span>
                        {post.rating && (
                          <>
                            <span>•</span>
                            <span>⭐ {post.rating}/5</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReviewModal(post)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed Mappings */}
      {failedMappings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span>Failed Movie Mappings</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              These posts couldn't be automatically matched with movies in TMDB
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {failedMappings.map((mapping, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded border">
                  <div>
                    <div className="font-medium">{mapping.post_title}</div>
                    <div className="text-sm text-gray-600">{mapping.reason}</div>
                  </div>
                  <Badge variant="destructive">
                    Manual Review Needed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Post: {selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Review and edit this post before publishing to Filmwalla.com
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-6">
              {/* Edit Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editData.rating}
                    onChange={(e) => setEditData({...editData, rating: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editData.excerpt}
                  onChange={(e) => setEditData({...editData, excerpt: e.target.value})}
                  rows={3}
                />
              </div>
              
              {/* Original Content Preview */}
              <div>
                <Label>Original Content (Preview)</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded border max-h-64 overflow-y-auto">
                  <div className="text-sm whitespace-pre-wrap">
                    {selectedPost.content.substring(0, 1000)}
                    {selectedPost.content.length > 1000 && '...'}
                  </div>
                </div>
              </div>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Author:</strong> {selectedPost.author}
                </div>
                <div>
                  <strong>Published:</strong> {formatDate(selectedPost.published_at)}
                </div>
                <div>
                  <strong>Read Time:</strong> {selectedPost.read_time}
                </div>
                <div>
                  <strong>TMDB Mapped:</strong> {selectedPost.movie_id ? 'Yes' : 'No'}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => approveReview(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Publish
                </Button>
                <Button
                  onClick={() => approveReview(false)}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => setReviewModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MigrationDashboard;