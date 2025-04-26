const express = require('express');
const app = express();  // Initialize app

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Vidsrc Movie Search</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; background: #0f0f0f; color: #f0f0f0; }
                h1 { color: #e91e63; }
                input, button { padding: 10px; font-size: 16px; margin: 5px; }
                .movie { margin: 10px 0; padding: 10px; background: #1f1f1f; border-radius: 8px; }
                .button-play { margin-left: 10px; background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
                .button-play:hover { background: #388E3C; }
            </style>
        </head>
        <body>
            <h1>🎬 Vidsrc Movie Search</h1>
            <p>Find movies by title and play them directly with vidsrc</p>
            <input type="text" id="searchBox" placeholder="Enter movie title..." />
            <button onclick="searchMovies()">🔍 Search</button>
            <div id="results" style="margin-top: 20px;"></div>
            <script>
                async function searchMovies() {
                    const query = document.getElementById('searchBox').value.trim();
                    if (!query) return alert('Please enter a movie title!');
                    
                    const token = 'YOUR_TMDB_ACCESS_TOKEN'; // Replace with your real TMDB access token
                    const options = {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    };
                    
                    try {
                        const searchUrl = 'https://api.themoviedb.org/3/search/movie?query=' + encodeURIComponent(query);
                        const searchRes = await fetch(searchUrl, options);
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
                                : 'https://via.placeholder.com/150x225?text=No+Image';
                            
                            const div = document.createElement('div');
                            div.className = 'movie';
                            div.innerHTML = \`
                                <img src="\${posterPath}" alt="Poster" style="width:100px; height:auto; float:left; margin-right:20px; border-radius:10px;" />
                                <div style="overflow:hidden;">
                                    <b>\${title}</b> (\${year})<br/>
                                    TMDB ID: <code>\${tmdbId}</code>
                                    <button class="button-play" onclick="playMovie(\${tmdbId})">▶️ Play</button>
                                </div>
                                <div style="clear:both;"></div>
                            \`;
                            resultsDiv.appendChild(div);
                        }
                    } catch (error) {
                        console.error('Error searching movies:', error);
                        alert('Error searching for movies. Check console for details.');
                    }
                }
                
                function playMovie(tmdbId) {
                    const videoUrl = 'https://vidsrc.xyz/embed/movie?tmdb=' + tmdbId + '/';
                    window.open(videoUrl, '_blank');
                }
            </script>
        </body>
        </html>
    `);
});

const port = 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
