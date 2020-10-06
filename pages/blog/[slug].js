import * as React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
const glob = require('glob')

import Layout from '../../components/Layout'

export default function BlogTemplate({ frontmatter, markdownBody, siteTitle }) {
  const [views, setViews] = useState(0);
  const router = useRouter();

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    return date.toDateString().slice(4)
  }

  if (!frontmatter) return <></>

  useEffect(() => {
    const blogAlias = router.asPath.split("/")[2];
    axios.get("https://calix-api.herokuapp.com/blogs/get-blog/?alias=" + blogAlias).then((response) => {
      const blog = response.data;
      setViews(blog.views ? blog.views : 0);
    });

    // ADD VIEW
    axios.post("https://calix-api.herokuapp.com/blogs/increment-views", { alias: blogAlias });
  }, []);

  return (
    <Layout siteTitle={siteTitle}>
      <Head>
        <title>Calix Huang - {frontmatter.title}</title>
        <meta name="description" content={`${markdownBody.split(" ").splice(0, 25).join(" ")}...`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8" />
        <meta name="og:image" content={frontmatter.hero_image} />
      </Head>
      <article className="blog">
        <figure className="blog__hero">
          <img
            src={frontmatter.hero_image}
            alt={`${frontmatter.title}`}
          />
        </figure>
        <div className="blog__info">
          <h1>{frontmatter.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
          <span><FontAwesomeIcon icon={faEye} /> {views}</span>
        </div>
        <div className="blog__body">
          <ReactMarkdown source={markdownBody} />
        </div>
      </article>
      <style jsx>
        {`
          a {
            text-decoration: underline
          }
          .blog h1 {
            margin-bottom: 0.7rem;
          }

          .blog__hero {
            min-height: 300px;
            height: 60vh;
            width: 100%;
            margin: 0;
            overflow: hidden;
          }
          .blog__hero img {
            margin-bottom: 0;
            object-fit: cover;
            min-height: 100%;
            min-width: 100%;
            object-position: center;
          }

          .blog__info {
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 768px;
            margin: 0 auto;
          }
          .blog__info h1 {
            margin-bottom: 0.66rem;
          }
          .blog__info h3 {
            margin-bottom: 5px;
          }
          .blog__info span {
            margin-bottom: 0;
            color: grey;
          }

          .blog__body {
            width: 100%;
            padding: 0 1.25rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .blog__body a {
            padding-bottom: 1.5rem;
          }
          .blog__body:last-child {
            margin-bottom: 0;
          }
          .blog__body h1 h2 h3 h4 h5 h6 p {
            font-weight: 700;
          }
          .blog__body p {
            color: inherit;
          }
          .blog__body ul {
            list-style: initial;
          }
          .blog__body ul ol {
            margin-left: 1.25rem;
            margin-bottom: 1.25rem;
            padding-left: 1.45rem;
          }

          .blog__footer {
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          .blog__footer h2 {
            margin-bottom: 0;
          }
          .blog__footer a svg {
            width: 20px;
          }

          @media (min-width: 768px) {
            .blog {
              display: flex;
              flex-direction: column;
            }
            .blog__body {
              max-width: 800px;
              padding: 0 2rem;
            }
            .blog__body span {
              width: 100%;
              margin: 1.5rem auto;
            }
            .blog__body ul ol {
              margin-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .blog__hero {
              min-height: 600px;
              height: 75vh;
            }
            .blog__info {
              text-align: center;
              padding: 2rem 0;
            }
            .blog__info h1 {
              max-width: 500px;
              margin: 0 auto 0.66rem auto;
            }
            .blog__footer {
              padding: 2.25rem;
            }
          }

          @media (min-width: 1440px) {
            .blog__hero {
              height: 70vh;
            }
            .blog__info {
              padding: 3rem 0;
            }
            .blog__footer {
              padding: 2rem 2rem 3rem 2rem;
            }
          }
        `}
      </style>
    </Layout>
  )
}

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params
  const content = await import(`../../posts/${slug}.md`)
  const config = await import(`../../data/config.json`)
  const data = matter(content.default)

  return {
    props: {
      siteTitle: config.title,
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  //get all .md files in the posts dir
  const blogs = glob.sync('posts/**/*.md')

  //remove path and extension to leave filename only
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[1]
      .replace(/ /g, '-')
      .slice(0, -3)
      .trim()
  )

  // create paths with `slug` param
  const paths = blogSlugs.map(slug => `/blog/${slug}`)
  return {
    paths,
    fallback: false,
  }
}
