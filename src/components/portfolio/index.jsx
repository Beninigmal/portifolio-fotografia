import React, { useState, useEffect } from "react";
import { parse } from "front-matter"; // Substitui gray-matter
import styles from "./Portfolio.module.css";

export default function Portfolio() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/data/portfolio/post1.md");
        const text = await response.text();
        const { attributes } = parse(text); // Usa front-matter
        setPosts([attributes]); // attributes = {title, photo, description}
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className={styles.container}>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index} className={styles.item}>
            <h2>{post.title}</h2>
            <img src={post.photo} alt={post.title} />
            <p>{post.description}</p>
          </div>
        ))
      ) : (
        <p>Carregando portfólio...</p>
      )}
    </div>
  );
}
