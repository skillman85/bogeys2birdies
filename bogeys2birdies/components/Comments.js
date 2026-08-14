'use client';
import { useState } from 'react';

export function Comments({ contentId, contentType, contentTitle, initialComments = [] }) {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function submit(event) {
    event.preventDefault(); setSubmitting(true); setStatus('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author: form.get('author'), message: form.get('message'), website: form.get('website'), contentId, contentType, contentTitle }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit comment.');
      formElement.reset(); setStatus('Thanks — your comment is awaiting moderation.');
    } catch (error) { setStatus(error.message); } finally { setSubmitting(false); }
  }
  return <section className="comments-section" aria-labelledby="comments-heading">
    <h2 id="comments-heading">Comments</h2>
    <div className="comments-list">{initialComments.length ? initialComments.map((comment) => <article className="comment" key={comment._id}><div><strong>{comment.author}</strong><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString('en-GB')}</time></div><p>{comment.message}</p></article>) : <p className="comments-empty">No approved comments yet. Start the conversation.</p>}</div>
    <form className="comment-form" onSubmit={submit}>
      <h3>Leave a comment</h3><p>Comments are reviewed before appearing publicly.</p>
      <label>Name<input name="author" required minLength="2" maxLength="60" autoComplete="name" /></label>
      <label>Comment<textarea name="message" required minLength="3" maxLength="1500" rows="6" /></label>
      <label className="comment-honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label>
      <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit comment'}</button>
      {status && <p className="comment-status" role="status">{status}</p>}
    </form>
  </section>;
}
