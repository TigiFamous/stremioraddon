const express = require('express');
const app = express();
require('dotenv').config(); // Add dotenv to load environment variables

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Seyhi</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; background: #0f0f0f; color: #f0f0f0; }
                h1 { color: #e91e63; text-align: center}
                p { text-align: center}
                input, button { padding: 10px; font-size: 16px; margin: 5px; }
                .center {display: flex; justify-content: center}
                .movie { margin: 10px 0; padding: 10px; background: #1f1f1f; border-radius: 8px; }
                .button-play { margin-left: 10px; background: #4CAF50; color: white; border: none; padding: 20px 50px; border-radius: 5px; cursor: pointer; }
                .button-play:hover { background: #388E3C; }
                #player-container { margin-top: 30px; width: 100%; display: none; }
                #video-player { width: 100%; height: 600px; border: none; }
                @media (max-width: 768px) {
                    #video-player { height: 400px; }
                }
                @media (max-width: 480px) {
                    #video-player { height: 300px; }
                }
            </style>
        </head>
        <body>
       
            <h1>Seyhi сайт</h1>
            <p>Търси име на филм и пускай безплатно</p>
            <div class="center">
            <input type="text" id="searchBox" placeholder="Въведи заглавие..." />
            <button onclick="searchMovies()">Търси</button>
        </div>
            <div id="results" style="margin-top: 20px;"></div>
            
            <!-- Player container -->
            <div id="player-container">
                <h2 id="now-playing">Now Playing: <span id="movie-title"></span></h2>
                <iframe id="video-player" allowfullscreen referrerpolicy="no-referrer"> </iframe>
            </div>
            
            <script>
                async function searchMovies() {
                    const query = document.getElementById('searchBox').value.trim();
                    if (!query) return alert('Please enter a movie title!');
                    
                    // Hide player when starting a new search
                    document.getElementById('player-container').style.display = 'none';
                    
                    // Use API key or token from server-side environment variable
                    const apiKey = '${process.env.TMDB_API_KEY || "YOUR_TMDB_API_KEY"}';
                    
                    try {
                        // If using API key directly in URL
                        const searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + encodeURIComponent(query);
                        const searchRes = await fetch(searchUrl);
                        
                        // Alternative if using Bearer token:
                        // const token = '${process.env.TMDB_ACCESS_TOKEN}';
                        // const options = {
                        //     method: 'GET',
                        //     headers: {
                        //         'Authorization': 'Bearer ' + token,
                        //         'Content-Type': 'application/json'
                        //     }
                        // };
                        // const searchUrl = 'https://api.themoviedb.org/3/search/movie?query=' + encodeURIComponent(query);
                        // const searchRes = await fetch(searchUrl, options);
                        
                        const searchData = await searchRes.json();
                        
                        const resultsDiv = document.getElementById('results');
                        resultsDiv.innerHTML = '';
                        
                        if (!searchData.results || searchData.results.length === 0) {
                            resultsDiv.innerHTML = '<p>Няма намерени филми. 😢</p>';
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
                                    <button class="button-play" onclick="playMovie(\${tmdbId}, '\${title}')"Play</button>
                                </div>
                                <div style="clear:both;"></div>
                            \`;
                            resultsDiv.appendChild(div);
                        }
                    } catch (error) {
                        console.error('Error searching movies:', error);
                        alert('Error searching for movies: ' + error.message);
                    }
                }
                
                function playMovie(tmdbId, title) {
                    // Set the iframe source to the vidsrc player
                    const videoUrl = 'https://vidsrc.xyz/embed/movie/' + tmdbId + '/';
                    document.getElementById('video-player').src = videoUrl;
                    document.getElementById('movie-title').textContent = title;
                    document.getElementById('player-container').style.display = 'block';
                    
                    // Scroll to the player
                    document.getElementById('player-container').scrollIntoView({ behavior: 'smooth' });
                }
            </script>
        </body>
        </html>
    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
