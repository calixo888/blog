import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

const BlogList = ({ allBlogs }) => {
  const [blogs, setBlogs] = useState([]);

  function truncateSummary(content) {
    return content.split(" ").splice(0, 25).join(" ") + "..."
  }

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    return date.toDateString().slice(4)
  }

  useEffect(() => {
    axios.get("https://calix-api.herokuapp.com/blogs/get-blogs").then((response) => {
      const blogViews = response.data;
      allBlogs = allBlogs.sort(function(a, b) {
        var dateA = new Date(a.frontmatter.date), dateB = new Date(b.frontmatter.date);
        return dateB - dateA;
      });

      setBlogs(allBlogs.map((allBlog, i) => {
        const blogViewObj = blogViews.filter(blog => blog.alias == allBlog.slug);
        console.log({...allBlog, views: blogViewObj[0] ? blogViewObj[0].views : 0 })
        return {...allBlog, views: blogViewObj[0] ? blogViewObj[0].views : 0 };
      }));
    });

    console.log(blogs);
  }, []);

  return (
    <>
      <ul className="list">
        {blogs.length > 1 &&
          blogs.map(post => (
            <Link key={post.slug} href={{ pathname: `/blog/${post.slug}` }}>
              <a>
                <li>
                  <div className="hero_image">
                    <img
                      src={post.frontmatter.hero_image}
                      alt={post.frontmatter.hero_image}
                    />
                  </div>
                  <div className="blog__info">
                    <h2>{post.frontmatter.title}</h2>
                    <h3>{reformatDate(post.frontmatter.date)}</h3>
                    <span><FontAwesomeIcon icon={faEye} /> {post.views}</span>
                    <p>
                      <ReactMarkdown
                        source={truncateSummary(post.markdownBody)}
                      />
                    </p>
                  </div>
                </li>
              </a>
            </Link>
          ))}
      </ul>
      <style jsx>
        {`
          a {
            text-decoration: none;
          }
          margin-bottom: 0;
          a:hover {
            opacity: 1;
          }
          a:hover li div.hero_image img {
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }
          a:hover li .blog__info h2,
          a:hover li .blog__info h3,
          a:hover li .blog__info span,
          a:hover li .blog__info p {
            transform: translateX(10px);
            transition: transform 0.5s ease-out;
          }
          .list {
            padding-left: 0;
          }
          .hero_image {
            width: 100%;
            height: 33vh;
            overflow: hidden;
            background-color: #000;
          }
          .hero_image img {
            object-fit: cover;
            object-position: 50% 50%;
            opacity: 1;
            transition: opacity 0.3s ease;
            min-height: 100%;
          }
          .blog__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1.5rem 1.25rem;
            transform: translateX(0px);
            transition: transform 0.3s ease-in;
            border-bottom: 1px solid #ebebeb;
          }
          .blog__info h2,
          .blog__info h3,
          .blog__info span,
          .blog__info p {
            transform: translateX(0px);
            transition: transform 0.5s ease-out;
          }
          li {
            opacity: inherit;
            display: flex;
            justify-content: center;
            flex-direction: column;
            min-height: 38vh;
            margin-bottom: 0;
          }
          h2 {
            margin-bottom: 0.5rem;
          }
          h3 {
            margin-bottom: 0.5rem;
          }
          span {
            font-size: 15px;
            color: grey;
            margin-bottom: 1rem;
          }
          p {
            max-width: 900px;
          }
          @media (min-width: 768px) {
            li {
              min-height: 250px;
              height: 33.333vh;
              flex-direction: row;
            }
            .hero_image {
              height: 100%;
            }
            .hero_image img {
              min-width: 100%;
              height: 100%;
              width: auto;
              min-height: 0;
            }
            .blog__info {
              min-width: 70%;
            }
          }
          @media (min-width: 1280px) {
            .blog__info {
              padding: 3rem;
            }
            h3 {
              margin-bottom: 1.2rem;
            }
          }
        `}
      </style>
    </>
  )
}

export default BlogList
