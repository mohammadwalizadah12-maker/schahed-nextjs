import { allPosts } from "@/lib/posts";
import PostsEditor from "./PostsEditor";

/**
 * Admin-Dashboard. Laedt die aktuellen Beiträge aus der ausgelieferten JSON
 * (kein GitHub-Call beim Laden) und uebergibt sie dem Client-Editor.
 * Gespeichert wird per GitHub-API (POST /api/admin/posts).
 */
export default function AdminPage() {
  const posts = allPosts();
  return <PostsEditor initialPosts={posts} />;
}
