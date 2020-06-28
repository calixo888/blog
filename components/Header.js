import Link from "next/link";

export default function Header(props) {
  return (
    <header className="header">
      <nav
        className="nav"
        role="navigation"
        aria-label="main navigation"
      >
        <div>
          <Link href="/">
            <h1>My Personal Journal</h1>
          </Link>
          <h3>By: <a href="https://www.calix.dev" target="_blank">Calix Huang</a></h3>
        </div>
        <div className="social-links">
          <p>
            <a href="https://www.linkedin.com/in/calix-huang/" target="_blank"><img src="/static/icons/linkedin.svg" /> @calix-huang</a>
          </p>
          <p>
            <a href="https://www.instagram.com/calix_huang/" target="_blank"><img src="/static/icons/instagram.svg" /> @calix_huang</a>
          </p>
          <p>
            <a href="https://github.com/calixo888" target="_blank"><img src="/static/icons/github.svg" /> @calixo888</a>
          </p>
          <p>
            <a href="https://www.calix.dev/" target="_blank"><img src="/static/icons/website.svg" /> calix.dev</a>
          </p>
        </div>
        <div className="copyright">
          <p>&copy; 2020 <a href="https://www.calix.dev" target="_blank">Calix Huang</a>. All rights reserved.</p>
          <small>Starter repository by <a href="https://github.com/kendallstrautman" target="_blank">@kendallstrautman</a></small>
        </div>
      </nav>
      <style jsx>
        {`
          h1 {
            margin-bottom: 0;
          }
          h1:hover {
            cursor: pointer;
          }
          .social-links {
            display: flex;
            flex-direction: row;
            margin-top: 15px;
          }
          .social-links a {
            display: flex;
            align-items: center;
          }
          img {
            width: 30px;
            margin-bottom: 0;
            margin-right: 10px;
          }
          nav {
            padding: 1.5rem 1.25rem;
            border-bottom: 1px solid #ebebeb;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
          }
          .copyright {
            display: none;
          }
          @media (min-width: 768px) {
            .header {
              height: 100vh;
              position: fixed;
              left: 0;
              top: 0;
            }
            .nav {
              padding: 2rem;
              width: 30vw;
              height: 100%;
              border-right: 1px solid #ebebeb;
              border-bottom: none;
              flex-direction: column;
              align-items: flex-start;
            }
            .copyright {
              display: block;
            }
            .social-links {
              display: block;
              margin-top: 15px;
            }
          }

          @media (max-width: 768px) {
            nav {
              display: block;
            }
            .social-links {
              display: grid;
              grid-template-columns repeat(auto-fill, minmax(200px, 1fr));
            }
          }
        `}
      </style>
    </header>
  );
}
