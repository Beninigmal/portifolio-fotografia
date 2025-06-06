import React, { useState, useEffect } from "react";
import styles from "./Portfolio.module.css";
import frontMatter from "front-matter";

export default function Portfolio() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const postFiles = ["ensaio-na-praia.md"]; // Use o nome real do seu arquivo

        const loadedPosts = await Promise.all(
          postFiles.map(async (file) => {
            try {
              const res = await fetch(
                process.env.PUBLIC_URL + `/data/portfolio/${file}`
              );
              const text = await res.text();
              console.log("Conteúdo REAL do arquivo:", text); // Verifique agora
              const { attributes } = frontMatter(text);

              return {
                title: attributes.title,
                image:
                  process.env.PUBLIC_URL +
                  `/images/uploads/${attributes.photo}`,
                description: attributes.description,
                date: attributes.date,
                slug: file.replace(".md", ""),
              };
            } catch (err) {
              console.error(`Erro no arquivo ${file}:`, err);
              return null;
            }
          })
        );
        setPosts(loadedPosts.filter((post) => post !== null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) return <div>Carregando portfólio...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className={styles.gallery}>
      {posts.map((post) => (
        <div key={post.slug} className={styles.galleryItem}>
          <img src={post.image} alt={post.title} loading="lazy" />
          <h3>{post.title}</h3>
          <p>{post.description}</p> {/* Removida a conversão de data */}
          {post.date && <p>{new Date(post.date).toLocaleDateString()}</p>}{" "}
          {/* Mostra data apenas se existir */}
        </div>
      ))}
    </div>
  );
}
