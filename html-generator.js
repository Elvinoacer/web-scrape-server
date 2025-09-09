const { marked } = require('marked');

const generateHTML = (data) => {
  const { topic, detailedReport, links, images, videos, createdAt } = data;

  // --- Simplified, Corrected Logic ---
  // The entire detailedReport is the main content.
  const reportHtml = marked.parse(detailedReport);

  // --- HTML for Sidebar Elements ---
  const linksHtml = links.map(link => `
    <a href="${link.url}" class="related-article-card" target="_blank" rel="noopener noreferrer">
      <span class="related-article-title">${link.description}</span>
      <span class="related-article-url">Read More</span>
    </a>
  `).join('');

  const imagesHtml = images.map(image => `
    <div class="asset-container">
      <a href="${image.url}" target="_blank" rel="noopener noreferrer" title="View full image: ${image.description || ''}">
        <div class="image-item">
          <img src="${image.url}" alt="${image.description || ''}" loading="lazy">
        </div>
      </a>
      ${image.description ? `<p class="asset-caption">${image.description}</p>` : ''}
    </div>
  `).join('');

  const videosHtml = videos.map(video => `
    <div class="asset-container">
      <div class="video-item">
        <video controls poster="${video.thumbnail || ''}" class="w-100">
          <source src="${video.url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      ${video.description ? `<p class="asset-caption">${video.description}</p>` : ''}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${topic}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-color: #0D0C1D;
          --primary-glow: rgba(120, 81, 255, 0.5);
          --secondary-glow: rgba(0, 255, 255, 0.5);
          --text-color: #E0E0E0;
          --text-secondary: #B0B0B0;
          --card-bg: rgba(23, 22, 43, 0.6);
          --border-color: rgba(120, 81, 255, 0.2);
          --gradient-start: #8A2BE2;
          --gradient-mid: #4169E1;
          --gradient-end: #00FFFF;
        }

        @keyframes background-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          line-height: 1.8;
          overflow-x: hidden;
        }

        .aurora-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(270deg, var(--primary-glow), var(--secondary-glow), var(--bg-color), var(--bg-color));
          background-size: 600% 600%;
          animation: background-pan 30s ease infinite;
          z-index: -1;
        }

        .report-header {
          padding: 6rem 0 2rem 0;
          text-align: center;
          position: relative;
        }

        .report-header h1 {
          font-size: 4rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: background-pan 10s linear infinite;
          text-shadow: 0 0 15px rgba(138, 43, 226, 0.4), 0 0 25px rgba(0, 255, 255, 0.4);
        }

        .report-header .timestamp {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: 1rem;
        }

        .main-content-area {
            background: var(--card-bg);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 3rem;
        }

        .sidebar-section {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .sidebar-title {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
            background: linear-gradient(90deg, var(--gradient-mid), var(--gradient-end));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .main-content-area h1, .main-content-area h2, .main-content-area h3, .main-content-area h4 {
            font-weight: 600;
            color: var(--text-color);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
        }

        .main-content-area p, .main-content-area ul, .main-content-area li {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }

        .main-content-area img {
            max-width: 100%;
            height: auto;
            border-radius: 15px;
            margin: 1.5rem 0;
            box-shadow: 0 4px 25px rgba(0,0,0,0.4);
        }

        .image-gallery {
            column-count: 2;
            column-gap: 1rem;
        }

        .asset-container {
            margin-bottom: 1rem;
            break-inside: avoid; /* For masonry layout */
        }

        .image-item {
            border-radius: 15px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: block;
        }

        .image-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }

        .image-item img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 15px;
        }

        .asset-caption {
            font-size: 0.9rem;
            color: var(--text-secondary);
            text-align: center;
            padding: 0.75rem 0.25rem 0 0.25rem;
        }

        .related-articles-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .related-article-card {
            display: block;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            padding: 1.25rem;
            border-radius: 15px;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .related-article-card:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--primary-glow);
            transform: translateY(-3px);
        }

        .related-article-title {
            display: block;
            color: var(--text-color);
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .related-article-url {
            display: block;
            color: var(--gradient-mid);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .video-gallery {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .video-item video {
            width: 100%;
            border-radius: 15px;
        }

        footer {
            border-top: 1px solid var(--border-color);
            padding: 2rem 0;
            margin-top: 4rem;
            color: var(--text-secondary);
        }

        @media (max-width: 991.98px) {
            .sidebar-section {
                margin-top: 3rem;
            }
        }

        @media (max-width: 767.98px) {
            .report-header h1 {
                font-size: 2.2rem;
            }
            .image-gallery {
                column-count: 1;
            }
            .main-content-area p, .main-content-area ul, .main-content-area li {
                font-size: 1rem;
            }
            .main-content-area h2 {
                font-size: 1.75rem;
            }
            .main-content-area h3 {
                font-size: 1.5rem;
            }
            .sidebar-title {
                font-size: 1.5rem;
            }
        }
      </style>
    </head>
    <body>
        <div class="aurora-background"></div>
        <header class="report-header">
            <div class="container">
                <h1>${topic}</h1>
                <p class="timestamp">Published on: ${new Date(createdAt).toLocaleDateString()}</p>
            </div>
        </header>

      <div class="container my-5">
        <div class="row">
            <main class="col-lg-8">
                <div class="main-content-area">
                    ${reportHtml}
                </div>
            </main>
            <aside class="col-lg-4">
                ${(images.length > 0 || videos.length > 0) ? `
                    <div class="sidebar-section mb-4">
                        <h3 class="sidebar-title">Assets</h3>
                        ${images.length > 0 ? `
                            <div class="image-gallery">
                                ${imagesHtml}
                            </div>
                        ` : ''}
                        ${videos.length > 0 ? `
                            <div class="video-gallery mt-4">
                                ${videosHtml}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                ${links.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">Related Articles</h3>
                        <div class="related-articles-container">
                            ${linksHtml}
                        </div>
                    </div>
                ` : ''}
            </aside>
        </div>
      </div>

      <footer class="text-center">
        <div class="container">
            <p class="mb-0">&copy; ${new Date().getFullYear()} Thecontemporary. All Rights Reserved.</p>
        </div>
      </footer>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `;
};

module.exports = { generateHTML };
