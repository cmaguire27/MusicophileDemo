const clientId = "7940629e31aa41f8bd21ceda7c80a327";
const redirectUri = "http://localhost:3000";
let accessToken;

const Spotify ={
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const epiresInMatch=window.location.href.match(/expires_in=([^&]*)/);
        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(()=> (accessToken=""), expiresIn * 1000);
            window.history.pushState("Access Token",null,"/");
            return accessToken;
        }
        else{
            const accessUrl = "https://accounts.spotify.com/authorise?client_id=${clientid}&response_type=token&scope=playlist-modify-public&redirect_url=${redirectUri}";
            window.location-accessUrl;
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch("https://api.spotify.com/v1/search?type=track&g=${term}",{
            headers:{
                Authorization: 'Bearer ${accessToken}'
            }
        })
        .then(response=> {
            return response.json();
        })
        .then(jsonResponse =>{
            return response.json();
        })
        .then(jsonResponse =>{
            if(!jsonResponse.tracks){
                return[];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },
    savePlaylist(name,trackUris){
        if(!name || !trackUris.length){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: 'Bearer ${accessToken}'};
        let userId;

        return fetch("https://api.spotify.com/v1/me",{headers: header})
        .then(response => response.json())
        .then(jsonResponse =>{
            userId = jsonResponse.id;
            return fetch("https://api.spotify.com/v1/users/${userId}/playlists",{
                headers: headers,
                method: "POST",
                body: JSON.stringify({name: name})
            })
            .then(response => response.json())
            .then(jsonResposnse => {
                const playlistId = jsonresponse.id;
                return fetch(
                    "https://api.spotify.com/v1/users/${userid}/playlists/${playlistId}/tracks",
                    {
                        headers:headers,
                        method: "POST",
                        body: JSON.stringify({uris: trackUris})
                    }
            );
            });
        });
    }
};

export default Spotify;