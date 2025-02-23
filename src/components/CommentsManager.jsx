'use client';

import { useState, useEffect } from 'react';

export default function CommentsManager() {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment?.comments?.trim()) return;

    try {
      const response = await fetch(`/api/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: editingComment.comments }),
      });

      if (response.ok) {
        setEditingComment(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comments Manager</h1>

      {/* Add Comment Section */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter a new comment"
          className="textarea textarea-bordered w-full mb-2"
          rows={3}
        />
        <button 
          onClick={handleAddComment}
          className="btn btn-primary"
        >
          Add Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              {editingComment?.id === comment.id ? (
                <>
                  <textarea
                    value={editingComment.comments}
                    onChange={(e) => setEditingComment({
                      ...editingComment,
                      comments: e.target.value
                    })}
                    className="textarea textarea-bordered w-full mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateComment}
                      className="btn btn-success btn-sm"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingComment(null)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-line">{comment.comments}</p>
                  <div className="card-actions justify-end mt-2">
                    <button 
                      onClick={() => setEditingComment(comment)}
                      className="btn btn-sm btn-ghost"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
