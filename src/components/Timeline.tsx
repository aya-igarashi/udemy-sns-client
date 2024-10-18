import React, { useEffect, useState } from 'react'
import Post from './Post'
import apiClient from '@/lib/apiClient';
import { PostType } from '@/types';

const Timeline = () => {

  const [postText, setPostText] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<PostType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 投稿中かどうかの状態を追加

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // すでに投稿中なら処理を中断
    if (isSubmitting) {
      return;
    }

    // 投稿中に設定
    setIsSubmitting(true);

    if (!postText) {
      alert("ポスト内容を入力してください");
      return;
    }

    try {
      const newPost = await apiClient.post("/posts/post", {
        content: postText,
      });
      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts]);
      setPostText("");

    } catch (error) {
      console.log(error);
      alert("ログインしてください")
    } finally {
      // 投稿処理が終わったら投稿中の状態を解除
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await apiClient.get("/posts/get_latest_post");
        setLatestPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLatestPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-4">
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPostText(e.target.value);
              }
              }

            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
              disabled={isSubmitting} // 投稿中はボタンを無効化
            >
              {isSubmitting ? '投稿中...' : '投稿'}
            </button>
          </form>
        </div>
        {latestPosts.map((post: PostType) => (
          <Post key={post.id} post={post} />
        ))}
      </main>
    </div>
  )
}

export default Timeline