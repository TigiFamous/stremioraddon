const express = require('express');
const app = express();  // Initialize app
app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Vidsrc Direct Movies - Search Movies</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; background: #0f0f0f; color: #f0f0f0; }
                h1 { color: #e91e63; }
                input, button { padding: 10px; font-size: 16px; margin: 5px; }
                .movie { margin: 10px 0; padding: 10px; background: #1f1f1f; border-radius: 8px; }
                .button-copy { margin-left: 10px; background: #03a9f4; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
                .button-copy:hover { background: #0288d1; }
            </style>
        </head>
        <body>
            <h1>🎬 Vidsrc Direct - Search Movies</h1>
            <p>Find movies by title and get their IMDb ID to stream with this addon!</p>

            <input type="text" id="searchBox" placeholder="Enter movie title..." />
            <button onclick="searchMovies()">🔍 Search</button>

            <div id="results" style="margin-top: 20px;"></div>

            <script>
    async function searchMovies() {
        const query = document.getElementById('searchBox').value.trim();
        if (!query) return alert('Please enter a movie title!');
        
        const apiKey = 'YOUR_TMDB_API_KEY'; // <-- Replace with your real TMDB API key
        const searchUrl = \`https://api.themoviedb.org/3/search/movie?api_key=\${apiKey}&query=\${encodeURIComponent(query)}\`;

        const searchRes = await node-fetch(searchUrl);
        const searchData = await searchRes.json();

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (!searchData.results || searchData.results.length === 0) {
            resultsDiv.innerHTML = '<p>No movies found. 😢</p>';
            return;
        }

        for (const movie of searchData.results) {
            const tmdbId = movie.id;
            const title = movie.title;
            const year = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';
            const posterPath = movie.poster_path 
                ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path 
                : 'https://via.placeholder.com/150x225?text=No+Image'; // Fallback

            // Fetch external IDs to get IMDb ID
            const externalRes = await node-fetch(\`https://api.themoviedb.org/3/movie/\${tmdbId}/external_ids?api_key=\${apiKey}\`);
            const externalData = await externalRes.json();
            const imdbId = externalData.imdb_id;

            if (!imdbId) continue; // skip if no IMDb ID

            const div = document.createElement('div');
            div.className = 'movie';
            div.innerHTML = \`
                <img src="\${posterPath}" alt="Poster" style="width:100px; height:auto; float:left; margin-right:20px; border-radius:10px;" />
                <div style="overflow:hidden;">
                    <b>\${title}</b> (\${year})<br/>
                    IMDb ID: <code>\${imdbId}</code>
                    <button class="button-copy" onclick="copyToClipboard('\${imdbId}')">📋 Copy</button>
                </div>
                <div style="clear:both;"></div>
            \`;
            resultsDiv.appendChild(div);
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Copied to clipboard: ' + text))
            .catch(err => console.error('Error copying:', err));
    }
</script>

        </body>
        </html>
    `);
});
